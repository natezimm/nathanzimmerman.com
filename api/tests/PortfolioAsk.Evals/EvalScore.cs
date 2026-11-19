using System.Globalization;
using System.Text;
using PortfolioAsk.Api.Ask;
using PortfolioAsk.Indexer;

namespace PortfolioAsk.Evals;

/// <summary>What one eval question got back, and what it cost.</summary>
public sealed record EvalOutcome(EvalCase Case, AskResponse Response, long InputTokens, long OutputTokens, TimeSpan Elapsed)
{
    private IEnumerable<ExpectedSource> Allowed => (Case.Expect ?? []).Concat(Case.Allow ?? []);

    /// <summary>An answerable question whose citations include an expected file.</summary>
    public bool Hit => !Case.Refuse && !Response.Refused
        && Response.Citations.Any(c => (Case.Expect ?? []).Any(e => Matches(e, c)));

    /// <summary>Cited files that are expected or allowed for this question.</summary>
    public int PreciseCitations => Response.Citations.Count(c => Allowed.Any(e => Matches(e, c)));

    /// <summary>
    /// The pipeline never got a verdict from the model (an outage, the budget or the kill switch). That says nothing
    /// about refusal behavior, so it never counts as a correct refusal and fails the run.
    /// </summary>
    public bool NoVerdict => Response.Reason is RefusalReasons.Unavailable or RefusalReasons.Budget or RefusalReasons.Paused;

    /// <summary>A must-refuse question that was refused for a real reason, not because the model was unreachable.</summary>
    public bool CorrectlyRefused => Case.Refuse && Response.Refused && !NoVerdict;

    public bool ContainsAll => (Case.MustContain ?? []).All(term => Response.Answer.Contains(term, StringComparison.OrdinalIgnoreCase));

    private static bool Matches(ExpectedSource expected, Citation cited) => expected.Repo == cited.Repo && expected.Path == cited.Path;
}

/// <summary>
/// The section 9 scores. Refusal accuracy, hit rate and false refusals fail the run; precision and must-contain
/// terms are reported only, since "plainly relevant" citations outside the expected list are not mistakes.
/// </summary>
public sealed class EvalScore(IReadOnlyList<EvalOutcome> outcomes)
{
    public const double MinHitRate = 0.90;
    public const double MaxFalseRefusals = 0.10;
    public const double PrecisionTarget = 0.85;

    /// <summary>Claude Haiku 5.5, dollars per million tokens, for prompts under 100K tokens.</summary>
    public const decimal InputPrice = 0.10m;
    public const decimal OutputPrice = 0.50m;

    private IReadOnlyList<EvalOutcome> Answerable => outcomes.Where(o => !o.Case.Refuse).ToList();

    private IReadOnlyList<EvalOutcome> MustRefuse => outcomes.Where(o => o.Case.Refuse).ToList();

    public double HitRate => Ratio(Answerable.Count(o => o.Hit), Answerable.Count);

    public double FalseRefusals => Ratio(Answerable.Count(o => o.Response.Refused), Answerable.Count);

    public double RefusalAccuracy => Ratio(MustRefuse.Count(o => o.CorrectlyRefused), MustRefuse.Count);

    public double Precision
    {
        get
        {
            var cited = Answerable.Sum(o => o.Response.Citations.Count);
            return Ratio(Answerable.Sum(o => o.PreciseCitations), cited);
        }
    }

    public double MustContainRate
    {
        get
        {
            var withTerms = Answerable.Where(o => o.Case.MustContain is { Count: > 0 } && !o.Response.Refused).ToList();
            return Ratio(withTerms.Count(o => o.ContainsAll), withTerms.Count);
        }
    }

    public decimal Cost => (outcomes.Sum(o => o.InputTokens) * InputPrice + outcomes.Sum(o => o.OutputTokens) * OutputPrice) / 1_000_000m;

    public TimeSpan MedianLatency
    {
        get
        {
            var sorted = outcomes.Where(o => o.InputTokens > 0).Select(o => o.Elapsed).Order().ToList();
            return sorted.Count == 0 ? TimeSpan.Zero : sorted[sorted.Count / 2];
        }
    }

    /// <summary>Why the run fails, or empty when it passes.</summary>
    public IReadOnlyList<string> Failures()
    {
        var failures = new List<string>();
        foreach (var unscored in outcomes.Where(o => o.NoVerdict))
        {
            failures.Add($"{unscored.Case.Id} got no answer from the model ({unscored.Response.Reason}); rerun the eval");
        }

        foreach (var missed in MustRefuse.Where(o => !o.Response.Refused))
        {
            failures.Add($"{missed.Case.Id} should have been refused");
        }

        if (HitRate < MinHitRate)
        {
            failures.Add($"citation hit rate {HitRate:P0} is under {MinHitRate:P0}");
        }

        if (FalseRefusals > MaxFalseRefusals)
        {
            failures.Add($"false refusals {FalseRefusals:P0} are over {MaxFalseRefusals:P0}");
        }

        return failures;
    }

    /// <summary>A Markdown report: the scores, then one row per question.</summary>
    public string ToMarkdown(string settings)
    {
        var md = new StringBuilder();
        md.AppendLine(CultureInfo.InvariantCulture, $"### Ask my portfolio eval ({settings})");
        md.AppendLine();
        md.AppendLine("| Score | Result | Target |");
        md.AppendLine("| --- | --- | --- |");
        md.AppendLine(CultureInfo.InvariantCulture, $"| Citation hit rate | {HitRate:P0} | {MinHitRate:P0} or more |");
        md.AppendLine(CultureInfo.InvariantCulture, $"| Citation precision | {Precision:P0} | {PrecisionTarget:P0} or more (reported) |");
        md.AppendLine(CultureInfo.InvariantCulture, $"| Refusal accuracy | {RefusalAccuracy:P0} | 100% |");
        md.AppendLine(CultureInfo.InvariantCulture, $"| False refusals | {FalseRefusals:P0} | {MaxFalseRefusals:P0} or less |");
        md.AppendLine(CultureInfo.InvariantCulture, $"| Must-contain terms | {MustContainRate:P0} | reported |");
        md.AppendLine(CultureInfo.InvariantCulture, $"| Cost | ${Cost:F4} | |");
        md.AppendLine(CultureInfo.InvariantCulture, $"| Median latency (model calls) | {MedianLatency.TotalMilliseconds:F0} ms | |");
        md.AppendLine();
        md.AppendLine("| Case | Expected | Got | Cited | Tokens in / out | ms |");
        md.AppendLine("| --- | --- | --- | --- | --- | --- |");
        foreach (var o in outcomes)
        {
            var expected = o.Case.Refuse ? "refuse" : "answer";
            var got = o.Response.Refused ? $"refused ({o.Response.Reason})" : "answered";
            var mark = o.NoVerdict ? "⚠️" : o.Case.Refuse ? (o.CorrectlyRefused ? "✅" : "❌") : (o.Hit ? "✅" : "❌");
            var cited = string.Join(", ", o.Response.Citations.Select(c => $"{c.Repo}/{c.Path}"));
            md.AppendLine(CultureInfo.InvariantCulture,
                $"| {mark} {o.Case.Id} | {expected} | {got} | {cited} | {o.InputTokens} / {o.OutputTokens} | {o.Elapsed.TotalMilliseconds:F0} |");
        }

        return md.ToString();
    }

    private static double Ratio(int part, int whole) => whole == 0 ? 1 : (double)part / whole;
}
