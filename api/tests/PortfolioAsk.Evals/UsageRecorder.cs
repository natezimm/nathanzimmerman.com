using Microsoft.Extensions.AI;

namespace PortfolioAsk.Evals;

/// <summary>Wraps the real model client and keeps the usage of the last call, for the cost column.</summary>
public sealed class UsageRecorder(IChatClient inner) : DelegatingChatClient(inner)
{
    public UsageDetails? Last { get; private set; }

    public override async Task<ChatResponse> GetResponseAsync(
        IEnumerable<ChatMessage> messages, ChatOptions? options = null, CancellationToken cancellationToken = default)
    {
        var response = await base.GetResponseAsync(messages, options, cancellationToken);
        Last = response.Usage;
        return response;
    }

    public void Reset() => Last = null;
}
