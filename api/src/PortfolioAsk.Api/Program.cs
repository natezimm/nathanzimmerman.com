using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Options;
using PortfolioAsk.Api.Ask;
using PortfolioAsk.Api.Auth;
using PortfolioAsk.Api.Health;
using PortfolioAsk.Api.Limits;
using PortfolioAsk.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOptions<AskOptions>().BindConfiguration(AskOptions.Section);

// The index and the embedding model load on first use, so a test host can replace them without the files.
builder.Services.AddSingleton(services =>
    ModelManifest.Load(ContentPath(services, services.GetRequiredService<IOptions<AskOptions>>().Value.ManifestPath)));
builder.Services.AddSingleton(services =>
    DocIndex.Load(ContentPath(services, services.GetRequiredService<IOptions<AskOptions>>().Value.IndexPath)));
builder.Services.AddSingleton(services => OnnxEmbeddingGenerator.Load(
    services.GetRequiredService<ModelManifest>(),
    ContentPath(services, services.GetRequiredService<IOptions<AskOptions>>().Value.ModelsPath)));
// Questions get bge's query prefix; the session belongs to the instance above.
builder.Services.AddSingleton<IEmbeddingGenerator<string, Embedding<float>>>(services =>
    services.GetRequiredService<OnnxEmbeddingGenerator>().ForQueries());

builder.Services.AddSingleton(services => AnthropicModel.CreateClient(
    services.GetRequiredService<IConfiguration>(), services.GetRequiredService<IOptions<AskOptions>>().Value));
builder.Services.AddKeyedSingleton<IChatClient>(AnthropicModel.ServiceKey, (services, _) => AnthropicModel.CreateChatClient(
    services.GetRequiredService<Anthropic.IAnthropicClient>(), services.GetRequiredService<IOptions<AskOptions>>().Value));

builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<TokenBudget>();
builder.Services.AddSingleton<AskService>();
builder.Services.AddAskRateLimits();

// nginx on the VM terminates HTTPS and forwards to the container. Take the visitor's address and scheme from
// its X-Forwarded headers only when the request comes from a trusted proxy: loopback, plus the networks in
// ForwardedHeaders:KnownNetworks (the Docker network nginx reaches the container through), as Know Ball does.
// Anyone else's header is ignored, so the per-address limits can't be dodged with a made-up address.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    foreach (var cidr in builder.Configuration.GetSection("ForwardedHeaders:KnownNetworks").Get<string[]>() ?? [])
    {
        options.KnownIPNetworks.Add(System.Net.IPNetwork.Parse(cidr));
    }
});

var app = builder.Build();

var ask = app.Services.GetRequiredService<IOptions<AskOptions>>().Value;
app.Logger.LogInformation("Ask my portfolio starting: {State}, model {Model}", ask.Enabled ? "enabled" : "paused", ask.Model);

app.UseForwardedHeaders();
app.UseSameOrigin();
app.UseRateLimiter();

app.MapAsk();
app.MapHealth();

app.Run();

static string ContentPath(IServiceProvider services, string path) =>
    Path.GetFullPath(path, services.GetRequiredService<IHostEnvironment>().ContentRootPath);

/// <summary>Lets the tests host the API with WebApplicationFactory.</summary>
public partial class Program;
