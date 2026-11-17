using System.Text.Json;
using Microsoft.Extensions.AI;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using Microsoft.ML.Tokenizers;

namespace PortfolioAsk.Core;

/// <summary>
/// A BERT-style sentence embedding model (bge-small-en-v1.5) run locally with ONNX Runtime, behind
/// Microsoft.Extensions.AI's <see cref="IEmbeddingGenerator{TInput, TEmbedding}"/> so the API and the tests
/// can swap it like any other provider. Embeddings use the [CLS] token and are normalised to length 1.
/// </summary>
public sealed class OnnxEmbeddingGenerator : IEmbeddingGenerator<string, Embedding<float>>
{
    private const int MaxTokens = 512;

    private readonly InferenceSession session;
    private readonly BertTokenizer tokenizer;
    private readonly ModelManifest manifest;
    private readonly bool hasTokenTypes;
    private readonly string prefix;
    private readonly bool ownsSession;

    private OnnxEmbeddingGenerator(InferenceSession session, BertTokenizer tokenizer, ModelManifest manifest, string prefix, bool ownsSession)
    {
        this.session = session;
        this.tokenizer = tokenizer;
        this.manifest = manifest;
        this.prefix = prefix;
        this.ownsSession = ownsSession;
        hasTokenTypes = session.InputMetadata.ContainsKey("token_type_ids");
    }

    /// <summary>Loads the model from <paramref name="directory"/> after checking it against the manifest.</summary>
    public static OnnxEmbeddingGenerator Load(ModelManifest manifest, string directory)
    {
        manifest.Verify(directory);
        var options = new SessionOptions
        {
            // One small model on a shared VM: a single thread keeps memory and CPU predictable.
            IntraOpNumThreads = 1,
            InterOpNumThreads = 1,
            GraphOptimizationLevel = GraphOptimizationLevel.ORT_ENABLE_ALL,
        };
        var session = new InferenceSession(Path.Combine(directory, manifest.Onnx.Name), options);
        var tokenizer = LoadTokenizer(Path.Combine(directory, manifest.Tokenizer.Name));
        return new OnnxEmbeddingGenerator(session, tokenizer, manifest, prefix: "", ownsSession: true);
    }

    /// <summary>
    /// The same model for questions: bge models retrieve better when a query carries their instruction prefix,
    /// while passages are embedded as they are.
    /// </summary>
    public OnnxEmbeddingGenerator ForQueries() =>
        new(session, tokenizer, manifest, manifest.QueryPrefix, ownsSession: false);

    public EmbeddingGeneratorMetadata Metadata => new("onnx", defaultModelId: manifest.Id, defaultModelDimensions: manifest.Dimensions);

    public Task<GeneratedEmbeddings<Embedding<float>>> GenerateAsync(
        IEnumerable<string> values,
        EmbeddingGenerationOptions? options = null,
        CancellationToken cancellationToken = default)
    {
        var result = new GeneratedEmbeddings<Embedding<float>>();
        foreach (var value in values)
        {
            cancellationToken.ThrowIfCancellationRequested();
            result.Add(new Embedding<float>(Embed(prefix + value)) { ModelId = manifest.Id });
        }

        return Task.FromResult(result);
    }

    public object? GetService(Type serviceType, object? serviceKey = null) =>
        serviceKey is null && serviceType.IsInstanceOfType(this) ? this : null;

    public void Dispose()
    {
        if (ownsSession)
        {
            session.Dispose();
        }
    }

    private float[] Embed(string text)
    {
        var ids = tokenizer.EncodeToIds(text, MaxTokens, out _, out _);
        var length = ids.Count;
        var shape = new[] { 1, length };

        var inputIds = new DenseTensor<long>(shape);
        var mask = new DenseTensor<long>(shape);
        var types = new DenseTensor<long>(shape);
        for (var i = 0; i < length; i++)
        {
            inputIds[0, i] = ids[i];
            mask[0, i] = 1;
        }

        var inputs = new List<NamedOnnxValue>
        {
            NamedOnnxValue.CreateFromTensor("input_ids", inputIds),
            NamedOnnxValue.CreateFromTensor("attention_mask", mask),
        };
        if (hasTokenTypes)
        {
            inputs.Add(NamedOnnxValue.CreateFromTensor("token_type_ids", types));
        }

        using var outputs = session.Run(inputs);
        var hidden = outputs.First().AsTensor<float>();
        var dimensions = hidden.Dimensions[2];
        if (dimensions != manifest.Dimensions)
        {
            throw new InvalidDataException($"The model returned {dimensions} dimensions; the manifest says {manifest.Dimensions}.");
        }

        var vector = new float[dimensions];
        for (var d = 0; d < dimensions; d++)
        {
            vector[d] = hidden[0, 0, d];
        }

        return Normalise(vector);
    }

    private static float[] Normalise(float[] vector)
    {
        var norm = MathF.Sqrt(System.Numerics.Tensors.TensorPrimitives.SumOfSquares(vector));
        if (norm > 0)
        {
            System.Numerics.Tensors.TensorPrimitives.Divide(vector, norm, vector);
        }

        return vector;
    }

    /// <summary>
    /// The model ships a Hugging Face tokenizer.json; BertTokenizer wants a vocab.txt, which is the same
    /// WordPiece vocabulary written one token per line in id order.
    /// </summary>
    private static BertTokenizer LoadTokenizer(string tokenizerJsonPath)
    {
        using var json = JsonDocument.Parse(File.ReadAllText(tokenizerJsonPath));
        var model = json.RootElement.GetProperty("model");
        var vocab = model.GetProperty("vocab").EnumerateObject()
            .Select(p => (Token: p.Name, Id: p.Value.GetInt32()))
            .OrderBy(p => p.Id)
            .ToList();
        for (var i = 0; i < vocab.Count; i++)
        {
            if (vocab[i].Id != i)
            {
                throw new InvalidDataException($"tokenizer.json's vocabulary skips id {i}.");
            }
        }

        var lowerCase = json.RootElement.TryGetProperty("normalizer", out var normalizer)
            && normalizer.ValueKind == JsonValueKind.Object
            && normalizer.TryGetProperty("lowercase", out var lower)
            && lower.GetBoolean();

        using var stream = new MemoryStream();
        using (var writer = new StreamWriter(stream, leaveOpen: true))
        {
            foreach (var (token, _) in vocab)
            {
                writer.Write(token);
                writer.Write('\n');
            }
        }

        stream.Position = 0;
        return BertTokenizer.Create(stream, new BertOptions { LowerCaseBeforeTokenization = lowerCase });
    }
}
