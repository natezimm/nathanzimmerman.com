using System.Diagnostics;
using System.Text.Json;
using PortfolioAsk.Core;
using PortfolioAsk.Indexer;

// Usage:
//   build  --corpus api/corpus.json --models <dir> --manifest api/models/manifest.json --out index.json --repo key=path ...
//   check  --index index.json --models <dir> --manifest api/models/manifest.json --evals api/evals/evals.json [--min 0.9]
var command = args.FirstOrDefault();
var options = ParseOptions(args.Skip(1).ToArray());

try
{
    return command switch
    {
        "build" => await Build(options),
        "check" => await Check(options),
        _ => Usage(),
    };
}
catch (Exception e) when (e is InvalidDataException or FileNotFoundException or ArgumentException)
{
    Console.Error.WriteLine($"error: {e.Message}");
    return 1;
}

static async Task<int> Build(Options options)
{
    var corpus = CorpusConfig.Load(options.Require("corpus"));
    var manifest = ModelManifest.Load(options.Require("manifest"));
    var repoPaths = options.Repos;

    var checkouts = new List<RepoCheckout>();
    foreach (var repo in corpus.Repos)
    {
        if (!repoPaths.TryGetValue(repo.Key, out var root))
        {
            throw new ArgumentException($"No --repo {repo.Key}=<path> given.");
        }

        checkouts.Add(new RepoCheckout(repo, root, GitCommit(root)));
    }

    using var embedder = OnnxEmbeddingGenerator.Load(manifest, options.Require("models"));
    var stopwatch = Stopwatch.StartNew();
    var index = await IndexBuilder.BuildAsync(checkouts, embedder, new IndexedModel(manifest.Id, manifest.Onnx.Sha256, manifest.Dimensions));

    var output = options.Require("out");
    await using (var stream = File.Create(output))
    {
        await JsonSerializer.SerializeAsync(stream, index, IndexJson.Options);
    }

    Console.WriteLine(
        $"Indexed {index.Counts.Files} files ({index.Counts.Readmes} READMEs, {index.Counts.DecisionRecords} decision records) " +
        $"into {index.Counts.Chunks} chunks in {stopwatch.Elapsed.TotalSeconds:F1} s: {output}");
    foreach (var repo in index.Repos)
    {
        Console.WriteLine($"  {repo.Key} @ {repo.Commit}");
    }

    return 0;
}

static async Task<int> Check(Options options)
{
    var manifest = ModelManifest.Load(options.Require("manifest"));
    var index = DocIndex.Load(options.Require("index"));
    if (index.File.Model.Sha256 != manifest.Onnx.Sha256)
    {
        throw new InvalidDataException("The index was built with a different model than the manifest pins.");
    }

    var evals = EvalSet.Load(options.Require("evals"));
    var minimum = double.Parse(options.Get("min") ?? "0.9", System.Globalization.CultureInfo.InvariantCulture);

    using var embedder = OnnxEmbeddingGenerator.Load(manifest, options.Require("models"));
    using var queries = embedder.ForQueries();
    var results = await RetrievalCheck.RunAsync(index, queries, evals);

    foreach (var result in results)
    {
        var best = result.Hits[0];
        Console.WriteLine($"{(result.Hit ? "hit " : "MISS")}  {result.Case.Id,-28} top: {best.Chunk.Repo}/{best.Chunk.Path} ({best.Score:F2})");
    }

    foreach (var (refusal, best) in await RetrievalCheck.RefusalScoresAsync(index, queries, evals))
    {
        Console.WriteLine($"refuse {refusal.Id,-28} best: {best.Chunk.Repo}/{best.Chunk.Path} ({best.Score:F2})");
    }

    var rate = results.Count == 0 ? 0 : results.Count(r => r.Hit) / (double)results.Count;
    Console.WriteLine($"Retrieval hit rate: {results.Count(r => r.Hit)}/{results.Count} = {rate:P0} (minimum {minimum:P0}) at top {RetrievalCheck.TopK}");
    return rate >= minimum ? 0 : 1;
}

static string GitCommit(string root)
{
    var info = new ProcessStartInfo("git", ["-C", root, "rev-parse", "HEAD"]) { RedirectStandardOutput = true, RedirectStandardError = true };
    using var process = Process.Start(info) ?? throw new InvalidOperationException("git did not start.");
    var commit = process.StandardOutput.ReadToEnd().Trim();
    process.WaitForExit();
    if (process.ExitCode != 0 || commit.Length != 40)
    {
        throw new ArgumentException($"{root} is not a git checkout.");
    }

    return commit;
}

static int Usage()
{
    Console.Error.WriteLine("usage: PortfolioAsk.Indexer build|check [options]; see Program.cs");
    return 2;
}

static Options ParseOptions(string[] args)
{
    var values = new Dictionary<string, string>(StringComparer.Ordinal);
    var repos = new Dictionary<string, string>(StringComparer.Ordinal);
    for (var i = 0; i < args.Length; i++)
    {
        if (!args[i].StartsWith("--", StringComparison.Ordinal) || i + 1 >= args.Length)
        {
            throw new ArgumentException($"Unexpected argument {args[i]}.");
        }

        var name = args[i][2..];
        var value = args[++i];
        if (name == "repo")
        {
            var parts = value.Split('=', 2);
            if (parts.Length != 2)
            {
                throw new ArgumentException($"--repo needs key=path, got {value}.");
            }

            repos[parts[0]] = parts[1];
        }
        else
        {
            values[name] = value;
        }
    }

    return new Options(values, repos);
}

internal sealed record Options(IReadOnlyDictionary<string, string> Values, IReadOnlyDictionary<string, string> Repos)
{
    public string? Get(string name) => Values.TryGetValue(name, out var value) ? value : null;

    public string Require(string name) => Get(name) ?? throw new ArgumentException($"--{name} is required.");
}
