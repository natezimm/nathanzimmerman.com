using PortfolioAsk.Indexer;

namespace PortfolioAsk.Tests;

public class MarkdownChunkerTests
{
    [Fact]
    public void Splits_at_headings_and_keeps_the_heading_path()
    {
        var chunks = MarkdownChunker.Split("""
            # 0002. Family scoping

            Intro text.

            ## Context

            Families share one database.

            ### Detail

            Every table has a family id.

            ## Decision

            A global query filter.
            """);

        Assert.Equal(
            ["0002. Family scoping", "0002. Family scoping › Context", "0002. Family scoping › Context › Detail", "0002. Family scoping › Decision"],
            chunks.Select(c => c.Heading));
        Assert.Equal(["", "context", "detail", "decision"], chunks.Select(c => c.Anchor));
        Assert.Equal("A global query filter.", chunks[^1].Text);
    }

    [Fact]
    public void Drops_mermaid_diagrams_but_keeps_other_code()
    {
        var chunks = MarkdownChunker.Split("""
            ## Diagram

            ```mermaid
            flowchart LR
              A --> B
            ```

            ```csharp
            // # not a heading
            var x = 1;
            ```
            """);

        var chunk = Assert.Single(chunks);
        Assert.DoesNotContain("flowchart", chunk.Text);
        Assert.Contains("// # not a heading", chunk.Text);
    }

    [Fact]
    public void Splits_long_sections_between_paragraphs()
    {
        var paragraph = new string('a', 600);
        var chunks = MarkdownChunker.Split($"## Long\n\n{paragraph}\n\n{paragraph}\n\n{paragraph}\n");

        Assert.Equal(2, chunks.Count);
        Assert.All(chunks, c => Assert.True(c.Text.Length <= MarkdownChunker.MaxChars));
        Assert.All(chunks, c => Assert.Equal("long", c.Anchor));
    }

    [Fact]
    public void Deeper_headings_stay_in_their_section_but_count_for_anchors()
    {
        var chunks = MarkdownChunker.Split("""
            ## Setup

            #### Setup

            Text.

            ## Setup

            More.
            """);

        Assert.Equal(["setup", "setup-2"], chunks.Select(c => c.Anchor));
        Assert.Contains("#### Setup", chunks[0].Text);
    }

    [Theory]
    [InlineData("Why `IFamilyOwned`?", "why-ifamilyowned")]
    [InlineData("Sign-in: a parent's Google account", "sign-in-a-parents-google-account")]
    [InlineData("[ADR 0006](docs/adr/0006.md) and more", "adr-0006-and-more")]
    public void Anchors_match_GitHub(string heading, string anchor)
    {
        var chunk = Assert.Single(MarkdownChunker.Split($"## {heading}\n\nBody.\n"));
        Assert.Equal(anchor, chunk.Anchor);
    }
}
