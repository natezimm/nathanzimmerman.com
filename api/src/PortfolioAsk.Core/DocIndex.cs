using System.Numerics.Tensors;
using System.Text.Json;

namespace PortfolioAsk.Core;

/// <summary>A search hit: a chunk and its cosine similarity to the question.</summary>
public sealed record SearchHit(Chunk Chunk, float Score);

/// <summary>
/// The index held in memory. A few hundred 384-number vectors fit in under a megabyte, so search is a
/// brute-force cosine over all of them; vectors are normalised, so cosine is a dot product.
/// </summary>
public sealed class DocIndex
{
    public DocIndex(DocIndexFile file)
    {
        File = file;
        foreach (var chunk in file.Chunks)
        {
            if (chunk.Vector.Length != file.Model.Dimensions)
            {
                throw new InvalidDataException(
                    $"Chunk {chunk.Id} has {chunk.Vector.Length} dimensions; the model has {file.Model.Dimensions}.");
            }
        }
    }

    public DocIndexFile File { get; }

    public IReadOnlyList<Chunk> Chunks => File.Chunks;

    public static DocIndex Load(string path)
    {
        using var stream = System.IO.File.OpenRead(path);
        var file = JsonSerializer.Deserialize<DocIndexFile>(stream, IndexJson.Options)
            ?? throw new InvalidDataException($"{path} is empty.");
        if (file.Schema != DocIndexFile.CurrentSchema)
        {
            throw new InvalidDataException($"{path} has schema {file.Schema}; expected {DocIndexFile.CurrentSchema}.");
        }

        return new DocIndex(file);
    }

    /// <summary>The <paramref name="count"/> chunks closest to <paramref name="query"/>, best first.</summary>
    public IReadOnlyList<SearchHit> Search(ReadOnlySpan<float> query, int count)
    {
        if (query.Length != File.Model.Dimensions)
        {
            throw new ArgumentException($"The query has {query.Length} dimensions; the index has {File.Model.Dimensions}.");
        }

        var hits = new List<SearchHit>(Chunks.Count);
        foreach (var chunk in Chunks)
        {
            hits.Add(new SearchHit(chunk, TensorPrimitives.Dot(query, chunk.Vector)));
        }

        // Ties break on id so results never depend on sort stability.
        hits.Sort((a, b) => b.Score != a.Score ? b.Score.CompareTo(a.Score) : a.Chunk.Id.CompareTo(b.Chunk.Id));
        return hits.Take(count).ToList();
    }
}
