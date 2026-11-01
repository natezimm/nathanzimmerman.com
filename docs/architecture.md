# Architecture

## Runtime Topology

The portfolio is a React 18, TypeScript, and Vite single-page application. Vite builds static assets into `dist/`, while runtime behavior is fully client-side except for third-party EmailJS contact submission.

## Architecture Diagram

```mermaid
flowchart LR
  Visitor["Visitor browser"] --> Site["nathanzimmerman.com<br/>static host"]
  Site --> App["React 18 + Vite SPA"]
  App --> Router["React Router<br/>Index, /projects/:slug, NotFound"]
  Router --> Sections["Home sections<br/>Hero, About, Experience, Projects, Contact"]
  Router --> ProjectPages["Project pages<br/>ProjectDetail, loaded on demand"]
  Sections --> Content["Portfolio content<br/>src/data/portfolioData.ts"]
  ProjectPages --> Content
  Content --> Media["Screenshots, recordings,<br/>diagrams in src/assets"]
  App --> Theme["ThemeContext<br/>localStorage + system preference"]
  Sections --> Contact["Contact form"]
  Contact --> EmailJS["@emailjs/browser"]
  Sections & ProjectPages --> ProjectSites["Project demos<br/>calendar, knowball, rabbitears, resume"]
  Repo["Repo quality gate<br/>npm run quality"] --> Build["Vite build<br/>dist/"]
  Build --> Deploy["GitHub Actions<br/>rsync to GCP"]

  classDef user fill:#f8fafc,stroke:#475569,color:#0f172a
  classDef site fill:#e0f2fe,stroke:#0369a1,color:#0c4a6e
  classDef client fill:#dcfce7,stroke:#15803d,color:#14532d
  classDef data fill:#fef3c7,stroke:#b45309,color:#78350f
  classDef delivery fill:#f3e8ff,stroke:#7e22ce,color:#581c87
  classDef external fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d
  class Visitor user
  class Site,ProjectSites site
  class App,Router,Sections,ProjectPages,Theme,Contact client
  class Content,Media data
  class Repo,Build,Deploy delivery
  class EmailJS external
```

## Source Boundaries

`src/pages/` owns route-level composition: `Index` for the home page, `ProjectDetail` for the project page at `/projects/:slug`, and `NotFound`. `src/components/` owns visible sections and shared UI primitives. `src/contexts/` owns app-level theme state. `src/data/portfolioData.ts` holds the featured projects (card and project page content), the earlier projects and the experience timeline, and `src/lib/` holds reusable helpers and analytics utilities.

Each featured project has a screenshot set (`npm run images:project`), a short silent MP4 in `src/assets/video/` that plays on hover and on its project page, and its containers diagram. The diagram sources in `docs/diagrams/` are copies of each project's README diagram; `npm run diagrams` renders them to `src/assets/diagrams/` with Mermaid CLI.

## Quality Gates

Run `npm run quality` from the repo root. The gate checks Prettier formatting, ESLint, TypeScript compilation, Vitest coverage thresholds, and the Playwright suite against the production build.

## Deployment Flow

GitHub Actions runs the root quality gate for pull requests and pushes to `main`. Pushes to `main` upload the built `dist/` artifact, download it in the deploy job, sync it to GCP, and verify the production site responds. The server's nginx must fall back to `index.html` for unknown paths so `/projects/<slug>` loads on a direct visit.

## Workspace Connectivity

All five projects run on one GCP VM. Its nginx terminates HTTPS for every subdomain and serves the two static sites from folders, or forwards to each app's containers on a loopback port.

```mermaid
flowchart LR
  subgraph Repos["GitHub repositories"]
    PortfolioRepo["nathanzimmerman.com<br/>React portfolio"]
    BrickRepo["brick-breaker-resume<br/>Phaser game"]
    WheelhouseRepo["wheelhouse<br/>.NET + Angular calendar"]
    KnowBallRepo["know-ball<br/>.NET + Angular trivia"]
    RabbitRepo["rabbit-ears<br/>.NET + Angular TV"]
  end

  Actions["GitHub Actions<br/>tests on every PR and main"]
  Ghcr["GitHub Container Registry"]

  PortfolioRepo & BrickRepo & WheelhouseRepo & KnowBallRepo & RabbitRepo --> Actions
  Actions -->|"rsync dist/"| PortfolioSite & BrickSite
  Actions -->|"push images"| Ghcr
  Ghcr -->|"pull on deploy"| WheelhouseSite & KnowBallSite

  subgraph Vm["GCP VM"]
    Nginx["nginx<br/>HTTPS for every subdomain"]
    PortfolioSite["nathanzimmerman.com<br/>static files"]
    BrickSite["resume.nathanzimmerman.com<br/>static files"]
    WheelhouseSite["calendar.nathanzimmerman.com<br/>Compose: web, API, PostgreSQL<br/>demo, then family instances"]
    KnowBallSite["knowball.nathanzimmerman.com<br/>Compose: API, importer, PostgreSQL"]
    RabbitSite["rabbitears.nathanzimmerman.com<br/>demo container, released by hand"]
  end

  Visitor["Visitor"] --> Nginx
  Nginx --> PortfolioSite & BrickSite & WheelhouseSite & KnowBallSite & RabbitSite

  classDef user fill:#f8fafc,stroke:#475569,color:#0f172a
  classDef site fill:#e0f2fe,stroke:#0369a1,color:#0c4a6e
  classDef server fill:#ffedd5,stroke:#c2410c,color:#7c2d12
  classDef repo fill:#eef2ff,stroke:#4338ca,color:#312e81
  classDef delivery fill:#f3e8ff,stroke:#7e22ce,color:#581c87
  class Visitor user
  class PortfolioRepo,BrickRepo,WheelhouseRepo,KnowBallRepo,RabbitRepo repo
  class PortfolioSite,BrickSite site
  class Nginx,WheelhouseSite,KnowBallSite,RabbitSite server
  class Actions,Ghcr delivery
```

Nerdle, Sudoku and Blackjack were retired in October 2026: their demos and subdomains are gone from the VM, and the portfolio lists them under Earlier projects with links to their repositories.

## Deferred Architecture Follow-Ups

Keep TypeScript strictness hardening separate from content changes. Future work can tighten `tsconfig` flags incrementally and raise the coverage thresholds toward 80%.
