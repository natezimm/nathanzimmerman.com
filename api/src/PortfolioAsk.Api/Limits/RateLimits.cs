using System.Text.Json;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using PortfolioAsk.Api.Ask;

namespace PortfolioAsk.Api.Limits;

/// <summary>
/// Limits on <c>POST /api/ask</c>, stricter than the sibling apps' because every question can cost money:
/// per address, a few a minute and a few dozen a day; across everyone, a ceiling a minute and two at a time
/// (later ones wait briefly in a queue). Fixed windows, in memory, so a restart resets them.
/// Other endpoints are cheap reads and are not limited here.
/// </summary>
public static class RateLimits
{
    private const int QueueLength = 8;

    public static IServiceCollection AddAskRateLimits(this IServiceCollection services)
    {
        services.AddRateLimiter(_ => { });
        services.AddOptions<RateLimiterOptions>().Configure<IOptions<AskOptions>>((options, ask) =>
        {
            var limits = ask.Value;
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.OnRejected = async (context, cancellationToken) =>
            {
                context.HttpContext.Response.Headers.RetryAfter = "60";
                await context.HttpContext.Response.WriteAsJsonAsync(
                    AskResponse.Refusal(RefusalReasons.RateLimited), JsonSerializerOptions.Web, cancellationToken);
            };
            options.GlobalLimiter = PartitionedRateLimiter.CreateChained(
                PartitionedRateLimiter.Create<HttpContext, string>(http => IsQuestion(http)
                    ? Fixed($"minute:{Caller(http)}", limits.QuestionsPerMinute, TimeSpan.FromMinutes(1))
                    : RateLimitPartition.GetNoLimiter("")),
                PartitionedRateLimiter.Create<HttpContext, string>(http => IsQuestion(http)
                    ? Fixed($"day:{Caller(http)}", limits.QuestionsPerDay, TimeSpan.FromDays(1))
                    : RateLimitPartition.GetNoLimiter("")),
                PartitionedRateLimiter.Create<HttpContext, string>(http => IsQuestion(http)
                    ? Fixed("everyone", limits.GlobalQuestionsPerMinute, TimeSpan.FromMinutes(1))
                    : RateLimitPartition.GetNoLimiter("")),
                PartitionedRateLimiter.Create<HttpContext, string>(http => IsQuestion(http)
                    ? RateLimitPartition.GetConcurrencyLimiter("in-flight", _ => new ConcurrencyLimiterOptions
                    {
                        PermitLimit = limits.MaxConcurrentQuestions,
                        QueueLimit = QueueLength,
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    })
                    : RateLimitPartition.GetNoLimiter("")));
        });
        return services;
    }

    private static bool IsQuestion(HttpContext http) =>
        HttpMethods.IsPost(http.Request.Method) && http.Request.Path.Equals(AskEndpoints.AskPath, StringComparison.OrdinalIgnoreCase);

    /// <summary>
    /// The visitor's address, from X-Forwarded-For when nginx is a trusted proxy. A request with no address
    /// shares one bucket rather than going unlimited.
    /// </summary>
    private static string Caller(HttpContext http) => http.Connection.RemoteIpAddress?.ToString() ?? "unknown";

    private static RateLimitPartition<string> Fixed(string key, int permits, TimeSpan window) =>
        RateLimitPartition.GetFixedWindowLimiter(key, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = permits,
            Window = window,
            QueueLimit = 0,
        });
}
