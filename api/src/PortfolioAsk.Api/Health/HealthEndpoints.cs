using Microsoft.Extensions.AI;
using PortfolioAsk.Api.Ask;
using PortfolioAsk.Core;

namespace PortfolioAsk.Api.Health;

/// <summary>
/// <c>GET /api/ask/health</c>, for the deploy's check: 200 when the index is loaded and was built with the same
/// embedding model the API loaded, so vectors from one model are never compared with questions embedded by
/// another. It never calls Anthropic, so it costs nothing and works while the kill switch is off.
/// </summary>
public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealth(this IEndpointRouteBuilder app)
    {
        app.MapGet($"{AskEndpoints.AskPath}/health", Check);
        return app;
    }

    private static IResult Check(IServiceProvider services, ILoggerFactory loggers)
    {
        try
        {
            var index = services.GetRequiredService<DocIndex>();
            var manifest = services.GetRequiredService<ModelManifest>();
            // Resolving the embedder loads the model and checks its files against the manifest's hashes.
            _ = services.GetRequiredService<IEmbeddingGenerator<string, Embedding<float>>>();

            var model = index.File.Model;
            var matches = model.Id == manifest.Id
                && model.Dimensions == manifest.Dimensions
                && string.Equals(model.Sha256, manifest.Onnx.Sha256, StringComparison.OrdinalIgnoreCase);
            if (!matches)
            {
                return Results.Json(new { status = "model mismatch" }, statusCode: StatusCodes.Status503ServiceUnavailable);
            }

            return Results.Ok(new { status = "ok", chunks = index.Chunks.Count, model = model.Id });
        }
        catch (Exception ex)
        {
            loggers.CreateLogger(nameof(HealthEndpoints)).LogError("Health check failed with {ErrorType}: {Message}", ex.GetType().Name, ex.Message);
            return Results.Json(new { status = "not ready" }, statusCode: StatusCodes.Status503ServiceUnavailable);
        }
    }
}
