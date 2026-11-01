# Nathan Zimmerman, portfolio

My portfolio at [nathanzimmerman.com](https://nathanzimmerman.com): a React and TypeScript single-page site that features my projects with live demos, screen recordings and a page of details for each.

[![CI](https://github.com/natezimm/nathanzimmerman.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/natezimm/nathanzimmerman.com/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Live site](https://img.shields.io/badge/site-nathanzimmerman.com-0369a1)](https://nathanzimmerman.com)

## What's on it

- **A playable hero**: the portrait card is a small Brick Breaker game that pauses off screen and under reduced motion.
- **Featured projects**: [Wheelhouse](https://calendar.nathanzimmerman.com), [Know Ball](https://knowball.nathanzimmerman.com), [Rabbit Ears](https://rabbitears.nathanzimmerman.com) and [Brick Breaker Resume](https://resume.nathanzimmerman.com). Each card plays a short recording on hover and links to its demo, its code and a project page at `/projects/<slug>` with the problem, engineering highlights and architecture diagram.
- **Earlier projects**: Nerdle, Sudoku and Blackjack, whose demos are retired, with links to their code.
- **Experience** as a git graph, a contact form through EmailJS, and light and dark themes.

See [`docs/architecture.md`](docs/architecture.md) for runtime boundaries, quality gates, deployment and how the five project repositories are hosted.

## Quick start

1. `npm ci`
2. `npm run dev`
3. Open `http://localhost:8081`.

## Available scripts

- `npm run dev` – Vite development server with Fast Refresh.
- `npm run build` – Production bundle for static hosting (outputs in `dist/`).
- `npm run build:dev` – Build with the development mode configuration.
- `npm run preview` – Serve the build locally for a final sanity check.
- `npm run lint` - ESLint across the whole workspace (powered by `@eslint/js` + TypeScript).
- `npm run format` / `npm run format:check` - Prettier write/check modes using the shared repo style.
- `npm run typecheck` - TypeScript compilation with `noEmit`.
- `npm run quality` - Full gate: format check, lint, typecheck, coverage, and the Playwright suite against a production build.
- `npm run test` - Vitest suite covering shared helpers, context, and visible sections.
- `npm run test:watch` – Watch mode for the Vitest suite.
- `npm run test:coverage` – Vitest with V8 coverage and the thresholds in `vite.config.ts`.
- `npm run test:e2e` – Playwright end-to-end tests against a production preview.
- `npm run test:e2e:headed` / `npm run test:e2e:ui` – Debug Playwright in headed or UI mode.
- `npm run images:project -- <screenshot.png> <slug>` – Convert a project screenshot into the site's image set (see below).
- `npm run diagrams` – Render `docs/diagrams/*.mmd` to the SVGs the project pages show (set `PUPPETEER_EXECUTABLE_PATH` to use an installed Chromium).

## Project screenshots

Each project card serves AVIF and WebP at two widths through `<picture>` with a `600w, 1200w` srcset. To add or replace one, take a full-window screenshot (2880 px wide on a Retina display works well) and run:

```sh
npm run images:project -- ~/Desktop/know-ball.png know-ball
```

That writes to `src/assets/`:

| File                                                     | Size         | Use                                                     |
| -------------------------------------------------------- | ------------ | ------------------------------------------------------- |
| `project-<slug>.png`                                     | original     | Source, kept so the set can be regenerated; not bundled |
| `project-<slug>.avif`, `project-<slug>.webp`             | 1200 px wide | `1200w` srcset entry                                    |
| `project-<slug>-small.avif`, `project-<slug>-small.webp` | 600 px wide  | `600w` srcset entry                                     |

The slug is lowercase with dashes and becomes the file name, so rerunning with an existing slug replaces that project's images in place. Import the new files in `src/data/portfolioData.ts`, which both the card and the project page read. Settings live at the top of `scripts/project-images.mjs`.

## Adding a featured project

A project needs four things, all referenced from its entry in `projectEntries` in `src/data/portfolioData.ts`:

1. A screenshot set from `npm run images:project`.
2. A short silent MP4 (about 20 seconds, 1280 px wide, no audio) in `src/assets/video/`.
3. Its containers diagram: copy the Mermaid block from the project's README into `docs/diagrams/<slug>.mmd` and run `npm run diagrams`.
4. The card summary, the project page's problem, features and highlights, and its live, code and architecture links.

Add its URL to `public/sitemap.xml`.

## Tech stack

| Area    | Tools                                                                |
| ------- | -------------------------------------------------------------------- |
| App     | React 18, TypeScript, Vite, React Router (home and project pages)    |
| Styling | Tailwind CSS with `tailwindcss-animate`, Framer Motion, Lucide icons |
| UI      | A few shadcn-style primitives on Radix Slot, Sonner toasts           |
| Contact | `@emailjs/browser`                                                   |
| Quality | Vitest and Testing Library, Playwright, ESLint, Prettier             |

## Project layout

- `src/components/` – Hero, About, Projects, Contact, Footer, and shared UI primitives (including a theme toggle).
- `src/contexts/ThemeContext.tsx` – theme persistence, system preference detection, and toggles wrapped around the app.
- `src/pages/` – `Index` for the home page, `ProjectDetail` for project pages at `/projects/:slug`, `NotFound` for everything else.
- `src/data/portfolioData.ts` – featured and earlier projects, and the experience timeline.
- `src/lib/` – utilities such as `cn()` (clsx + tailwind-merge) helpers used throughout.
- `src/assets/` – screenshots, recordings (`video/`) and rendered diagrams (`diagrams/`); `public/` is served as is.
- `docs/diagrams/` – Mermaid sources for the project page diagrams.

## Testing & quality

- CI runs `npm run quality` on pull requests and pushes to `main` before deployment
- Coverage is enforced as part of CI to prevent regressions
- Coverage thresholds:
  - Lines >= 67%
  - Statements >= 66%
  - Functions >= 64%
  - Branches >= 64%

Tooling:

- Vitest + Testing Library for component, context, and integration tests
- Playwright for cross-viewport end-to-end smoke coverage
- ESLint for consistent TypeScript and React conventions
- Prettier for formatting

## Security

The site implements multiple layers of security:

### HTTP Security Headers (`public/_headers`)

- **Content-Security-Policy (CSP)** – Restricts resource loading to trusted origins, preventing XSS and data injection attacks
- **X-Content-Type-Options: nosniff** – Prevents MIME type sniffing
- **X-Frame-Options: DENY** – Blocks clickjacking by preventing iframe embedding
- **Referrer-Policy: strict-origin-when-cross-origin** – Controls referrer information leakage
- **Permissions-Policy** – Disables access to camera, microphone, geolocation, and FLoC tracking

### Contact Form Protection

- **Input sanitization** – Strips potentially dangerous HTML characters to prevent XSS
- **Length limits** – Enforces maximum lengths (name: 100, email: 254, message: 2000 chars)
- **Rate limiting** – 30-second cooldown between submissions to prevent spam
- **Environment variable isolation** – EmailJS credentials stored in env vars, not in code

### Caching Strategy

- Static assets (JS, CSS, images, fonts) cached for 1 year with content hashing
- HTML files use `must-revalidate` to ensure users always get the latest version

## Deployment

Every push to `main` runs the quality gate in GitHub Actions, then rsyncs `dist/` to the GCP VM, where nginx serves it over HTTPS, and checks that the site answers. nginx falls back to `index.html` so project page URLs load directly. See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## License

[MIT](LICENSE)
