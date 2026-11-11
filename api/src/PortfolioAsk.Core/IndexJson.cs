using System.Text.Encodings.Web;
using System.Text.Json;

namespace PortfolioAsk.Core;

/// <summary>One set of JSON options for writing and reading index.json, so a rebuild is byte-identical.</summary>
public static class IndexJson
{
    public static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = false,
    };
}
