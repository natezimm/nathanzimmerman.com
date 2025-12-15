![CI](https://github.com/natezimm/nathanzimmerman.com/actions/workflows/deploy.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-enforced-brightgreen)
# Nathan Zimmerman - Portfolio Website

Personal portfolio built with React, TypeScript, and Vite. The single‑page experience ties together navigation, hero, about, projects, and contact sections with responsive layouts, theme persistence, and subtle animation hooks powered by Radix UI primitives, Lucide icons, and Sonner toasts.

## Quick start

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173` (or the port Vite reports) to start exploring the live preview.

## Available scripts

- `npm run dev` – Vite development server with Fast Refresh.
- `npm run build` – Production bundle for static hosting (outputs in `dist/`).
- `npm run build:dev` – Build with the development mode configuration.
- `npm run preview` – Serve the build locally for a final sanity check.
- `npm run lint` – ESLint across the whole workspace (powered by `@eslint/js` + TypeScript).
- `npm run test` – Vitest suite covering shared helpers, context, and visible sections.
- `npm run test:watch` – Watch mode for the Vitest suite.
- `npm run test:coverage` – Vitest with coverage reporting via `c8`.

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

- Vitest + Testing Library power the component and context tests in `src/components/` and `src/contexts/`.
- ESLint enforces the TypeScript + React conventions; run `npm run lint` before submitting changes.

## Deployment

Use `npm run build` to generate the production bundle in `dist/` and deploy that folder to any static host (Lightsail, Vercel, etc.). The repo is set up for modern static deployments with HTTPS offloading handled by your environment.
