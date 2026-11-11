using Microsoft.Extensions.Options;
using PortfolioAsk.Api.Ask;

namespace PortfolioAsk.Api.Limits;

/// <summary>Thrown before a model call when today's token budget is spent.</summary>
public sealed class BudgetExhaustedException() : Exception("Today's token budget is spent.");

/// <summary>
/// Input plus output tokens used today, counted in memory from each response's usage and reset at midnight
/// in <see cref="AskOptions.TimeZone"/>. A restart forgets the count; the prepaid credit is the cap that
/// survives one. Two calls running at once can overshoot the budget by one answer each, which is fine.
/// </summary>
public sealed class TokenBudget
{
    private readonly Lock gate = new();
    private readonly TimeProvider time;
    private readonly IOptionsMonitor<AskOptions> options;
    private readonly TimeZoneInfo zone;
    private DateOnly day;
    private long used;

    public TokenBudget(TimeProvider time, IOptionsMonitor<AskOptions> options, ILogger<TokenBudget> logger)
    {
        this.time = time;
        this.options = options;
        if (!TimeZoneInfo.TryFindSystemTimeZoneById(options.CurrentValue.TimeZone, out var found))
        {
            logger.LogWarning("Time zone {TimeZone} is not installed; the token budget resets at midnight UTC", options.CurrentValue.TimeZone);
            found = TimeZoneInfo.Utc;
        }

        zone = found;
        day = Today();
    }

    /// <summary>Tokens used so far today.</summary>
    public long Used
    {
        get
        {
            lock (gate)
            {
                Roll();
                return used;
            }
        }
    }

    public bool IsSpent => Used >= options.CurrentValue.DailyTokenBudget;

    public void Record(long tokens)
    {
        lock (gate)
        {
            Roll();
            used += Math.Max(0, tokens);
        }
    }

    private void Roll()
    {
        var today = Today();
        if (today != day)
        {
            day = today;
            used = 0;
        }
    }

    private DateOnly Today() => DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(time.GetUtcNow(), zone).DateTime);
}
