namespace PortfolioAsk.Core;

/// <summary>
/// Builds citation links. The model only ever returns chunk ids; every URL comes from here, pinned to the
/// commit the index was built from, so a link can never point outside the indexed repositories or 404 after
/// a file moves.
/// </summary>
public static class GitHubLinks
{
    public static string For(IndexedRepo repo, Chunk chunk)
    {
        var path = string.Join('/', chunk.Path.Split('/').Select(Uri.EscapeDataString));
        var url = $"https://github.com/{repo.GitHub}/blob/{repo.Commit}/{path}";
        return chunk.Anchor.Length == 0 ? url : $"{url}#{chunk.Anchor}";
    }
}
