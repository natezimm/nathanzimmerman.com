using System.Text.Json;
using Microsoft.Extensions.AI;
using PortfolioAsk.Core;

namespace PortfolioAsk.Indexer;

/// <summary>A file an answer should cite.</summary>
public sealed record ExpectedSource(string Repo, string Path);

/// <summary>
/// One case of api/evals/evals.json. <c>Expect</c> lists files a good answer cites; <c>Allow</c> lists other files that
/// are fine to cite, for the paid eval's precision score.
/// </summary>
public sealed record EvalCase(
    string Id,
    string Question,
    bool Refuse,
    IReadOnlyList<ExpectedSource>? Expect = null,
    IReadOnlyList<string>? MustContain = null,
    IReadOnlyList<ExpectedSource>? Allow = null);

public sealed record EvalSet(IReadOnlyList<EvalCase> Cases)
{
    public static EvalSet Load(string path) =>
        JsonSerializer.Deserialize<EvalSet>(File.ReadAllText(path), new JsonSerializerOptions(JsonSerializerDefaults.Web))
        ?? throw new InvalidDataException($"{path} is empty.");
}

public sealed record RetrievalResult(EvalCase Case, bool Hit, IReadOnlyList<SearchHit> Hits);

/// <summary>
/// The free half of the evals: for every question the docs answer, is at least one expected file among the
/// top results? It needs no API key, so it runs on every pull request.
/// </summary>
public static class RetrievalCheck
{
    public const int TopK = 6;

    public static async Task<IReadOnlyList<RetrievalResult>> RunAsync(
        DocIndex index,
        IEmbeddingGenerator<string, Embedding<float>> queryEmbedder,
        EvalSet evals,
        CancellationToken cancellationToken = default)
    {
        var results = new List<RetrievalResult>();
        foreach (var evalCase in evals.Cases.Where(c => !c.Refuse && c.Expect is { Count: > 0 }))
        {
            var vector = await queryEmbedder.GenerateVectorAsync(evalCase.Question, cancellationToken: cancellationToken);
            var hits = index.Search(vector.Span, TopK);
            var hit = hits.Any(h => evalCase.Expect!.Any(e => e.Repo == h.Chunk.Repo && e.Path == h.Chunk.Path));
            results.Add(new RetrievalResult(evalCase, hit, hits));
        }

        return results;
    }

    /// <summary>
    /// The best score each must-refuse question reaches. Not pass or fail: the API's refusal threshold is
    /// tuned between these and the answerable questions' scores.
    /// </summary>
    public static async Task<IReadOnlyList<(EvalCase Case, SearchHit Best)>> RefusalScoresAsync(
        DocIndex index,
        IEmbeddingGenerator<string, Embedding<float>> queryEmbedder,
        EvalSet evals,
        CancellationToken cancellationToken = default)
    {
        var results = new List<(EvalCase, SearchHit)>();
        foreach (var evalCase in evals.Cases.Where(c => c.Refuse))
        {
            var vector = await queryEmbedder.GenerateVectorAsync(evalCase.Question, cancellationToken: cancellationToken);
            results.Add((evalCase, index.Search(vector.Span, 1)[0]));
        }

        return results;
    }
}
