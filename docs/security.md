# Security and threat model

The site is static apart from one endpoint, `/api/ask`, behind Ask my portfolio ([ADR 0001](adr/0001-ask-my-portfolio.md)). This page lists what is worth protecting, who can reach what, the defenses, and the risks accepted. Update it, and the ADR, in the same pull request as any change to a secret, an outside service, a cap or what the index may read.

## Assets

| Asset                             | Where it lives                                                                              | Why it matters                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Anthropic API key                 | `~/portfolio-ask/.env` on the VM (mode 600), passed to one container as `ANTHROPIC_API_KEY` | Spends money; could be used elsewhere                                   |
| Eval key                          | `ANTHROPIC_EVAL_KEY`, a secret of the protected `evals` GitHub environment                  | Same, used only by `ask-evals.yml` on demand                            |
| Anthropic credit                  | A dedicated workspace with prepaid credit and auto-reload off                               | The hard ceiling on spend                                               |
| The index                         | `index.json` in the image, built in CI from the files `api/corpus.json` names               | What the answers are allowed to say                                     |
| EmailJS public key                | `VITE_EMAILJS_*` build variables                                                            | Public by design; it can only send through this site's EmailJS template |
| Visitors' questions and addresses | In memory only                                                                              | Privacy ([/privacy](https://nathanzimmerman.com/privacy/))              |

The key is never a `VITE_` variable (browser variables are public), never in the image, a log line or an error response. CI builds the index without it, because the embedding model runs locally.

## Who can reach what

- **Anyone** can load the static site and call `GET /api/ask/meta`, `GET /api/ask/health` and `POST /api/ask` through nginx.
- **The API container** listens on `127.0.0.1:8095` on its own Compose network, runs read-only as a non-root user with every capability dropped and a 256 MB cap. Its only outbound call is to Anthropic's API; egress is not firewalled.
- **The model** sees the system prompt, up to 6 public doc excerpts and the question. It has no tools, no history and no access to the environment.
- **Only Nathan** merges to the `main` branches of the five repositories whose docs are indexed, and holds the VM and the Anthropic Console.

## Threats and defenses

| Asset or way in                   | Risk                                                             | Defense                                                                                                                                                                                                                           |
| --------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anthropic API key                 | Someone spends the credit or uses the key elsewhere              | `.env` only, own workspace, prepaid credit, auto-reload off, revoke in the Console; `AnthropicRequestTests` asserts it never reaches a log                                                                                        |
| `POST /api/ask`                   | Spam drains the budget; slow requests tie up the container       | Per address 5 a minute and 30 a day, 30 a minute overall, 2 calls at once with 8 queued, a 1,000,000-token daily budget, a 2 KB body and 300-character question, a 20 s model timeout, nginx `client_max_body_size 4k`            |
| Anthropic                         | Outage, or data sent to a third party                            | The section shows a paused state; only the question and public doc text leave; Anthropic does not train on API data by default                                                                                                    |
| Retrieved text (prompt injection) | A doc line saying "ignore your instructions" steers the answer   | Sources sit in `<source>` blocks that `PromptBuilder` stops a document from closing; the system prompt says they are data, never instructions; no tools exist to misuse; the reply must match a JSON schema and cite real sources |
| The model's reply                 | It cites a file that doesn't exist or links somewhere else       | The model returns only source numbers; `AnswerValidator` drops unknown ones, refuses an uncited answer and builds every URL from the index; the browser keeps only `https://github.com/` links and renders text, never HTML       |
| The index build                   | A sibling's docs are changed to plant instructions               | Only allowlisted files are read (`CorpusLoaderTests`), each repository's commit is pinned in the index and shown by `/api/ask/meta`, and only Nathan merges to those branches                                                     |
| Cross-site requests               | Another page posts questions from its visitors' browsers         | `SameOrigin` rejects a POST whose `Origin` is not this site                                                                                                                                                                       |
| Forged client addresses           | A caller fakes `X-Forwarded-For` to dodge the per-address limits | Forwarded headers are trusted only from loopback and the Docker network nginx uses                                                                                                                                                |
| The kill switch                   | Spending must stop now                                           | `Ask__Enabled=false` in `.env` and `docker compose up -d`; `KillSwitchChatClient` refuses every call even if a caller forgets to check                                                                                            |

## What a hostile visitor can do

- Ask up to 30 questions a day from one address, and with many addresses use up the daily budget, which pauses the box until midnight Eastern.
- Get the model to say something odd that still cites a source. The citation rule and refusal path keep this small; the risk is accepted.
- Read the system prompt. It holds nothing secret.

## What a hostile visitor cannot do

- Read the key or any environment variable: the model never sees them.
- Reach other containers or the VM: the API listens on loopback with its own network.
- Change or store anything: there are no writes, no tools and no history.
- See anyone else's questions: none are stored.
- Make the model fetch a URL, or put script or a link into the page.
- Spend more than the prepaid credit.

## Accepted risks

- A restart forgets the day's token count; the prepaid credit is the cap that survives it.
- Two calls at once can overshoot the daily budget by one answer each.
- `public/_headers` is in Netlify's format, which nginx ignores. The launch checks the live headers with `curl -I` and moves any missing ones into the nginx config.
