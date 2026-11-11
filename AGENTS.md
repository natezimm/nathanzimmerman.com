# Portfolio agent guide

## Scope and workspace

This repository is Nathan Zimmerman's public portfolio: a React/TypeScript SPA built with Vite, Tailwind, and Radix UI. It features four separately deployed sibling repositories: `../wheelhouse` (calendar.nathanzimmerman.com), `../know-ball` (knowball.), `../rabbit-ears` (rabbitears.) and `../brick-breaker-resume` (resume.). They are independent Git repositories, not npm workspaces. Read a sibling's `AGENTS.md` before changing it. Nerdle, Sudoku and Blackjack are retired: they appear only under Earlier projects with GitHub links, so do not add live links or subdomains for them.

Preserve unrelated working-tree changes. `docs/architecture.md` has broader design context, but some descriptions are stale; use current imports, scripts, and configuration to verify behavior. Update this guide when changing its documented entry points or commands.

## Where to work

- `src/App.tsx` routes `/`, `/projects/:slug` (the project page, `src/pages/ProjectDetail.tsx`, loaded lazily), `/privacy` (`src/pages/Privacy.tsx`, also lazy) and the catch-all 404. `src/pages/Index.tsx` composes the homepage and scrolls to a `#section` hash on arrival.
- `src/data/portfolioData.ts` is the one source for project content: `projectEntries` feeds both the cards in `src/components/Projects.tsx` and the project pages, and `earlierProjects` is the retired list. Each entry imports its screenshot set, an MP4 in `src/assets/video/` and a diagram SVG in `src/assets/diagrams/`; the README's "Adding a featured project" lists the steps. Experience content lives in the same file.
- `src/components/Hero.tsx` owns the hero backdrop and pointer spotlight; `HeroGame.tsx` renders the playable portrait card, and the game rules live in `src/lib/brickBreaker.ts`. The Experience git graph reads `experienceItems` and `careerOriginItems` from the data file.
- `src/components/Navigation.tsx` owns active section navigation on the homepage.
- `src/components/`: visible portfolio sections; `ui/` and `shared/` contain reusable elements.
- `src/contexts/ThemeContext.tsx`: saves `light`/`dark` under the `theme` localStorage key and defaults to dark when no valid value is saved.
- `src/lib/`: shared helpers, analytics, and skill metrics. The `@/` import alias resolves to `src/`.
- `src/index.css`, `tailwind.config.ts`, and `src/assets/`: styling and bundled imagery; `public/` contains directly served assets and `_headers`.

## Commands

Run from this repository root. Node 26 LTS is specified by `.nvmrc`, `package.json`, and the Dockerfile; CI reads `.nvmrc`. Keep them aligned.

`npm run typecheck` uses TypeScript 7's `tsc`, installed through the `@typescript/native` alias. The `typescript` alias supplies Microsoft's TypeScript 6 compatibility API for ESLint. Preserve both aliases when updating dependencies.

- Install: `npm ci`.
- Develop: `npm run dev` (configured port **8081**).
- Build: `npm run build` produces `dist/`, then `scripts/prerender-routes.mjs` writes `dist/projects/<slug>/index.html` and `dist/privacy/index.html` (per-page title, canonical and preview tags) and `dist/sitemap.xml`; preview with `npm run preview`. Project URLs end in `/`, which is the canonical form.
- Unit/component tests: `npm test`; target a file with `npm test -- src/components/Contact.test.tsx`.
- Static checks: `npm run lint` and `npm run typecheck`.
- Coverage: `npm run test:coverage` (Vitest/Testing Library).
- Browser tests: `npm run test:e2e`; install Chromium first with `npx playwright install chromium` if needed.
- Full CI gate: `npm run quality` runs formatting, lint, typecheck, coverage, and Playwright. Playwright normally builds and serves the production app; see the server-reuse caveat below.
- Project screenshots: `npm run images:project -- <screenshot.png> <slug>` writes the PNG source plus 1200 px and 600 px AVIF/WebP to `src/assets/`; see the README's Project screenshots section.
- Link-preview cards: `npm run images:social` redraws `public/og-image.jpg` and `public/og/<slug>.jpg` (set `CHROMIUM_PATH` to an installed Chromium if Playwright has not downloaded one). Rerun after changing a project's title, tagline or screenshot.
- Project page diagrams: `npm run diagrams` renders `docs/diagrams/*.mmd` to `src/assets/diagrams/*.svg` with Mermaid CLI (downloaded by `npx`); set `PUPPETEER_EXECUTABLE_PATH` to an installed Chromium if it cannot download one. Copy a project's README diagram into `docs/diagrams/` when it changes.
- Formatting: `npx prettier --check <files>` or `npx prettier --write <files>`. A scoped formatting check is sufficient for documentation-only edits.

