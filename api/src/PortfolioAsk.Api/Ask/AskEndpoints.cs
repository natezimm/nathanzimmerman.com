using System.Text.Json;
using Microsoft.Extensions.Options;
using PortfolioAsk.Api.Limits;
using PortfolioAsk.Core;

namespace PortfolioAsk.Api.Ask;

public static class AskEndpoints
{
    public const string AskPath = "/api/ask";
    public const int MaxQuestionChars = 300;
    public const int MaxBodyBytes = 2048;

    public static IEndpointRouteBuilder MapAsk(this IEndpointRouteBuilder app)
    {
        app.MapPost(AskPath, Ask);
        app.MapGet($"{AskPath}/meta", Meta);
        return app;
    }

    /// <summary>
    /// <c>POST /api/ask</c> with <c>{ "question": "..." }</c>. 200 with an answer or a refusal; 400 for a bad body;
    /// 503 with reason paused, budget or unavailable. 403 (wrong Origin) and 429 come from the middleware.
    /// </summary>
    private static async Task<IResult> Ask(HttpContext http, AskService ask, CancellationToken cancellationToken)
    {
        var question = await ReadQuestion(http.Request, cancellationToken);
        if (question is null)
        {
            return Results.BadRequest(new { error = $"Send {{\"question\": \"...\"}} with 1 to {MaxQuestionChars} characters." });
        }

        try
        {
            return Results.Ok(await ask.AskAsync(question, cancellationToken));
        }
        catch (AskPausedException)
        {
            return Unavailable(RefusalReasons.Paused);
        }
        catch (BudgetExhaustedException)
        {
            return Unavailable(RefusalReasons.Budget);
        }
        catch (ModelUnavailableException)
        {
            return Unavailable(RefusalReasons.Unavailable);
        }
    }

    /// <summary><c>GET /api/ask/meta</c>: whether the box is on, its suggestions, and what the index holds.</summary>
    private static IResult Meta(HttpContext http, DocIndex index, IOptionsMonitor<AskOptions> options)
    {
        var settings = options.CurrentValue;
        var counts = index.File.Counts;
        http.Response.Headers.CacheControl = "public, max-age=300";
        return Results.Ok(new AskMeta(
            settings.Enabled,
            settings.Suggestions,
            new AskMetaCounts(counts.Files, counts.DecisionRecords, counts.Readmes, counts.Chunks),
            index.File.Repos.Select(r => new AskMetaRepo(r.Key, r.Title, r.GitHub, r.Commit)).ToList()));
    }

    private static IResult Unavailable(string reason) =>
        Results.Json(AskResponse.Refusal(reason), statusCode: StatusCodes.Status503ServiceUnavailable);

    /// <summary>Reads at most <see cref="MaxBodyBytes"/>; anything larger, malformed or out of range is null.</summary>
    private static async Task<string?> ReadQuestion(HttpRequest request, CancellationToken cancellationToken)
    {
        if (request.ContentLength > MaxBodyBytes || !(request.HasJsonContentType()))
        {
            return null;
        }

        var buffer = new byte[MaxBodyBytes + 1];
        var length = 0;
        int read;
        while (length < buffer.Length && (read = await request.Body.ReadAsync(buffer.AsMemory(length), cancellationToken)) > 0)
        {
            length += read;
        }

        if (length > MaxBodyBytes)
        {
            return null;
        }

        try
        {
            var body = JsonSerializer.Deserialize<AskRequest>(buffer.AsSpan(0, length), JsonSerializerOptions.Web);
            var question = body?.Question?.Trim();
            return string.IsNullOrEmpty(question) || question.Length > MaxQuestionChars ? null : question;
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
