using System.Net;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PortfolioAsk.Api.Ask;

namespace PortfolioAsk.Tests.Api;

/// <summary>
/// The real Anthropic SDK adapter, with HTTP answered locally: checks what actually goes over the wire and how
/// the response maps back, without a key or a network call.
/// </summary>
public sealed class AnthropicRequestTests
{
    private const string Key = "sk-ant-test-0123456789";

    [Fact]
    public async Task The_request_disables_thinking_at_low_effort_with_a_json_schema_and_the_key_stays_out_of_the_log()
    {
        var handler = new Messages("end_turn");
        using var host = Host(handler);

        var answer = await host.AskOk("How does a family's data stay private?");

        Assert.Equal("Every query is filtered by family [1].", answer.Answer);
        // This SDK version sends the key as a bearer token.
        Assert.Equal($"Bearer {Key}", handler.Authorization);

        using var body = JsonDocument.Parse(handler.Body);
        var root = body.RootElement;
        Assert.Equal("claude-haiku-5-5", root.GetProperty("model").GetString());
        Assert.Equal(600, root.GetProperty("max_tokens").GetInt32());
        Assert.Equal("disabled", root.GetProperty("thinking").GetProperty("type").GetString());
        var output = root.GetProperty("output_config");
        Assert.Equal("low", output.GetProperty("effort").GetString());
        Assert.Equal("json_schema", output.GetProperty("format").GetProperty("type").GetString());
        Assert.Equal(
            ["answer", "sources", "notInDocs"],
            output.GetProperty("format").GetProperty("schema").GetProperty("required").EnumerateArray().Select(e => e.GetString()));
        Assert.Equal(PromptBuilder.SystemPrompt, root.GetProperty("system")[0].GetProperty("text").GetString());
        Assert.False(root.TryGetProperty("tools", out _));
        Assert.Single(root.GetProperty("messages").EnumerateArray());

        Assert.Contains("2400 in / 120 out tokens", host.Logs.All, StringComparison.Ordinal);
        Assert.DoesNotContain(Key, host.Logs.All, StringComparison.Ordinal);
    }

    [Theory]
    [InlineData("max_tokens", RefusalReasons.Incomplete)]
    [InlineData("refusal", RefusalReasons.Declined)]
    public async Task The_adapter_maps_stop_reasons_to_refusals(string stopReason, string reason)
    {
        using var host = Host(new Messages(stopReason));

        var answer = await host.AskOk("How does a family's data stay private?");

        Assert.Equal(reason, answer.Reason);
    }

    private static AskHost Host(Messages handler)
    {
        var host = new AskHost { FakeModel = false };
        host.Settings["ANTHROPIC_API_KEY"] = Key;
        // The app's own factory, reading the key from configuration, with HTTP answered here.
        host.ConfigureServices = services => services.AddSingleton(provider => AnthropicModel.CreateClient(
            provider.GetRequiredService<IConfiguration>(), new AskOptions(), new HttpClient(handler)));
        return host;
    }

    /// <summary>Answers POST /v1/messages with a canned message and keeps what was sent.</summary>
    private sealed class Messages(string stopReason) : HttpMessageHandler
    {
        public string Body { get; private set; } = "";

        public string? Authorization { get; private set; }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Body = await request.Content!.ReadAsStringAsync(cancellationToken);
            Authorization = request.Headers.Authorization?.ToString();
            var text = JsonSerializer.Serialize("""{"answer":"Every query is filtered by family [1].","sources":[1],"notInDocs":false}""");
            var json = $$$"""
                {"id":"msg_test","type":"message","role":"assistant","model":"claude-haiku-5-5",
                 "content":[{"type":"text","text":{{{text}}}}],
                 "stop_reason":"{{{stopReason}}}","stop_sequence":null,
                 "usage":{"input_tokens":2400,"output_tokens":120}}
                """;
            return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(json, Encoding.UTF8, "application/json") };
        }
    }
}
