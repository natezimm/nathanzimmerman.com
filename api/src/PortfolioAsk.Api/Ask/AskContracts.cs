namespace PortfolioAsk.Api.Ask;

/// <summary>The body of <c>POST /api/ask</c>.</summary>
public sealed record AskRequest(string? Question);

/// <summary>A numbered source under an answer. The URL is built by the server, never by the model.</summary>
public sealed record Citation(int N, string Repo, string RepoTitle, string Path, string Heading, string Url);

/// <summary>
/// The answer to one question. When <see cref="Refused"/> is true, <see cref="Answer"/> is empty and
/// <see cref="Reason"/> says why, so the section can show the right message.
/// </summary>
public sealed record AskResponse(string Answer, IReadOnlyList<Citation> Citations, bool Refused, string? Reason)
{
    public static AskResponse Refusal(string reason) => new("", [], true, reason);
}

/// <summary>Why a question got no answer.</summary>
public static class RefusalReasons
{
    /// <summary>Retrieval found nothing close, the model said the sources don't cover it, or it cited nothing real.</summary>
    public const string NotInDocs = "not_in_docs";

    /// <summary>The model declined to answer (a <c>refusal</c> stop reason).</summary>
    public const string Declined = "declined";

    /// <summary>The model ran out of output tokens or returned something that isn't the expected JSON.</summary>
    public const string Incomplete = "incomplete";

    /// <summary>The kill switch is off.</summary>
    public const string Paused = "paused";

    /// <summary>Today's token budget is spent.</summary>
    public const string Budget = "budget";

    /// <summary>Anthropic's API failed or timed out.</summary>
    public const string Unavailable = "unavailable";

    /// <summary>Too many questions from this address, or from everyone at once.</summary>
    public const string RateLimited = "rate_limited";
}

/// <summary>The body of <c>GET /api/ask/meta</c>.</summary>
public sealed record AskMeta(
    bool Enabled,
    IReadOnlyList<string> Suggestions,
    AskMetaCounts Counts,
    IReadOnlyList<AskMetaRepo> Repos);

public sealed record AskMetaCounts(int Files, int DecisionRecords, int Readmes, int Chunks);

/// <summary>A repository and the commit its docs were indexed at.</summary>
public sealed record AskMetaRepo(string Key, string Title, string GitHub, string Commit);
