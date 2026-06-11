# Architecture

## Runtime Topology

The portfolio is a React 18, TypeScript, and Vite single-page application. Vite builds static assets into `dist/`, while runtime behavior is fully client-side except for third-party EmailJS contact submission.

## Architecture Diagram

```mermaid
flowchart LR
  Visitor["Visitor browser"] --> Site["nathanzimmerman.com<br/>static host"]
  Site --> App["React 18 + Vite SPA"]
  App --> Router["React Router<br/>Index, ProjectDetail, NotFound"]
  Router --> Sections["Page sections<br/>Hero, About, Projects, Experience, Skills, Contact"]
  Sections --> Content["Portfolio content<br/>src/data/portfolioData.ts"]
  App --> Theme["ThemeContext<br/>localStorage + system preference"]
  Sections --> Contact["Contact form"]
  Contact --> EmailJS["@emailjs/browser"]
  Sections --> Projects["Project cards"]
  Projects --> ProjectSites["Project subdomains<br/>resume, nerdle, sudoku, blackjack"]
  Repo["Repo quality gate<br/>npm run quality"] --> Build["Vite build<br/>dist/"]
  Build --> Deploy["GitHub Actions<br/>rsync to Lightsail"]

  classDef user fill:#f8fafc,stroke:#475569,color:#0f172a
  classDef site fill:#e0f2fe,stroke:#0369a1,color:#0c4a6e
  classDef server fill:#ffedd5,stroke:#c2410c,color:#7c2d12
  classDef repo fill:#eef2ff,stroke:#4338ca,color:#312e81
  classDef client fill:#dcfce7,stroke:#15803d,color:#14532d
  classDef data fill:#fef3c7,stroke:#b45309,color:#78350f
  classDef delivery fill:#f3e8ff,stroke:#7e22ce,color:#581c87
  classDef external fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d
  class Visitor user
  class Site,ProjectSites site
  class App,Router,Sections,Theme,Contact,Projects client
  class Content data
  class Repo,Build,Deploy delivery
  class EmailJS external
```

## Source Boundaries

`src/pages/` owns route-level composition. `src/components/` owns visible sections and shared UI primitives. `src/contexts/` owns app-level theme state. `src/data/` holds portfolio/navigation content, and `src/lib/` holds reusable helpers and analytics utilities.

## Quality Gates

Run `npm run quality` from the repo root. The gate checks Prettier formatting, ESLint, TypeScript compilation, Vitest coverage thresholds, and the production Vite build.

## Deployment Flow

GitHub Actions runs the root quality gate for pull requests and pushes to `main`. Pushes to `main` upload the built `dist/` artifact, download it in the deploy job, sync it to Lightsail, and verify the production site responds.

## Workspace Connectivity

```mermaid
flowchart LR
  subgraph Workspace["Five repository workspace"]
    PortfolioRepo["nathanzimmerman.com<br/>portfolio"]
    BrickRepo["brick-breaker-resume<br/>Phaser resume game"]
    NerdleRepo["nerdle<br/>React + Express word game"]
    SudokuRepo["sudoku<br/>Angular + ASP.NET Core"]
    BlackjackRepo["blackjack<br/>React + Spring Boot"]
  end

  PortfolioRepo --> PortfolioSite["nathanzimmerman.com"]
  BrickRepo --> BrickSite["resume.nathanzimmerman.com"]
  NerdleRepo --> NerdleSite["nerdle.nathanzimmerman.com"]
  SudokuRepo --> SudokuSite["sudoku.nathanzimmerman.com"]
  BlackjackRepo --> BlackjackSite["blackjack.nathanzimmerman.com"]

  PortfolioSite --> BrickSite
  PortfolioSite --> NerdleSite
  PortfolioSite --> SudokuSite
  PortfolioSite --> BlackjackSite

  PortfolioRepo --> Actions["GitHub Actions<br/>quality + deploy workflows"]
  BrickRepo --> Actions
  NerdleRepo --> Actions
  SudokuRepo --> Actions
  BlackjackRepo --> Actions
  Actions --> Lightsail["AWS Lightsail<br/>static sites + app services"]
  Lightsail --> PortfolioSite
  Lightsail --> BrickSite
  Lightsail --> NerdleSite
  Lightsail --> SudokuSite
  Lightsail --> BlackjackSite

  classDef user fill:#f8fafc,stroke:#475569,color:#0f172a
  classDef site fill:#e0f2fe,stroke:#0369a1,color:#0c4a6e
  classDef server fill:#ffedd5,stroke:#c2410c,color:#7c2d12
  classDef repo fill:#eef2ff,stroke:#4338ca,color:#312e81
  classDef client fill:#dcfce7,stroke:#15803d,color:#14532d
  classDef data fill:#fef3c7,stroke:#b45309,color:#78350f
  classDef delivery fill:#f3e8ff,stroke:#7e22ce,color:#581c87
  classDef external fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d
  class PortfolioRepo,BrickRepo,NerdleRepo,SudokuRepo,BlackjackRepo repo
  class PortfolioSite,BrickSite,NerdleSite,SudokuSite,BlackjackSite site
  class Actions,Lightsail delivery
```

## Deferred Architecture Follow-Ups

Keep TypeScript strictness hardening separate from this consistency pass. Future work can tighten `tsconfig` flags incrementally and remove unused UI dependencies only after confirming they are not planned design-system surface area.
