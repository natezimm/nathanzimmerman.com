using System.Text.Json;
using PortfolioAsk.Core;
using PortfolioAsk.Indexer;

namespace PortfolioAsk.Tests;

public sealed class IndexTests : IDisposable
{
    private readonly string root = Directory.CreateTempSubdirectory("index-").FullName;
    private static readonly IndexedModel Model = new("fake", "abc", 8);

    private static readonly CorpusRepo Repo = new("know-ball", "Know Ball", "natezimm/know-ball", ["README.md", "docs/adr/0*.md"]);

    public IndexTests()
    {
        Write("README.md", "# Know Ball\n\nDaily trivia.\n\n## Games\n\nSeveral games.\n");
        Write("docs/adr/0004-idempotent-guesses.md", "# 0004. Idempotent guesses\n\n## Decision\n\nA requestId and a compare-and-swap.\n");
    }

    [Fact]
    public async Task Building_twice_gives_byte_identical_json()
    {
        var first = await BuildJson();
        var second = await BuildJson();

        Assert.Equal(first, second);
    }

    [Fact]
    public async Task Counts_and_files_describe_the_corpus()
    {
        var index = await Build(new FakeEmbeddingGenerator());

        Assert.Equal(new IndexCounts(Files: 2, DecisionRecords: 1, Readmes: 1, Chunks: 3), index.Counts);
        Assert.Equal(["know-ball/README.md", "know-ball/docs/adr/0004-idempotent-guesses.md"], index.Files);
        Assert.Equal(Enumerable.Range(0, 3), index.Chunks.Select(c => c.Id));
    }

    [Fact]
    public async Task Each_chunk_is_embedded_with_its_project_and_heading()
    {
        var embedder = new FakeEmbeddingGenerator();
        await Build(embedder);

        Assert.Contains("Know Ball: 0004. Idempotent guesses › Decision\n\nA requestId and a compare-and-swap.", embedder.Inputs);
    }

    [Fact]
    public async Task Search_returns_the_closest_chunk_first()
    {
        var embedder = new FakeEmbeddingGenerator();
        var index = new DocIndex(await Build(embedder));
        var target = index.Chunks[2];

        var hits = index.Search(target.Vector, 2);

        Assert.Equal(target.Id, hits[0].Chunk.Id);
        Assert.Equal(1f, hits[0].Score, 0.0001f);
        Assert.True(hits[0].Score >= hits[1].Score);
    }

    [Fact]
    public async Task Search_rejects_a_query_from_another_model()
    {
        var index = new DocIndex(await Build(new FakeEmbeddingGenerator()));

        Assert.Throws<ArgumentException>(() => index.Search(new float[3], 1));
    }

    [Fact]
    public async Task Index_round_trips_through_json()
    {
        var path = Path.Combine(root, "index.json");
        File.WriteAllText(path, await BuildJson());

        var index = DocIndex.Load(path);

        Assert.Equal(3, index.Chunks.Count);
        Assert.Equal("0123456789012345678901234567890123456789", index.File.Repos[0].Commit);
    }

    [Fact]
    public void Links_are_pinned_to_the_indexed_commit()
    {
        var repo = new IndexedRepo("know-ball", "Know Ball", "natezimm/know-ball", "0123456789012345678901234567890123456789");
        var chunk = new Chunk(0, "know-ball", "docs/adr/0004-idempotent-guesses.md", "0004 › Decision", "decision", "", []);

        Assert.Equal(
            "https://github.com/natezimm/know-ball/blob/0123456789012345678901234567890123456789/docs/adr/0004-idempotent-guesses.md#decision",
            GitHubLinks.For(repo, chunk));
    }

    private async Task<DocIndexFile> Build(FakeEmbeddingGenerator embedder) =>
        await IndexBuilder.BuildAsync([new RepoCheckout(Repo, root, "0123456789012345678901234567890123456789")], embedder, Model);

    private async Task<string> BuildJson() =>
        JsonSerializer.Serialize(await Build(new FakeEmbeddingGenerator()), IndexJson.Options);

    private void Write(string relative, string text)
    {
        var path = Path.Combine(root, relative);
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        File.WriteAllText(path, text);
    }

    public void Dispose() => Directory.Delete(root, recursive: true);
}
