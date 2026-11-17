using System.Text.Json;

namespace PortfolioAsk.Indexer;

/// <summary>One repository in api/corpus.json and the only files of it that may be indexed.</summary>
/// <param name="Key">Short name used in citations and on the command line, for example "wheelhouse".</param>
/// <param name="Title">Name the model reads, for example "Wheelhouse".</param>
/// <param name="GitHub">owner/name on GitHub.</param>
/// <param name="Include">Glob patterns relative to the repository root. Nothing outside them is read.</param>
/// <param name="CiteAs">Generated files and the source file a citation should link to instead.</param>
public sealed record CorpusRepo(
    string Key,
    string Title,
    string GitHub,
    IReadOnlyList<string> Include,
    IReadOnlyDictionary<string, string>? CiteAs = null);

public sealed record CorpusConfig(IReadOnlyList<CorpusRepo> Repos)
{
    public static CorpusConfig Load(string path) =>
        JsonSerializer.Deserialize<CorpusConfig>(File.ReadAllText(path), new JsonSerializerOptions(JsonSerializerDefaults.Web))
        ?? throw new InvalidDataException($"{path} is empty.");
}
