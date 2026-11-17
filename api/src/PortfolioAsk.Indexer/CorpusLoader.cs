using Microsoft.Extensions.FileSystemGlobbing;

namespace PortfolioAsk.Indexer;

/// <summary>A file the allowlist admits, with the path a citation will link to.</summary>
public sealed record CorpusFile(CorpusRepo Repo, string RelativePath, string CitePath, string Text);

/// <summary>
/// Reads only what corpus.json allows. This is the one place that decides what the model can ever see, so
/// it is an allowlist, not a denylist: interview notes, archives, runbooks and code stay out because nothing
/// names them, and a path that escapes the repository is refused.
/// </summary>
public static class CorpusLoader
{
    public static IReadOnlyList<CorpusFile> Load(CorpusRepo repo, string root)
    {
        var fullRoot = Path.GetFullPath(root);
        var matcher = new Matcher(StringComparison.Ordinal);
        matcher.AddIncludePatterns(repo.Include);

        var files = new List<CorpusFile>();
        foreach (var relative in matcher.GetResultsInFullPath(fullRoot)
                     .Select(full => Path.GetRelativePath(fullRoot, full).Replace('\\', '/'))
                     .Order(StringComparer.Ordinal))
        {
            var full = Path.GetFullPath(Path.Combine(fullRoot, relative));
            if (!full.StartsWith(fullRoot + Path.DirectorySeparatorChar, StringComparison.Ordinal)
                || new FileInfo(full).LinkTarget is not null)
            {
                throw new InvalidDataException($"{repo.Key}: {relative} is outside the repository or a link.");
            }

            var cite = repo.CiteAs is not null && repo.CiteAs.TryGetValue(relative, out var source) ? source : relative;
            files.Add(new CorpusFile(repo, relative, cite, File.ReadAllText(full).Replace("\r\n", "\n")));
        }

        return files;
    }
}
