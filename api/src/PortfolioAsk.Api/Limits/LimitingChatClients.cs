using Microsoft.Extensions.AI;
using Microsoft.Extensions.Options;
using PortfolioAsk.Api.Ask;

namespace PortfolioAsk.Api.Limits;

/// <summary>Thrown when the kill switch (<c>Ask:Enabled</c>) is off.</summary>
public sealed class AskPausedException() : Exception("Ask my portfolio is paused.");

/// <summary>
/// The outer layer around the model: refuses every call while <c>Ask:Enabled</c> is false, so a config change
/// stops all spending even if a caller forgot to check. Streaming is refused too; nothing here uses it, and
/// allowing it would be a way round the budget layer.
/// </summary>
public sealed class KillSwitchChatClient(IChatClient inner, IOptionsMonitor<AskOptions> options) : DelegatingChatClient(inner)
{
    public override Task<ChatResponse> GetResponseAsync(
        IEnumerable<ChatMessage> messages, ChatOptions? chatOptions = null, CancellationToken cancellationToken = default)
    {
        if (!options.CurrentValue.Enabled)
        {
            throw new AskPausedException();
        }

        return base.GetResponseAsync(messages, chatOptions, cancellationToken);
    }

    public override IAsyncEnumerable<ChatResponseUpdate> GetStreamingResponseAsync(
        IEnumerable<ChatMessage> messages, ChatOptions? chatOptions = null, CancellationToken cancellationToken = default) =>
        throw new NotSupportedException("Ask my portfolio does not stream.");
}

/// <summary>
/// Refuses a call before it is made when today's budget is spent, and records each response's usage after it.
/// A response without usage counts as <see cref="UnreportedUsage"/> tokens, so a missing field can't make calls free.
/// </summary>
public sealed class TokenBudgetChatClient(IChatClient inner, TokenBudget budget, ILogger<TokenBudgetChatClient> logger) : DelegatingChatClient(inner)
{
    public const long UnreportedUsage = 4_000;

    public override async Task<ChatResponse> GetResponseAsync(
        IEnumerable<ChatMessage> messages, ChatOptions? chatOptions = null, CancellationToken cancellationToken = default)
    {
        if (budget.IsSpent)
        {
            throw new BudgetExhaustedException();
        }

        var response = await base.GetResponseAsync(messages, chatOptions, cancellationToken);
        var tokens = response.Usage?.TotalTokenCount
            ?? (response.Usage is { InputTokenCount: { } input, OutputTokenCount: { } output } ? input + output : null);
        if (tokens is null)
        {
            logger.LogWarning("A response had no usage; counting {Tokens} tokens", UnreportedUsage);
        }

        budget.Record(tokens ?? UnreportedUsage);
        return response;
    }

    public override IAsyncEnumerable<ChatResponseUpdate> GetStreamingResponseAsync(
        IEnumerable<ChatMessage> messages, ChatOptions? chatOptions = null, CancellationToken cancellationToken = default) =>
        throw new NotSupportedException("Ask my portfolio does not stream.");
}
