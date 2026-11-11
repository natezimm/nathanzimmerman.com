using PortfolioAsk.Core;
using PortfolioAsk.Indexer;

namespace PortfolioAsk.Tests;

public sealed class ModelManifestTests : IDisposable
{
    private readonly string root = Directory.CreateTempSubdirectory("model-").FullName;

    [Fact]
    public void Verify_refuses_a_file_whose_hash_differs()
    {
        File.WriteAllText(Path.Combine(root, "model.onnx"), "not the model");
        File.WriteAllText(Path.Combine(root, "tokenizer.json"), "{}");
        var manifest = new ModelManifest(
            "fake", 8, "", "",
            new ModelFile("model.onnx", "", new string('0', 64)),
            new ModelFile("tokenizer.json", "", ModelManifest.Sha256Of(Path.Combine(root, "tokenizer.json"))));

        var error = Assert.Throws<InvalidDataException>(() => manifest.Verify(root));
        Assert.Contains("model.onnx", error.Message);
    }

    [Fact]
    public void Verify_names_a_missing_file()
    {
        var manifest = new ModelManifest("fake", 8, "", "", new ModelFile("model.onnx", "", ""), new ModelFile("tokenizer.json", "", ""));

        Assert.Throws<FileNotFoundException>(() => manifest.Verify(root));
    }

    [Fact]
    public void Every_eval_case_is_answerable_with_sources_or_a_refusal()
    {
        var evals = EvalSet.Load(Path.Combine(AppContext.BaseDirectory, "evals.json"));

        Assert.True(evals.Cases.Count >= 20);
        Assert.Equal(evals.Cases.Count, evals.Cases.Select(c => c.Id).Distinct().Count());
        Assert.All(evals.Cases, c => Assert.Equal(c.Refuse, c.Expect is null or { Count: 0 }));
    }

    public void Dispose() => Directory.Delete(root, recursive: true);
}