## Behavior to preserve

- Check desktop/mobile layouts, keyboard controls, accessible labels, and reduced-motion behavior when changing UI or animations. Reuse Tailwind tokens and existing UI primitives.
- The hero game must stay pausable, start paused under reduced motion, and stop when scrolled out of view.
- Project recordings play on card hover only for a fine pointer without reduced motion, and the project page autoplays its recording only without reduced motion. Keep videos muted, `playsInline`, and `preload="none"` on cards.
- Contact submission uses EmailJS in `src/components/Contact.tsx`. Configuration names are `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY`. Browser environment variables are public; do not place secrets in them. Preserve validation and submission cooldowns, and mock external delivery in tests.
- Keep project links, resume claims, and metrics consistent across their consumers; preserve the public `/resume.pdf` link.
- Tests are colocated as `*.test.ts(x)`; `src/setupTests.ts` supplies browser mocks. `e2e/portfolio.spec.ts` covers Chromium desktop/mobile, including a card to project page round trip. Coverage thresholds live in `vite.config.ts`.

## Ask my portfolio (`api/`)

`api/` is a .NET 11 solution (`api/PortfolioAsk.slnx`, SDK pinned by `api/global.json`) for the "Ask my portfolio" box ([ADR 0001](docs/adr/0001-ask-my-portfolio.md), threat model in `docs/security.md`): `PortfolioAsk.Core` (index model, in-memory cosine search, `GitHubLinks`, and `OnnxEmbeddingGenerator`, a local bge-small model behind Microsoft.Extensions.AI's `IEmbeddingGenerator`), `PortfolioAsk.Indexer` (corpus allowlist, Markdown chunker, `build` and `check` commands) and `PortfolioAsk.Api` (minimal API: `POST /api/ask`, `GET /api/ask/meta`, `GET /api/ask/health`).

- The API answers with Claude Haiku 5.5 through the Anthropic SDK's `IChatClient` adapter (`Ask/AnthropicModel.cs`: thinking off, effort low, JSON schema output). Every call goes through `KillSwitchChatClient` (`Ask:Enabled`, off by default) and `TokenBudgetChatClient` (`Ask:DailyTokenBudget`). Per-address and global rate limits, the Origin check and a 2 KB body cap sit in front. The model returns prose and source numbers only; `AnswerValidator` builds every citation link and turns an uncited, cut-off or declined answer into a refusal. Retrieved text is data, never instructions: keep it inside `<source>` blocks (`PromptBuilder`).
- The key is `ANTHROPIC_API_KEY` in the container's environment, never a `VITE_` variable and never logged; the API logs outcome, score, tokens and time, never the question. Tests use `FakeChatClient`, or the real adapter with HTTP answered locally, so CI needs no key.
- Run it locally after building `api/index.json`: `Ask__Enabled=true dotnet run --project api/src/PortfolioAsk.Api` (port 5090; `appsettings.Development.json` points at the index and model). Without a key, answerable questions return 503 `unavailable`.
- The homepage section is `src/components/Ask.tsx` (with `AskAnswer.tsx` and `src/lib/askClient.ts`). It renders, and the nav shows its link, only when `GET /api/ask/meta` answers `enabled: true`; while the API is off or missing the site looks as it did. It is its own lazy chunk, so the first load does not grow. `npm run dev` proxies `/api` to port 5090. Answer text is rendered as React text (bullets, inline code and `[n]` markers only), never as HTML, and citation links must start with `https://github.com/`. `e2e/ask.spec.ts` stubs `/api/ask*`, so Playwright never reaches the model.

- `api/corpus.json` is an allowlist: only the files it names, in the five repositories, can ever be indexed. Never widen it to globs like `**`, archives or notes; `CorpusLoaderTests` guards this.
- `api/models/manifest.json` pins the embedding model by SHA-256; `api/scripts/fetch-model.sh` downloads it to `api/models/files/` (not committed). `api/scripts/fetch-corpus.sh` clones the sibling repositories into `api/corpus-repos/`, writes `api/generated/portfolio.md` from `portfolioData.ts` (`scripts/export-site-data.mjs`) and prints the indexer's `--repo` arguments.
- Tests: `dotnet test api/PortfolioAsk.slnx` (no model needed). Build and check an index: `dotnet run --project api/src/PortfolioAsk.Indexer -- build --corpus api/corpus.json --manifest api/models/manifest.json --models api/models/files --out api/index.json $(api/scripts/fetch-corpus.sh)`, then `check --index api/index.json --manifest api/models/manifest.json --models api/models/files --evals api/evals/evals.json`.
- The paid eval: `api/tests/PortfolioAsk.Evals` runs every `api/evals/evals.json` case through the real pipeline and model with `dotnet test api/tests/PortfolioAsk.Evals --filter Category=Eval`. It skips without `ANTHROPIC_API_KEY`, needs a built `api/index.json` and the model files, and reads `Ask__*` settings (for example `Ask__MinScore`, `Ask__Thinking`) from the environment. Every must-refuse case must be refused by the model or the retrieval gate (an outage, the budget or the kill switch fails the run instead of counting as a refusal), the citation hit rate must be at least 90% and false refusals at most 10%. `.github/workflows/ask-evals.yml` runs it by hand with the `evals` environment's `ANTHROPIC_EVAL_KEY`. Tune the retrieval gate and thinking from this eval, never from live traffic.
- Rules to keep: index only what `api/corpus.json` allows (never notes or interview material); the key is never a `VITE_` variable, in the image or in a log; keep every cap (kill switch, daily budget, `max_tokens`, rate limits, prepaid credit); retrieved text is data, never instructions. A change to any of those, a new secret or a new outside service updates `docs/security.md` and the ADRs in the same pull request. `/privacy` (`src/pages/Privacy.tsx`, prerendered by `scripts/prerender-routes.mjs`) must stay true to what the site sends.
- `.github/workflows/ask.yml` runs all of that on pull requests that touch the API, the docs, `deploy/` or the project data; the retrieval check must find an expected file in the top 6 for at least 90% of `api/evals/evals.json`'s answerable questions. It also builds `api/Dockerfile`, with the index and model baked in. On `main`, and nightly when `api/scripts/index-is-current.sh` finds an indexed repository has moved, it pushes `ghcr.io/natezimm/nathanzimmerman-ask` and deploys `deploy/compose.yaml` to `~/portfolio-ask` on the VM (port 8095, 256 MB cap). The nginx location (`deploy/nginx-ask.conf`) and the key in the VM's `.env` are set up by hand; `deploy/README.md` has the steps and the kill switch.

## Verification and delivery

Run relevant checks for the change and use `npm run quality` for broad application changes. Report failures and checks not run.

All five repos default to Playwright port 4173, and local runs reuse a server already listening there. Stop unrelated previews and run browser suites sequentially to avoid testing the wrong app or stale build. This repo can use another port with `PLAYWRIGHT_PORT=4174 npm run test:e2e`.

`.github/workflows/deploy.yml` gates pull requests and pushes to `main`; a successful push to `main` deploys `dist/` to GCP. The VM's nginx must fall back to `index.html` so `/projects/<slug>` loads on a direct visit. Build, coverage, and browser-report directories are generated output. `.github/workflows/security.yml` runs CodeQL (TypeScript/JavaScript and the workflows), GitHub's dependency review on pull requests and an audit of shipped npm packages for high or critical advisories, on pull requests, `main` and every Monday; it is apart from the deploy, so a new advisory never holds one.
