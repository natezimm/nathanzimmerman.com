namespace PortfolioAsk.Core;

/// <summary>One searchable piece of a document: a section, or part of a long one.</summary>
/// <param name="Id">Position in the index, from 0. The model cites chunks by this number.</param>
/// <param name="Repo">Repository key from corpus.json, for example "wheelhouse".</param>
/// <param name="Path">The file a citation links to, relative to the repository root.</param>
/// <param name="Heading">The heading path, for example "ADR 0002 › Decision".</param>
/// <param name="Anchor">GitHub's anchor for the section's own heading, or empty for the top of the file.</param>
/// <param name="Text">The section text the model reads.</param>
/// <param name="Vector">The normalised embedding of the heading path and text.</param>
public sealed record Chunk(
    int Id,
    string Repo,
    string Path,
    string Heading,
    string Anchor,
    string Text,
    float[] Vector);

/// <summary>A repository as the index saw it.</summary>
public sealed record IndexedRepo(string Key, string Title, string GitHub, string Commit);

/// <summary>The embedding model an index was built with.</summary>
public sealed record IndexedModel(string Id, string Sha256, int Dimensions);

/// <summary>Counts the site shows under an answer ("Answered from 3 of 23 decision records").</summary>
public sealed record IndexCounts(int Files, int DecisionRecords, int Readmes, int Chunks);

/// <summary>The whole index, as written to index.json.</summary>
public sealed record DocIndexFile(
    int Schema,
    IndexedModel Model,
    IReadOnlyList<IndexedRepo> Repos,
    IndexCounts Counts,
    IReadOnlyList<string> Files,
    IReadOnlyList<Chunk> Chunks)
{
    public const int CurrentSchema = 1;
}
