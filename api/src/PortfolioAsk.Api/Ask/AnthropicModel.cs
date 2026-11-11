using Anthropic;
using Anthropic.Helpers;
using Anthropic.Models.Messages;
using Microsoft.Extensions.AI;

namespace PortfolioAsk.Api.Ask;

/// <summary>
/// Claude Haiku 5.5 through the Anthropic SDK's Microsoft.Extensions.AI adapter (<c>AsIChatClient</c>).
/// The adapter maps <c>stop_reason</c> to <see cref="ChatResponse.FinishReason"/> (max_tokens to Length,
/// refusal to ContentFilter) and <c>usage</c> to <see cref="ChatResponse.Usage"/>; the request fields it has no
/// portable name for go through <see cref="ChatOptions.RawRepresentationFactory"/>, which it leaves untouched.
/// </summary>
public static class AnthropicModel
{
    /// <summary>The service key of the raw model client, before the kill switch and budget layers.</summary>
    public const string ServiceKey = "anthropic";

    /// <summary>
    /// The SDK client. The key comes from configuration (<c>ANTHROPIC_API_KEY</c> in the container's environment)
    /// and is never logged. One retry, inside the request's own timeout. Tests pass an <paramref name="http"/>
    /// client that answers locally.
    /// </summary>
    public static IAnthropicClient CreateClient(IConfiguration configuration, AskOptions options, HttpClient? http = null)
    {
        var key = configuration["ANTHROPIC_API_KEY"];
        var timeout = TimeSpan.FromSeconds(options.TimeoutSeconds);
        IAnthropicClient client = string.IsNullOrEmpty(key)
            ? new AnthropicClient { MaxRetries = 1, Timeout = timeout }
            : new AnthropicClient { ApiKey = key, MaxRetries = 1, Timeout = timeout };
        return http is null ? client : client.WithOptions(o => o with { HttpClient = http });
    }

    public static IChatClient CreateChatClient(IAnthropicClient client, AskOptions options) =>
        client.AsIChatClient(options.Model, options.MaxOutputTokens);

    /// <summary>
    /// Thinking off at low effort (Haiku 5.5 accepts disabled thinking at effort high or below), and the answer
    /// constrained to <see cref="ModelAnswer"/>'s JSON schema.
    /// </summary>
    public static ChatOptions ChatOptions(AskOptions options) => new()
    {
        ModelId = options.Model,
        MaxOutputTokens = options.MaxOutputTokens,
        RawRepresentationFactory = _ => new MessageCreateParams
        {
            Model = options.Model,
            MaxTokens = options.MaxOutputTokens,
            Messages = [],
            Thinking = new ThinkingConfigDisabled(),
            OutputConfig = new OutputConfig
            {
                Effort = Effort.Low,
                Format = StructuredOutput.CreateJsonFormat<ModelAnswer>(),
            },
        },
    };
}
