# Portfolio agent guide

## Scope and workspace

This repository is Nathan Zimmerman's public portfolio: a React/TypeScript SPA built with Vite, Tailwind, and Radix UI. It features four separately deployed sibling repositories: `../wheelhouse` (calendar.nathanzimmerman.com), `../know-ball` (knowball.), `../rabbit-ears` (rabbitears.) and `../brick-breaker-resume` (resume.). They are independent Git repositories, not npm workspaces. Read a sibling's `AGENTS.md` before changing it. Nerdle, Sudoku and Blackjack are retired: they appear only under Earlier projects with GitHub links, so do not add live links or subdomains for them.

Preserve unrelated working-tree changes. `docs/architecture.md` has broader design context, but some descriptions are stale; use current imports, scripts, and configuration to verify behavior. Update this guide when changing its documented entry points or commands.

## Where to work

- `src/App.tsx` routes `/`, `/projects/:slug` (the project page, `src/pages/ProjectDetail.tsx`, loaded lazily) and the catch-all 404. `src/pages/Index.tsx` composes the homepage and scrolls to a `#section` hash on arrival.
- `src/data/portfolioData.ts` is the one source for project content: `projectEntries` feeds both the cards in `src/components/Projects.tsx` and the project pages, and `earlierProjects` is the retired list. Each entry imports its screenshot set, an MP4 in `src/assets/video/` and a diagram SVG in `src/assets/diagrams/`; the README's "Adding a featured project" lists the steps. Experience content lives in the same file.
- `src/components/Hero.tsx` owns the hero backdrop and pointer spotlight; `HeroGame.tsx` renders the playable portrait card, and the game rules live in `src/lib/brickBreaker.ts`. The Experience git graph reads `experienceItems` and `careerOriginItems` from the data file.
- `src/components/Navigation.tsx` owns active section navigation on the homepage.
- `src/components/`: visible portfolio sections; `ui/` and `shared/` contain reusable elements.
- `src/contexts/ThemeContext.tsx`: saves `light`/`dark` under the `theme` localStorage key and defaults to dark when no valid value is saved.
- `src/lib/`: shared helpers, analytics, and skill metrics. The `@/` import alias resolves to `src/`.
- `src/index.css`, `tailwind.config.ts`, and `src/assets/`: styling and bundled imagery; `public/` contains directly served assets and `_headers`.

## Commands

Run from this repository root. Node 22 is specified by both `.nvmrc` and `package.json`.

- Install: `npm ci`.
- Develop: `npm run dev` (configured port **8081**).
- Build: `npm run build` produces `dist/`, then `scripts/prerender-routes.mjs` writes `dist/projects/<slug>/index.html` (per-page title, canonical and preview tags) and `dist/sitemap.xml`; preview with `npm run preview`. Project URLs end in `/`, which is the canonical form.
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

## Verification and delivery

Run relevant checks for the change and use `npm run quality` for broad application changes. Report failures and checks not run.

All five repos default to Playwright port 4173, and local runs reuse a server already listening there. Stop unrelated previews and run browser suites sequentially to avoid testing the wrong app or stale build. This repo can use another port with `PLAYWRIGHT_PORT=4174 npm run test:e2e`.

`.github/workflows/deploy.yml` gates pull requests and pushes to `main`; a successful push to `main` deploys `dist/` to GCP. The VM's nginx must fall back to `index.html` so `/projects/<slug>` loads on a direct visit. Build, coverage, and browser-report directories are generated output.
