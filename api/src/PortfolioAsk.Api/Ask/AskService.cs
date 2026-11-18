using System.Diagnostics;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Options;
using PortfolioAsk.Api.Limits;
using PortfolioAsk.Core;

namespace PortfolioAsk.Api.Ask;

/// <summary>Thrown when Anthropic's API fails or times out. The section shows the paused state.</summary>
public sealed class ModelUnavailableException(string message, Exception? inner = null) : Exception(message, inner);

/// <summary>
/// One question, start to finish: embed it locally, take the closest chunks, refuse without a model call if
/// nothing is close, otherwise make one call through the kill switch and budget layers and validate the answer.
/// Logs one line per question with the outcome, score, tokens and time, and never the question itself.
/// </summary>
public sealed class AskService
{
    private readonly IEmbeddingGenerator<string, Embedding<float>> embedder;
    private readonly DocIndex index;
    private readonly IChatClient chat;
    private readonly IOptionsMonitor<AskOptions> options;
    private readonly ILogger<AskService> logger;

    public AskService(
        IEmbeddingGenerator<string, Embedding<float>> embedder,
        DocIndex index,
        [FromKeyedServices(AnthropicModel.ServiceKey)] IChatClient model,
        TokenBudget budget,
        IOptionsMonitor<AskOptions> options,
        ILoggerFactory loggers)
    {
        this.embedder = embedder;
        this.index = index;
        this.options = options;
        logger = loggers.CreateLogger<AskService>();
        chat = new KillSwitchChatClient(
            new TokenBudgetChatClient(model, budget, loggers.CreateLogger<TokenBudgetChatClient>()),
            options);
    }

    public async Task<AskResponse> AskAsync(string question, CancellationToken cancellationToken)
    {
        var settings = options.CurrentValue;
        if (!settings.Enabled)
        {
            throw new AskPausedException();
        }

        var started = Stopwatch.GetTimestamp();
        var vector = await embedder.GenerateVectorAsync(question, cancellationToken: cancellationToken);
        var hits = index.Search(vector.Span, settings.TopK);
        var topScore = hits.Count > 0 ? hits[0].Score : 0f;

        if (topScore < settings.MinScore)
        {
            Log("refused", RefusalReasons.NotInDocs, topScore, null, 0, started);
            return AskResponse.Refusal(RefusalReasons.NotInDocs);
        }

        var messages = PromptBuilder.Build(question, hits, index.File.Repos);
        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        timeout.CancelAfter(TimeSpan.FromSeconds(settings.TimeoutSeconds));

        ChatResponse response;
        try
        {
            response = await chat.GetResponseAsync(messages, AnthropicModel.ChatOptions(settings), timeout.Token);
        }
        catch (Exception ex) when (ex is AskPausedException or BudgetExhaustedException)
        {
            Log("refused", ex is AskPausedException ? RefusalReasons.Paused : RefusalReasons.Budget, topScore, null, 0, started);
            throw;
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            // The type is enough to diagnose; messages can echo request details, so they stay out of the log.
            logger.LogWarning("Model call failed with {ErrorType}", ex.GetType().Name);
            Log("failed", RefusalReasons.Unavailable, topScore, null, 0, started);
            throw new ModelUnavailableException("The model call failed.", ex);
        }

        var validated = AnswerValidator.Validate(response, hits, index.File.Repos);
        var result = validated.Response;
        Log(result.Refused ? "refused" : "answered", result.Reason, topScore, response.Usage, validated.UnknownMarkers, started);
        return result;
    }

    private void Log(string outcome, string? reason, float topScore, UsageDetails? usage, int unknownMarkers, long started) =>
        logger.LogInformation(
            "Ask {Outcome} {Reason}: top score {TopScore:F3}, {InputTokens} in / {OutputTokens} out tokens, {UnknownMarkers} unknown citations, {ElapsedMs} ms",
            outcome,
            reason ?? "-",
            topScore,
            usage?.InputTokenCount ?? 0,
            usage?.OutputTokenCount ?? 0,
            unknownMarkers,
            (long)Stopwatch.GetElapsedTime(started).TotalMilliseconds);
}
