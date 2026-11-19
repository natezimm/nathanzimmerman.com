namespace PortfolioAsk.Evals;

/// <summary>
/// A test that calls the real model. Skipped unless <c>ANTHROPIC_API_KEY</c> is set, so <c>dotnet test</c> on a
/// pull request never spends money; <c>ask-evals.yml</c> runs it on demand.
/// </summary>
public sealed class LiveFactAttribute : FactAttribute
{
    public LiveFactAttribute()
    {
        if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ANTHROPIC_API_KEY")))
        {
            Skip = "Set ANTHROPIC_API_KEY to run the paid eval.";
        }
    }
}
