using Microsoft.Extensions.AI;
using PortfolioAsk.Api.Ask;
using PortfolioAsk.Core;

namespace PortfolioAsk.Tests.Api;

public sealed class AnswerValidatorTests
{
    private static readonly DocIndex Index = TestIndex.Create();
    private static readonly IReadOnlyList<SearchHit> Hits = Index.Chunks.Select(c => new SearchHit(c, 0.8f)).ToList();

    private static AskResponse Validate(string json, ChatFinishReason? finish = null) =>
        AnswerValidator.Validate(FakeChatClient.Reply(json, finish), Hits, Index.File.Repos).Response;

    [Fact]
    public void Cited_sources_are_renumbered_in_order_of_first_use()
    {
        var answer = Validate("""{"answer":"Trivia is daily [3]. Queries are filtered [1, 3].","sources":[3,1],"notInDocs":false}""");

        Assert.Equal("Trivia is daily [1]. Queries are filtered [2][1].", answer.Answer);
        Assert.Equal(["README.md", "docs/adr/0002-family-scoping.md"], answer.Citations.Select(c => c.Path));
        Assert.Equal([1, 2], answer.Citations.Select(c => c.N));
        // A README's top has no anchor, so its link has no fragment.
        Assert.Equal("https://github.com/natezimm/know-ball/blob/def456/README.md", answer.Citations[0].Url);
    }

    [Fact]
    public void A_long_answer_is_cut_at_a_word_without_leaving_half_a_marker()
    {
        var words = string.Join(' ', Enumerable.Repeat("filter", 170));
        var answer = Validate($$"""{"answer":"{{words}} [1] {{words}} [1]","sources":[1],"notInDocs":false}""");

        Assert.False(answer.Refused);
        Assert.True(answer.Answer.Length <= AnswerValidator.MaxAnswerChars + 1);
        Assert.EndsWith("…", answer.Answer, StringComparison.Ordinal);
        Assert.DoesNotMatch(@"\[\d*…", answer.Answer);
    }

    [Fact]
    public void Fenced_json_is_still_read()
    {
        var answer = Validate("```json\n{\"answer\":\"Filtered [1].\",\"sources\":[1],\"notInDocs\":false}\n```");

        Assert.Equal("Filtered [1].", answer.Answer);
    }

    [Theory]
    [InlineData("Families are isolated.")]
    [InlineData("""{"answer": 3}""")]
    [InlineData("""{"sources":[1]}""")]
    public void Text_that_is_not_the_expected_json_is_refused_as_incomplete(string text)
    {
        Assert.Equal(RefusalReasons.Incomplete, Validate(text).Reason);
    }
}
