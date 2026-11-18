using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using PortfolioAsk.Api.Ask;
using PortfolioAsk.Core;

namespace PortfolioAsk.Tests.Api;

/// <summary>
/// The real API, hosted in memory with the test index, the keyword embedder and a fake model. Each test makes
/// its own host, so rate-limit windows and the token budget start empty.
/// </summary>
public sealed class AskHost : WebApplicationFactory<Program>
{
    public FakeChatClient Chat { get; } = new();

    public LogSink Logs { get; } = new();

    public ManualTime Time { get; } = new(new DateTimeOffset(2026, 11, 11, 17, 0, 0, TimeSpan.Zero));

    public Dictionary<string, string?> Settings { get; } = new() { ["Ask:Enabled"] = "true" };

    /// <summary>Extra service changes, applied last.</summary>
    public Action<IServiceCollection>? ConfigureServices { get; set; }

    /// <summary>Set false to keep the real Anthropic client (with a test HttpClient from <see cref="ConfigureServices"/>).</summary>
    public bool FakeModel { get; set; } = true;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration(config => config.AddInMemoryCollection(Settings));
        builder.ConfigureLogging(logging => logging.AddProvider(Logs));
        builder.ConfigureTestServices(services =>
        {
            services.AddSingleton(TestIndex.Create());
            services.AddSingleton(TestIndex.Manifest);
            services.AddSingleton<IEmbeddingGenerator<string, Embedding<float>>>(new KeywordEmbedder());
            services.AddSingleton<TimeProvider>(Time);
            if (FakeModel)
            {
                services.AddKeyedSingleton<IChatClient>(AnthropicModel.ServiceKey, Chat);
            }

            ConfigureServices?.Invoke(services);
        });
    }

    public Task<HttpResponseMessage> Ask(string question, string? origin = null)
    {
        var client = CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/ask") { Content = JsonContent.Create(new { question }) };
        if (origin is not null)
        {
            request.Headers.Add("Origin", origin);
        }

        return client.SendAsync(request);
    }

    public async Task<AskResponse> AskOk(string question)
    {
        var response = await Ask(question);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<AskResponse>())!;
    }
}
