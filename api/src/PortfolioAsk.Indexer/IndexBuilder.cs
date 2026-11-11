using Microsoft.Extensions.AI;
using PortfolioAsk.Core;

namespace PortfolioAsk.Indexer;

/// <summary>A repository checkout to index: its corpus entry, where it is on disk, and its commit.</summary>
public sealed record RepoCheckout(CorpusRepo Repo, string Root, string Commit);

/// <summary>Turns the allowed files into chunks and embeds each one once.</summary>
public static class IndexBuilder
{
    public static async Task<DocIndexFile> BuildAsync(
        IReadOnlyList<RepoCheckout> checkouts,
        IEmbeddingGenerator<string, Embedding<float>> embedder,
        IndexedModel model,
        CancellationToken cancellationToken = default)
    {
        var files = checkouts.SelectMany(c => CorpusLoader.Load(c.Repo, c.Root)).ToList();
        var pending = new List<(CorpusFile File, TextChunk Chunk)>();
        foreach (var file in files)
        {
            foreach (var chunk in MarkdownChunker.Split(file.Text))
            {
                pending.Add((file, chunk));
            }
        }

        var inputs = pending.Select(p => EmbeddingText(p.File.Repo.Title, p.Chunk)).ToList();
        var embeddings = await embedder.GenerateAsync(inputs, cancellationToken: cancellationToken);

        var chunks = pending
            .Select((p, i) => new Chunk(
                i,
                p.File.Repo.Key,
                p.File.CitePath,
                p.Chunk.Heading,
                // A heading anchor only exists in the file it came from. A generated file cited as its
                // source (portfolio.md as portfolioData.ts) links to the top of that source instead.
                p.File.CitePath == p.File.RelativePath ? p.Chunk.Anchor : "",
                p.Chunk.Text,
                embeddings[i].Vector.ToArray()))
            .ToList();

        var counts = new IndexCounts(
            Files: files.Count,
            DecisionRecords: files.Count(f => f.RelativePath.StartsWith("docs/adr/", StringComparison.Ordinal)),
            Readmes: files.Count(f => f.RelativePath == "README.md"),
            Chunks: chunks.Count);

        return new DocIndexFile(
            DocIndexFile.CurrentSchema,
            model,
            checkouts.Select(c => new IndexedRepo(c.Repo.Key, c.Repo.Title, c.Repo.GitHub, c.Commit)).ToList(),
            counts,
            files.Select(f => $"{f.Repo.Key}/{f.RelativePath}").ToList(),
            chunks);
    }

    /// <summary>What gets embedded: the project and heading path give a short section its context.</summary>
    public static string EmbeddingText(string repoTitle, TextChunk chunk) =>
        $"{repoTitle}: {chunk.Heading}\n\n{chunk.Text}";
}
