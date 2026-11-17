using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.AI;

namespace PortfolioAsk.Tests;

/// <summary>
/// A deterministic stand-in for the ONNX model: each text maps to a normalised vector derived from its
/// SHA-256, so tests run without the model file and two runs always agree.
/// </summary>
public sealed class FakeEmbeddingGenerator(int dimensions = 8) : IEmbeddingGenerator<string, Embedding<float>>
{
    public List<string> Inputs { get; } = [];

    public Task<GeneratedEmbeddings<Embedding<float>>> GenerateAsync(
        IEnumerable<string> values,
        EmbeddingGenerationOptions? options = null,
        CancellationToken cancellationToken = default)
    {
        var result = new GeneratedEmbeddings<Embedding<float>>();
        foreach (var value in values)
        {
            Inputs.Add(value);
            result.Add(new Embedding<float>(Vector(value)));
        }

        return Task.FromResult(result);
    }

    public float[] Vector(string text)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(text));
        var vector = new float[dimensions];
        for (var i = 0; i < dimensions; i++)
        {
            vector[i] = hash[i] - 127.5f;
        }

        var norm = MathF.Sqrt(vector.Sum(v => v * v));
        return vector.Select(v => v / norm).ToArray();
    }

    public object? GetService(Type serviceType, object? serviceKey = null) => null;

    public void Dispose()
    {
    }
}
