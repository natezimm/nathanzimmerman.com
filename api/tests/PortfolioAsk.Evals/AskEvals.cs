using System.Diagnostics;
using Anthropic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using PortfolioAsk.Api.Ask;
using PortfolioAsk.Indexer;
using Xunit.Abstractions;

namespace PortfolioAsk.Evals;

/// <summary>
/// The paid half of the evals: every question in <c>api/evals/evals.json</c> through the real pipeline (local
/// embedder, the built index, Claude Haiku 5.5, the validator), one at a time, skipping the HTTP rate limits.
/// Needs <c>api/index.json</c> and the model files, as the API does. Settings such as <c>Ask__MinScore</c> and
/// <c>Ask__Thinking</c> come from the environment, so a run can try a change without editing code.
/// </summary>
public sealed class AskEvals(ITestOutputHelper output)
{
    [LiveFact]
    [Trait("Category", "Eval")]
    public async Task The_eval_set_meets_its_targets()
    {
        var api = FindApiFolder();
        using var host = new EvalHost(api);
        var service = host.Services.GetRequiredService<AskService>();
        var recorder = host.Recorder;
        var settings = host.Services.GetRequiredService<IOptions<AskOptions>>().Value;
        var evals = EvalSet.Load(Path.Combine(api, "evals", "evals.json"));

        var outcomes = new List<EvalOutcome>();
        foreach (var evalCase in evals.Cases)
        {
            recorder.Reset();
            var started = Stopwatch.GetTimestamp();
            AskResponse response;
            try
            {
                response = await service.AskAsync(evalCase.Question, CancellationToken.None);
            }
            catch (ModelUnavailableException)
            {
                response = AskResponse.Refusal(RefusalReasons.Unavailable);
            }

            outcomes.Add(new EvalOutcome(
                evalCase,
                response,
                recorder.Last?.InputTokenCount ?? 0,
                recorder.Last?.OutputTokenCount ?? 0,
                Stopwatch.GetElapsedTime(started)));
        }

        var score = new EvalScore(outcomes);
        var report = score.ToMarkdown(
            $"{settings.Model}, thinking {(settings.Thinking ? "adaptive" : "off")}, min score {settings.MinScore:F2}, max tokens {settings.MaxOutputTokens}");
        output.WriteLine(report);
        var summary = Environment.GetEnvironmentVariable("GITHUB_STEP_SUMMARY");
        if (!string.IsNullOrEmpty(summary))
        {
            await File.AppendAllTextAsync(summary, report);
        }

        await File.WriteAllTextAsync(Path.Combine(AppContext.BaseDirectory, "eval-report.md"), report);

        var failures = score.Failures();
        Assert.True(failures.Count == 0, string.Join("; ", failures));
    }

    private static string FindApiFolder()
    {
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
        {
            if (File.Exists(Path.Combine(dir.FullName, "PortfolioAsk.slnx")))
            {
                return dir.FullName;
            }
        }

        throw new DirectoryNotFoundException("Run the eval from inside the repository so it can find api/.");
    }

    /// <summary>The real API with the built index and the real model, the model call wrapped to read its usage.</summary>
    private sealed class EvalHost(string api) : WebApplicationFactory<Program>
    {
        public UsageRecorder Recorder => Services.GetRequiredService<UsageRecorder>();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Eval");
            builder.ConfigureAppConfiguration(config => config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Ask:Enabled"] = "true",
                ["Ask:IndexPath"] = Path.Combine(api, "index.json"),
                ["Ask:ManifestPath"] = Path.Combine(api, "models", "manifest.json"),
                ["Ask:ModelsPath"] = Path.Combine(api, "models", "files"),
                // One run is about 30 questions; the budget must not be what stops it.
                ["Ask:DailyTokenBudget"] = "10000000",
            }).AddEnvironmentVariables());
            builder.ConfigureTestServices(services =>
            {
                services.AddSingleton(provider => new UsageRecorder(AnthropicModel.CreateChatClient(
                    provider.GetRequiredService<IAnthropicClient>(), provider.GetRequiredService<IOptions<AskOptions>>().Value)));
                services.AddKeyedSingleton<IChatClient>(AnthropicModel.ServiceKey, (provider, _) => provider.GetRequiredService<UsageRecorder>());
            });
        }
    }
}
