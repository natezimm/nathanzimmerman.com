# Portfolio agent guide

## Scope and workspace

This repository is Nathan Zimmerman's public portfolio: a React/TypeScript SPA built with Vite, Tailwind, and Radix UI. It links to four separately deployed sibling repositories: `../brick-breaker-resume`, `../nerdle`, `../blackjack`, and `../sudoku`. They are independent Git repositories, not npm workspaces. Read a sibling's `AGENTS.md` before changing it.

Preserve unrelated working-tree changes. `docs/architecture.md` has broader design context, but some descriptions are stale; use current imports, scripts, and configuration to verify behavior. Update this guide when changing its documented entry points or commands.

## Where to work

- `src/App.tsx` currently routes only `/` and the catch-all 404. `src/pages/Index.tsx` composes the homepage. `ProjectDetail.tsx` has tests but is not wired into the app router.
- Homepage project cards are defined inside `src/components/Projects.tsx`; experience content comes from `src/data/portfolioData.ts`. That data file also contains project entries used by the unrouted detail page. Check the consuming component before editing content.
- `src/components/Navigation.tsx` owns active section navigation. `src/data/navigationMap.ts` has tests but no current app import; changing it does not change homepage navigation.
- `src/components/`: visible portfolio sections; `ui/` and `shared/` contain reusable elements.
- `src/contexts/ThemeContext.tsx`: saves `light`/`dark` under the `theme` localStorage key and defaults to dark when no valid value is saved.
- `src/lib/`: shared helpers, analytics, and skill metrics. The `@/` import alias resolves to `src/`.
- `src/index.css`, `tailwind.config.ts`, and `src/assets/`: styling and bundled imagery; `public/` contains directly served assets and `_headers`.

## Commands

Run from this repository root. Node 22 is specified by both `.nvmrc` and `package.json`.

- Install: `npm ci`.
- Develop: `npm run dev` (configured port **8081**).
- Build: `npm run build` produces `dist/`; preview with `npm run preview`.
- Unit/component tests: `npm test`; target a file with `npm test -- src/components/Contact.test.tsx`.
- Static checks: `npm run lint` and `npm run typecheck`.
- Coverage: `npm run test:coverage` (Vitest/Testing Library).
- Browser tests: `npm run test:e2e`; install Chromium first with `npx playwright install chromium` if needed.
- Full CI gate: `npm run quality` runs formatting, lint, typecheck, coverage, and Playwright. Playwright normally builds and serves the production app; see the server-reuse caveat below.
- Formatting: `npx prettier --check <files>` or `npx prettier --write <files>`. A scoped formatting check is sufficient for documentation-only edits.

## Behavior to preserve

- Check desktop/mobile layouts, keyboard controls, accessible labels, and reduced-motion behavior when changing UI or animations. Reuse Tailwind tokens and existing UI primitives.
- Contact submission uses EmailJS in `src/components/Contact.tsx`. Configuration names are `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY`. Browser environment variables are public; do not place secrets in them. Preserve validation and submission cooldowns, and mock external delivery in tests.
- Keep project links, resume claims, and metrics consistent across their consumers; preserve the public `/resume.pdf` link.
- Tests are colocated as `*.test.ts(x)`; `src/setupTests.ts` supplies browser mocks. `e2e/portfolio.spec.ts` covers Chromium desktop/mobile. Coverage thresholds live in `vite.config.ts`.

## Verification and delivery

Run relevant checks for the change and use `npm run quality` for broad application changes. Report failures and checks not run.

All five repos default to Playwright port 4173, and local runs reuse a server already listening there. Stop unrelated previews and run browser suites sequentially to avoid testing the wrong app or stale build. This repo can use another port with `PLAYWRIGHT_PORT=4174 npm run test:e2e`.

`.github/workflows/deploy.yml` gates pull requests and pushes to `main`; a successful push to `main` deploys `dist/` to GCP. Build, coverage, and browser-report directories are generated output.
