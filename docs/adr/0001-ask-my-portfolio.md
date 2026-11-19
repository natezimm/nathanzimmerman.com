# 0001. Ask my portfolio answers only from the repositories' docs

**Status:** accepted

## Context

Visitors, mostly recruiters and engineers, want to know how my projects work without reading five repositories. A question box can answer them, but a language model on a public page brings four risks: it can make things up, it costs money per question, anyone on the internet can call it, and the text it reads can try to steer it. The site was static, with no server code, so the feature also needs somewhere to run.

The docs worth answering from already exist: each repository's README, `docs/architecture.md` and decision records, plus Wheelhouse's `docs/security.md` and this site's project data. They are public, short (about 180 KB) and change a few times a week.

## Decision

- **Retrieval over the docs, nothing else.** A .NET indexer in CI reads only the files `api/corpus.json` names, splits them by heading and embeds each chunk with a small local ONNX model (bge-small-en-v1.5, int8, pinned by SHA-256). The vectors live in `index.json`, baked into the image and searched in memory. Anthropic has no embeddings API, and a few hundred vectors need no database or second vendor.
- **One model call per question, with sources.** A minimal ASP.NET Core API on the VM embeds the question, takes the top 6 chunks and refuses without calling the model when the best one scores under 0.60. Otherwise it sends the chunks as numbered `<source>` blocks to Claude Haiku 5.5 through Microsoft.Extensions.AI's `IChatClient` (the Anthropic SDK's adapter), with thinking off at low effort and the reply constrained to a JSON schema: prose, the source numbers it used, and `notInDocs`. Microsoft.Extensions.AI over Semantic Kernel because one call with no planner or plugins needs only the abstraction, and tests can swap in a fake client.
- **The server, not the model, decides what stands.** `AnswerValidator` drops citation numbers that don't exist, refuses an answer that cites nothing real, turns a cut-off or declined reply into a refusal, and builds every GitHub link from the index. The browser renders the answer as text.
- **Spending is capped in layers.** A kill switch (`Ask:Enabled`, off by default), a daily token budget (1,000,000), `max_tokens` 600, per-address limits (5 a minute, 30 a day), a global limit and at most 2 calls at once, and prepaid credit with auto-reload off in a dedicated Anthropic workspace as the cap that survives a restart.
- **No streaming and no history in v1.** One JSON response in a second or two keeps the citation check simple.
- **Questions are not stored.** The API logs outcome, score, tokens and time, never the question; the IP address lives only in the rate limiter's memory.
- **Evals decide the settings.** A free retrieval check runs on every pull request; the paid eval (`ask-evals.yml`) runs on demand and must refuse every must-refuse question. The threshold and the thinking setting change only on its evidence.

## Consequences

- The answers are only as good as the docs. A question no doc covers ("Why minimal APIs?") is refused until someone writes that decision down, which is the intended pressure.
- The site gains its first server component: one container on the VM, 256 MB, with a threat model in [`docs/security.md`](../security.md) and a privacy page at `/privacy`.
- A doc change in a sibling repository reaches the box within a day: the nightly `ask.yml` run rebuilds the index when a repository has moved.
- Worst-case spend is the prepaid credit; a normal day costs cents.
- Anthropic is a new outside service. When it is down, the section says so and links to the repositories.
