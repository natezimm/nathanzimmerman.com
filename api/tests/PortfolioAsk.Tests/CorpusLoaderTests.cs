using PortfolioAsk.Indexer;

namespace PortfolioAsk.Tests;

public sealed class CorpusLoaderTests : IDisposable
{
    private readonly string root = Directory.CreateTempSubdirectory("corpus-").FullName;

    private static readonly CorpusRepo Repo = new(
        "wheelhouse",
        "Wheelhouse",
        "natezimm/wheelhouse",
        ["README.md", "docs/architecture.md", "docs/adr/0*.md", "generated/data.md"],
        new Dictionary<string, string> { ["generated/data.md"] = "src/data.ts" });

    [Fact]
    public void Reads_only_the_allowlisted_files()
    {
        Write("README.md");
        Write("docs/architecture.md");
        Write("docs/adr/0001-first.md");
        Write("docs/adr/README.md");
        Write("docs/interview-notes.md");
        Write("docs/archive/old-plan.md");
        Write("src/Program.cs");
        Write(".env");

        var files = CorpusLoader.Load(Repo, root);

        Assert.Equal(["README.md", "docs/adr/0001-first.md", "docs/architecture.md"], files.Select(f => f.RelativePath));
    }

    [Fact]
    public void Cites_generated_files_by_their_source()
    {
        Write("generated/data.md");

        var file = Assert.Single(CorpusLoader.Load(Repo, root));

        Assert.Equal("src/data.ts", file.CitePath);
    }

    [Fact]
    public void Refuses_a_link_that_could_lead_outside_the_repository()
    {
        var outside = Path.Combine(Directory.CreateTempSubdirectory("outside-").FullName, "secret.md");
        File.WriteAllText(outside, "secret");
        File.CreateSymbolicLink(Path.Combine(root, "README.md"), outside);

        Assert.Throws<InvalidDataException>(() => CorpusLoader.Load(Repo, root));
    }

    [Fact]
    public void The_real_corpus_never_admits_interview_notes_or_archives()
    {
        var config = CorpusConfig.Load(Path.Combine(AppContext.BaseDirectory, "corpus.json"));

        foreach (var repo in config.Repos)
        {
            Assert.DoesNotContain(repo.Include, p => p.Contains("interview", StringComparison.OrdinalIgnoreCase));
            Assert.DoesNotContain(repo.Include, p => p.Contains("archive", StringComparison.OrdinalIgnoreCase));
            Assert.DoesNotContain(repo.Include, p => p.Contains("**", StringComparison.Ordinal));
        }
    }

    private void Write(string relative)
    {
        var path = Path.Combine(root, relative);
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        File.WriteAllText(path, $"# {relative}\n\nText of {relative}.\n");
    }

    public void Dispose() => Directory.Delete(root, recursive: true);
}
