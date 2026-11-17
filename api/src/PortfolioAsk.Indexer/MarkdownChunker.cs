using System.Text;
using System.Text.RegularExpressions;

namespace PortfolioAsk.Indexer;

/// <summary>A section of a Markdown file, before it is embedded.</summary>
public sealed record TextChunk(string Heading, string Anchor, string Text);

/// <summary>
/// Splits Markdown at headings of levels 1 to 3, keeping each section's heading path ("ADR 0002 › Decision")
/// and GitHub's anchor for its heading. Long sections are split again between paragraphs. Mermaid diagrams
/// are dropped: they are code for a picture and only add noise to retrieval.
/// </summary>
public static partial class MarkdownChunker
{
    public const int MaxChars = 1500;

    public static IReadOnlyList<TextChunk> Split(string markdown)
    {
        var chunks = new List<TextChunk>();
        var path = new string?[3];
        var anchors = new AnchorSlugger();
        var currentAnchor = "";
        var body = new StringBuilder();
        var inFence = false;
        var skipFence = false;

        void Flush()
        {
            var text = body.ToString().Trim();
            body.Clear();
            if (text.Length == 0)
            {
                return;
            }

            var heading = string.Join(" › ", path.Where(p => p is not null));
            foreach (var part in SplitLong(text))
            {
                chunks.Add(new TextChunk(heading, currentAnchor, part));
            }
        }

        foreach (var line in markdown.Split('\n'))
        {
            var fence = FenceRegex().Match(line);
            if (fence.Success)
            {
                if (!inFence)
                {
                    inFence = true;
                    skipFence = fence.Groups["lang"].Value.Equals("mermaid", StringComparison.OrdinalIgnoreCase);
                    if (skipFence)
                    {
                        continue;
                    }
                }
                else
                {
                    inFence = false;
                    if (skipFence)
                    {
                        skipFence = false;
                        continue;
                    }
                }
            }
            else if (skipFence)
            {
                continue;
            }

            var heading = inFence ? Match.Empty : HeadingRegex().Match(line);
            if (heading.Success)
            {
                Flush();
                var level = heading.Groups["hashes"].Length;
                var title = CleanHeading(heading.Groups["title"].Value);
                if (level <= 3)
                {
                    path[level - 1] = title;
                    for (var i = level; i < path.Length; i++)
                    {
                        path[i] = null;
                    }

                    currentAnchor = level == 1 ? "" : anchors.Slug(title);
                }
                else
                {
                    // Level 4 and below stay in their parent section, but GitHub still numbers their anchors.
                    anchors.Slug(title);
                    body.Append(line).Append('\n');
                }

                continue;
            }

            body.Append(line).Append('\n');
        }

        Flush();
        return chunks;
    }

    private static IEnumerable<string> SplitLong(string text)
    {
        if (text.Length <= MaxChars)
        {
            yield return text;
            yield break;
        }

        var current = new StringBuilder();
        foreach (var paragraph in text.Split("\n\n"))
        {
            if (current.Length > 0 && current.Length + paragraph.Length + 2 > MaxChars)
            {
                yield return current.ToString().Trim();
                current.Clear();
            }

            current.Append(paragraph).Append("\n\n");
        }

        if (current.Length > 0)
        {
            yield return current.ToString().Trim();
        }
    }

    private static string CleanHeading(string title) =>
        LinkRegex().Replace(title, "$1").Replace("`", "").Replace("**", "").Trim();

    [GeneratedRegex(@"^(?<hashes>#{1,6})\s+(?<title>.+?)\s*#*\s*$")]
    private static partial Regex HeadingRegex();

    [GeneratedRegex(@"^\s*(```|~~~)\s*(?<lang>[\w-]*)")]
    private static partial Regex FenceRegex();

    [GeneratedRegex(@"\[([^\]]*)\]\([^)]*\)")]
    private static partial Regex LinkRegex();
}

/// <summary>GitHub's heading anchors: lower case, punctuation removed, spaces to hyphens, repeats numbered.</summary>
public sealed partial class AnchorSlugger
{
    private readonly Dictionary<string, int> seen = new(StringComparer.Ordinal);

    public string Slug(string heading)
    {
        var slug = PunctuationRegex().Replace(heading.Trim().ToLowerInvariant(), "").Replace(' ', '-');
        if (seen.TryGetValue(slug, out var count))
        {
            seen[slug] = count + 1;
            return $"{slug}-{count}";
        }

        seen[slug] = 1;
        return slug;
    }

    [GeneratedRegex(@"[^\p{L}\p{N}\p{M}\- _]")]
    private static partial Regex PunctuationRegex();
}
