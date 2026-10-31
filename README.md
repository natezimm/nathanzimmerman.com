[![CI](https://github.com/natezimm/nathanzimmerman.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/natezimm/nathanzimmerman.com/actions/workflows/deploy.yml)
[![Coverage](https://img.shields.io/badge/coverage-checked-brightgreen)](#testing--quality)

# Nathan Zimmerman - Portfolio Website

Personal portfolio built with React, TypeScript, and Vite. The single-page experience ties together navigation, hero, about, projects, and contact sections with responsive layouts, theme persistence, and subtle animation hooks powered by Radix UI primitives, Lucide icons, and Sonner toasts. See [`docs/architecture.md`](docs/architecture.md) for runtime boundaries, quality gates, deployment flow, and deferred architecture follow-ups.

## Quick start

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173` (or the port Vite reports) to start exploring the live preview.

## Available scripts

- `npm run dev` – Vite development server with Fast Refresh.
- `npm run build` – Production bundle for static hosting (outputs in `dist/`).
- `npm run build:dev` – Build with the development mode configuration.
- `npm run preview` – Serve the build locally for a final sanity check.
- `npm run lint` - ESLint across the whole workspace (powered by `@eslint/js` + TypeScript).
- `npm run format` / `npm run format:check` - Prettier write/check modes using the shared repo style.
- `npm run typecheck` - TypeScript compilation with `noEmit`.
- `npm run quality` - Full gate: format check, lint, typecheck, coverage, and production build.
- `npm run test` - Vitest suite covering shared helpers, context, and visible sections.
- `npm run test:watch` – Watch mode for the Vitest suite.
- `npm run test:coverage` – Vitest with coverage reporting via `c8`.
- `npm run test:e2e` – Playwright end-to-end tests against a production preview.
- `npm run test:e2e:headed` / `npm run test:e2e:ui` – Debug Playwright in headed or UI mode.
- `npm run images:project -- <screenshot.png> <slug>` – Convert a project screenshot into the site's image set (see below).

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
| `project-<slug>-detail.webp`                             | original     | Only with `--detail`, for a project's `detailMedia`     |

The slug is lowercase with dashes and becomes the file name, so rerunning with an existing slug replaces that project's images in place. Import the new files where the card is defined (`src/components/Projects.tsx`, and `src/data/portfolioData.ts` for `media`). Settings live at the top of `scripts/project-images.mjs`.

## Tech snapshot

- **React 18 + React Router DOM** – component-driven routing for the index/404 experience.
- **TypeScript + Vite** – fast compilation, native ESM, and debug-friendly source maps.
- **Tailwind CSS** (with `tailwindcss-animate` and `@tailwindcss/typography`) – utility-first styling layered on top of a `src/index.css` foundation.
- **Radix UI + cmdk + Lucide + Sonner** – accessible UI primitives, command-style navigation, icons, and toast notifications.
- **React Query** – caching/query client wrappers around any asynchronous interactions (even if primarily local for now).
- **@emailjs/browser** – client-side contact form submission.

## Project layout

- `src/components/` – Hero, About, Projects, Contact, Footer, and shared UI primitives (including a theme toggle).
- `src/contexts/ThemeContext.tsx` – theme persistence, system preference detection, and toggles wrapped around the app.
- `src/pages/` – `Index` for the main landing flow; `NotFound` for wildcard routes.
- `src/lib/` – utilities such as `cn()` (clsx + tailwind-merge) helpers used throughout.
- `public/` & `assets/` – statics served directly by Vite.

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
- Prettier for shared formatting across the portfolio and sibling repos

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

Use `npm run build` to generate the production bundle in `dist/` and deploy that folder to any static host (GCP, Vercel, etc.). The repo is set up for modern static deployments with HTTPS offloading handled by your environment.
