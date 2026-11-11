namespace PortfolioAsk.Api.Ask;

/// <summary>
/// The "Ask" configuration section. On the VM each value can be overridden from the container's
/// environment, for example <c>Ask__Enabled=false</c> to pause the feature.
/// </summary>
public sealed class AskOptions
{
    public const string Section = "Ask";

    /// <summary>The kill switch. Off by default, so a fresh deploy never spends money until it is turned on.</summary>
    public bool Enabled { get; set; }

    public string Model { get; set; } = "claude-haiku-5-5";

    /// <summary>About twice a normal answer. An answer cut off here becomes a refusal.</summary>
    public int MaxOutputTokens { get; set; } = 600;

    /// <summary>How many chunks the model reads.</summary>
    public int TopK { get; set; } = 6;

    /// <summary>
    /// The retrieval gate: a question whose best chunk scores below this is refused without calling the model.
    /// Answerable eval questions score 0.66 or more with bge-small, and the weather question 0.55, so this only
    /// catches the clearly off-topic; the model's notInDocs handles the rest. PR 5 tunes it on the eval run.
    /// </summary>
    public float MinScore { get; set; } = 0.60f;

    /// <summary>Input plus output tokens a day, across all visitors. About 350 questions, or $0.18.</summary>
    public long DailyTokenBudget { get; set; } = 1_000_000;

    /// <summary>The day the budget counts runs midnight to midnight here, like the sibling apps' calendar day.</summary>
    public string TimeZone { get; set; } = "America/New_York";

    /// <summary>The whole model call, retries included, must finish within this.</summary>
    public int TimeoutSeconds { get; set; } = 20;

    public int QuestionsPerMinute { get; set; } = 5;

    public int QuestionsPerDay { get; set; } = 30;

    public int GlobalQuestionsPerMinute { get; set; } = 30;

    public int MaxConcurrentQuestions { get; set; } = 2;

    /// <summary>Paths, relative to the content root.</summary>
    public string IndexPath { get; set; } = "index.json";

    public string ManifestPath { get; set; } = "models/manifest.json";

    public string ModelsPath { get; set; } = "models/files";

    /// <summary>The suggested questions the section shows. Each one is in the eval set.</summary>
    public List<string> Suggestions { get; set; } = [];
}
