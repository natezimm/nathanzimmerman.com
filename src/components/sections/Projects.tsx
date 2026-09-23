import { useState } from 'react';
import { ExternalLink, Github, Code2, Server, Cpu, CheckCircle } from 'lucide-react';
import { projectEntries } from '@/data/portfolioData';
import { ProjectImage } from '@/components/shared/ProjectImage';

export const Projects = () => {
  const [sudokuTab, setSudokuTab] = useState<'architecture' | 'api' | 'testing'>('architecture');

  const sudokuProject = projectEntries.find((p) => p.slug === 'sudoku')!;
  const secondaryProjects = projectEntries.filter((p) => p.slug !== 'sudoku');

  return (
    <section id="projects" className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950/60">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Systems &amp; Architecture
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
            Featured Projects &amp; Live Demos
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            Full-stack web applications and microservices demonstrating backend correctness, API design, 
            session security, and modern frontend architecture.
          </p>
        </div>

        {/* Primary Spotlight: Sudoku (.NET + Angular) */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900/80 shadow-xl shadow-cyan-950/20">
          <div className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300">
                  Featured Full-Stack System
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  Sudoku — .NET Web API &amp; Angular Client
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={sudokuProject.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live Demo
              </a>
              <a
                href={sudokuProject.links.code}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-medium text-slate-200 transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6 p-6">
            {/* Left: Preview & Stack */}
            <div>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                <ProjectImage
                  project={sudokuProject}
                  useDetail
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Technology Stack
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {['C#', 'ASP.NET Core Web API', 'Angular', 'TypeScript', 'Reactive Forms', 'CI/CD'].map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-medium text-cyan-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Technical Inspector Tabs */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Tabs bar */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setSudokuTab('architecture')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      sudokuTab === 'architecture'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Cpu className="h-3.5 w-3.5" />
                    Architecture &amp; Features
                  </button>
                  <button
                    onClick={() => setSudokuTab('api')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      sudokuTab === 'api'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Server className="h-3.5 w-3.5" />
                    API &amp; Backend
                  </button>
                  <button
                    onClick={() => setSudokuTab('testing')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      sudokuTab === 'testing'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    Testing &amp; Invariants
                  </button>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                  {sudokuTab === 'architecture' && (
                    <div className="space-y-3 text-sm text-slate-300">
                      <p className="leading-relaxed">
                        Full-stack puzzle generation and gameplay platform built with modern Angular and a C# .NET Web API.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>On-demand puzzle generation across selectable difficulty curves with seed reproducibility.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Real-time input constraint validation, error highlighting, and responsive grid keyboard navigation.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Persistent player state, timer tracking, and session resumption across browser reloads.</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {sudokuTab === 'api' && (
                    <div className="space-y-3 text-xs font-mono">
                      <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                        <span className="text-cyan-400 font-bold">GET</span> /api/sudoku/generate?difficulty=medium
                        <p className="mt-1 text-slate-400 font-sans text-xs">
                          Generates a mathematically solvable 9x9 board with deterministic single-solution validation.
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                        <span className="text-emerald-400 font-bold">POST</span> /api/sudoku/validate
                        <p className="mt-1 text-slate-400 font-sans text-xs">
                          Validates submitted board states and verifies completed solutions against the server generator.
                        </p>
                      </div>
                      <p className="font-sans text-xs text-slate-400 mt-2">
                        Backend incorporates rate limiting, CORS configuration, and decoupled state verification.
                      </p>
                    </div>
                  )}

                  {sudokuTab === 'testing' && (
                    <div className="space-y-3 text-sm text-slate-300">
                      <p className="leading-relaxed">
                        Engineered with a focus on code correctness and test coverage:
                      </p>
                      <ul className="space-y-2 text-xs text-slate-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Unit tests verify board generator produces strictly valid puzzles with unique solutions.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>Solver algorithm tests prevent impossible board configurations and backtracking infinite loops.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>CI pipeline backs automated builds, linting, and unit test execution on every commit.</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Deployed on GCP VM · Nginx Reverse Proxy</span>
                <span className="font-mono text-cyan-300">sudoku.nathanzimmerman.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Systems Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondaryProjects.map((project) => (
            <div
              key={project.slug}
              className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/50 hover:border-slate-700 transition-all p-5 shadow-sm"
            >
              <div>
                <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 h-44">
                  <ProjectImage
                    project={project}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                </div>

                <h4 className="mt-4 text-base font-bold text-slate-100 flex items-center justify-between">
                  <span>{project.title}</span>
                  <span className="text-[11px] font-normal font-mono text-slate-400 uppercase">
                    {project.regionLabel}
                  </span>
                </h4>

                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-slate-800/90 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live App
                  </a>
                )}
                {project.links.code && (
                  <a
                    href={project.links.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
