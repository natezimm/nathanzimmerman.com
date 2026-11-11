using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.AI;
using PortfolioAsk.Core;

namespace PortfolioAsk.Api.Ask;

/// <summary>The JSON the model must return. Its schema is sent as the request's output format.</summary>
public sealed record ModelAnswer(string Answer, int[] Sources, bool NotInDocs);

/// <summary>What the validator made of a response, with counts for the log line.</summary>
public sealed record ValidatedAnswer(AskResponse Response, int UnknownMarkers);

/// <summary>
/// Checks the model's response before anyone sees it. The model writes prose and picks source numbers;
/// everything else (which files, their links, whether the answer stands at all) is decided here.
/// </summary>
public static partial class AnswerValidator
{
    public const int MaxAnswerChars = 1200;

    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    public static ValidatedAnswer Validate(ChatResponse response, IReadOnlyList<SearchHit> hits, IReadOnlyList<IndexedRepo> repos)
    {
        // A response cut off by max_tokens is a half answer, and a refusal stop reason has nothing to show.
        if (response.FinishReason == ChatFinishReason.Length)
        {
            return new(AskResponse.Refusal(RefusalReasons.Incomplete), 0);
        }

        if (response.FinishReason == ChatFinishReason.ContentFilter)
        {
            return new(AskResponse.Refusal(RefusalReasons.Declined), 0);
        }

        var parsed = Parse(response.Text);
        if (parsed is null)
        {
            return new(AskResponse.Refusal(RefusalReasons.Incomplete), 0);
        }

        if (parsed.NotInDocs || string.IsNullOrWhiteSpace(parsed.Answer))
        {
            return new(AskResponse.Refusal(RefusalReasons.NotInDocs), 0);
        }

        var answer = Shorten(parsed.Answer.Trim());

        // Renumber the cited sources 1, 2, 3 in order of first use and drop markers that name no source.
        var order = new List<int>();
        var unknown = 0;
        answer = Marker().Replace(answer, match =>
        {
            var replacement = "";
            foreach (var part in match.Groups[1].Value.Split(','))
            {
                if (!int.TryParse(part.Trim(), out var source) || source < 1 || source > hits.Count)
                {
                    unknown++;
                    continue;
                }

                if (!order.Contains(source))
                {
                    order.Add(source);
                }

                replacement += $"[{order.IndexOf(source) + 1}]";
            }

            return replacement;
        });

        // An answer that cites nothing real isn't grounded, whatever it says.
        if (order.Count == 0)
        {
            return new(AskResponse.Refusal(RefusalReasons.NotInDocs), unknown);
        }

        answer = Tidy(answer);
        var repoByKey = repos.ToDictionary(r => r.Key);
        var citations = order.Select((source, i) =>
        {
            var chunk = hits[source - 1].Chunk;
            var repo = repoByKey[chunk.Repo];
            return new Citation(i + 1, repo.Key, repo.Title, chunk.Path, chunk.Heading, GitHubLinks.For(repo, chunk));
        }).ToList();

        return new(new AskResponse(answer, citations, false, null), unknown);
    }

    private static ModelAnswer? Parse(string text)
    {
        var json = text.Trim();
        // Structured output should make fences impossible; strip them anyway rather than refuse.
        if (json.StartsWith("```", StringComparison.Ordinal))
        {
            json = Fence().Replace(json, "").Trim();
        }

        try
        {
            var answer = JsonSerializer.Deserialize<ModelAnswer>(json, Json);
            return answer is { Answer: not null } ? answer : null;
        }
        catch (JsonException)
        {
            return null;
        }
    }

    /// <summary>Cuts an over-long answer at a word boundary, dropping a citation marker the cut split.</summary>
    private static string Shorten(string answer)
    {
        if (answer.Length <= MaxAnswerChars)
        {
            return answer;
        }

        var cut = answer[..MaxAnswerChars];
        var space = cut.LastIndexOfAny([' ', '\n']);
        cut = space > MaxAnswerChars / 2 ? cut[..space] : cut;
        return OpenMarker().Replace(cut, "").TrimEnd() + "…";
    }

    /// <summary>Removes the gaps a dropped marker leaves ("uses X  ." becomes "uses X.").</summary>
    private static string Tidy(string answer)
    {
        answer = SpaceBeforePunctuation().Replace(answer, "$1");
        return DoubleSpace().Replace(answer, " ").Trim();
    }

    [GeneratedRegex(@"\[(\s*\d+(?:\s*,\s*\d+)*\s*)\]")]
    private static partial Regex Marker();

    [GeneratedRegex(@"\[[\d,\s]*$")]
    private static partial Regex OpenMarker();

    [GeneratedRegex(@"^```(?:json)?|```$", RegexOptions.Multiline)]
    private static partial Regex Fence();

    [GeneratedRegex(@"[ \t]+([.,;:!?])")]
    private static partial Regex SpaceBeforePunctuation();

    [GeneratedRegex(@"[ \t]{2,}")]
    private static partial Regex DoubleSpace();
}
