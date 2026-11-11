using Microsoft.Extensions.AI;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using PortfolioAsk.Api.Ask;
using PortfolioAsk.Api.Limits;

namespace PortfolioAsk.Tests.Api;

public sealed class LimitTests
{
    private static IOptionsMonitor<AskOptions> Options(AskOptions options) =>
        new OptionsMonitor<AskOptions>(new OptionsFactory<AskOptions>([new ConfigureOptions<AskOptions>(o =>
        {
            o.Enabled = options.Enabled;
            o.DailyTokenBudget = options.DailyTokenBudget;
            o.TimeZone = options.TimeZone;
        })], []), [], new OptionsCache<AskOptions>());

    [Fact]
    public void The_budget_resets_at_midnight_eastern_not_utc()
    {
        // 23:30 in New York on 10 November is 04:30 UTC on 11 November.
        var time = new ManualTime(new DateTimeOffset(2026, 11, 11, 4, 30, 0, TimeSpan.Zero));
        var budget = new TokenBudget(time, Options(new AskOptions { DailyTokenBudget = 1_000 }), NullLogger<TokenBudget>.Instance);

        budget.Record(1_000);
        Assert.True(budget.IsSpent);

        time.Now = time.Now.AddMinutes(29);
        Assert.True(budget.IsSpent);

        time.Now = time.Now.AddMinutes(1);
        Assert.Equal(0, budget.Used);
        Assert.False(budget.IsSpent);
    }

    [Fact]
    public async Task The_kill_switch_layer_refuses_calls_and_streaming_whoever_calls_it()
    {
        var fake = new FakeChatClient();
        var options = Options(new AskOptions { Enabled = false });
        using var paused = new KillSwitchChatClient(fake, options);

        await Assert.ThrowsAsync<AskPausedException>(() => paused.GetResponseAsync([new ChatMessage(ChatRole.User, "hi")]));
        Assert.Throws<NotSupportedException>(() => paused.GetStreamingResponseAsync([new ChatMessage(ChatRole.User, "hi")]));
        Assert.Empty(fake.Requests);
    }

    [Fact]
    public async Task A_response_without_usage_still_counts_against_the_budget()
    {
        var fake = new FakeChatClient().Then(() => new ChatResponse(new ChatMessage(ChatRole.Assistant, "{}")));
        var budget = new TokenBudget(TimeProvider.System, Options(new AskOptions { DailyTokenBudget = 1_000_000 }), NullLogger<TokenBudget>.Instance);
        using var client = new TokenBudgetChatClient(fake, budget, NullLogger<TokenBudgetChatClient>.Instance);

        await client.GetResponseAsync([new ChatMessage(ChatRole.User, "hi")]);

        Assert.Equal(TokenBudgetChatClient.UnreportedUsage, budget.Used);
    }
}
