using System.Security.Cryptography;
using System.Text.Json;

namespace PortfolioAsk.Core;

/// <summary>One file of the embedding model, pinned by its SHA-256.</summary>
public sealed record ModelFile(string Name, string Url, string Sha256);

/// <summary>
/// api/models/manifest.json: which embedding model the indexer and the API use, and where CI downloads it.
/// The files are not committed; both sides check their hashes before loading them.
/// </summary>
public sealed record ModelManifest(string Id, int Dimensions, string QueryPrefix, string Source, ModelFile Onnx, ModelFile Tokenizer)
{
    public static ModelManifest Load(string path)
    {
        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<ModelManifest>(json, new JsonSerializerOptions(JsonSerializerDefaults.Web))
            ?? throw new InvalidDataException($"{path} is empty.");
    }

    /// <summary>Throws unless both files are in <paramref name="directory"/> with the pinned hashes.</summary>
    public void Verify(string directory)
    {
        foreach (var file in new[] { Onnx, Tokenizer })
        {
            var path = Path.Combine(directory, file.Name);
            if (!File.Exists(path))
            {
                throw new FileNotFoundException($"Model file {file.Name} is missing from {directory}. Run api/scripts/fetch-model.sh.", path);
            }

            var actual = Sha256Of(path);
            if (!string.Equals(actual, file.Sha256, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidDataException($"{file.Name} has SHA-256 {actual}; the manifest pins {file.Sha256}.");
            }
        }
    }

    public static string Sha256Of(string path)
    {
        using var stream = File.OpenRead(path);
        return Convert.ToHexStringLower(SHA256.HashData(stream));
    }
}
