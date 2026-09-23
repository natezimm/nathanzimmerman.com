import { useState } from 'react';
import { ExternalLink, Github, Layers, ArrowUpRight, Cpu, Check, Terminal } from 'lucide-react';
import { projectEntries, type ProjectEntry } from '@/data/portfolioData';
import { ProjectImage } from '@/components/shared/ProjectImage';

export const Projects = () => {
  const [activeSlug, setActiveSlug] = useState<string>('sudoku');
  const [activeTab, setActiveTab] = useState<'architecture' | 'invariants' | 'stack'>('architecture');

  const activeProject: ProjectEntry =
    projectEntries.find((p) => p.slug === activeSlug) || projectEntries[0];

  return (
    <section id="systems" className="py-16 md:py-24 border-b border-white/[0.08] bg-[#0A0C0F]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#E6A838] uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              <span>01 // PRODUCTION ARTIFACTS &amp; SYSTEMS</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F2EE]">
              Systems Blueprint Console
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-400 max-w-md">
            Interactive console detailing system topology, state invariants, and runtime execution across live full-stack applications.
          </p>
        </div>

        {/* Master-Detail Blueprint Console */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          {/* Left Rail: System Selector */}
          <div className="space-y-2.5">
            <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest px-1">
              Select Active System:
            </p>

            {projectEntries.map((project, idx) => {
              const isSelected = project.slug === activeSlug;
              return (
                <button
                  key={project.slug}
                  onClick={() => {
                    setActiveSlug(project.slug);
                    setActiveTab('architecture');
                  }}
                  className={`w-full text-left p-4 rounded border transition-all ${
                    isSelected
                      ? 'border-[#E6A838] bg-[#14171E] shadow-lg shadow-[#E6A838]/5'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className={isSelected ? 'text-[#E6A838]' : 'text-zinc-500'}>
                      SYS_0{idx + 1}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      {project.regionLabel}
                    </span>
                  </div>

                  <h3 className="mt-1 text-base font-bold text-[#F3F2EE] font-heading">
                    {project.title}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-400 line-clamp-1 font-sans">
                    {project.subtitle}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-zinc-300 border border-white/[0.06]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Canvas: Blueprint Technical Dossier */}
          <div className="rounded-lg border border-white/[0.1] bg-[#0E1015] overflow-hidden shadow-2xl">
            {/* Blueprint Header */}
            <div className="border-b border-white/[0.08] bg-[#12151B] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#E6A838]">
                  <span className="h-2 w-2 rounded-full bg-[#00E599]" />
                  <span>SPECIFICATION DOSSIER // {activeProject.title}</span>
                </div>
                <h3 className="mt-1 text-2xl font-bold text-[#F3F2EE] font-heading">
                  {activeProject.title} — {activeProject.subtitle}
                </h3>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-2.5">
                {activeProject.links.live && (
                  <a
                    href={activeProject.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded bg-[#E6A838] hover:bg-[#f3b544] px-4 py-2 font-mono text-xs font-bold text-black transition-colors"
                  >
                    <span>Launch Live</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {activeProject.links.code && (
                  <a
                    href={activeProject.links.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2 font-mono text-xs font-medium text-[#F3F2EE] transition-colors"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </div>

            {/* Blueprint Content Grid */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Media Preview & Core Summary */}
              <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr] gap-6 items-center">
                <div className="overflow-hidden rounded border border-white/[0.08] bg-black/60 aspect-[16/10] flex items-center justify-center p-2">
                  <ProjectImage
                    project={activeProject}
                    useDetail
                    className="w-full h-full object-contain"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
                      Architectural Overview:
                    </h4>
                    <p className="mt-1 text-sm text-zinc-200 leading-relaxed font-sans">
                      {activeProject.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
                      Verified Technology Core:
                    </h4>
                    <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                      {activeProject.stack.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Inspection Tabs */}
              <div className="border-t border-white/[0.08] pt-6">
                <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 font-mono text-xs">
                  <button
                    onClick={() => setActiveTab('architecture')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
                      activeTab === 'architecture'
                        ? 'bg-white/[0.08] text-[#E6A838] border border-white/[0.1]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Cpu className="h-3.5 w-3.5" />
                    <span>01 // TOPOLOGY &amp; FLOW</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('invariants')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
                      activeTab === 'invariants'
                        ? 'bg-white/[0.08] text-[#E6A838] border border-white/[0.1]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>02 // CORE INVARIANTS</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('stack')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
                      activeTab === 'stack'
                        ? 'bg-white/[0.08] text-[#E6A838] border border-white/[0.1]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    <span>03 // DEPLOYMENT SPECS</span>
                  </button>
                </div>

                {/* Tab Views */}
                <div className="mt-5">
                  {activeTab === 'architecture' && (
                    <div className="rounded border border-white/[0.06] bg-black/40 p-5 font-mono text-xs space-y-3">
                      <div className="text-zinc-500 uppercase tracking-widest text-[10px]">
                        SYSTEM DATA FLOW &amp; STATE BOUNDARIES
                      </div>
                      <p className="text-zinc-300 font-sans text-sm leading-relaxed">
                        {activeProject.slug === 'sudoku' &&
                          'Clients interface with ASP.NET Core Web API endpoints to request uniquely generated 9x9 boards. The solver algorithm executes deterministic backtracking constraint verification to ensure every board has exactly one mathematical solution before client dispatch.'}
                        {activeProject.slug === 'blackjack' &&
                          'Spring Boot manages server-side state isolation across authenticated player sessions. Betting lifecycle, dealer hit-on-soft-17 rules, splits, and insurance payouts are executed in a state machine preventing client tampering.'}
                        {activeProject.slug === 'nerdle' &&
                          'Node.js/Express backend provides server-side guess validation against curated dictionaries with persistent player telemetry across multiple word-length challenge modes.'}
                        {activeProject.slug === 'brick-breaker' &&
                          'Browser-based compiler pipeline utilizing Mammoth.js to extract raw XML AST from uploaded binary .docx documents, mapping typography density into procedurally generated brick structures.'}
                      </p>
                      <div className="pt-2 text-[11px] text-[#E6A838]">
                        ✓ State decoupled from client DOM · Server-side validation enforced
                      </div>
                    </div>
                  )}

                  {activeTab === 'invariants' && (
                    <div className="space-y-3">
                      <p className="font-mono text-xs text-zinc-400">
                        Operational requirements verified in test suites:
                      </p>
                      <ul className="space-y-2.5">
                        {activeProject.features.map((feature, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex items-start gap-3 rounded border border-white/[0.06] bg-black/30 p-3 font-mono text-xs text-zinc-300"
                          >
                            <span className="text-[#00E599] font-bold">[{fIdx + 1}]</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'stack' && (
                    <div className="rounded border border-white/[0.06] bg-black/40 p-5 font-mono text-xs space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">
                            EXECUTION ENVIRONMENT
                          </span>
                          <span className="text-[#F3F2EE] font-semibold text-sm">
                            Linux VM / Nginx Reverse Proxy
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">
                            CLIENT BUNDLER
                          </span>
                          <span className="text-[#F3F2EE] font-semibold text-sm">
                            Vite / Production Minified Chunk Splitting
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">
                            CI / AUTOMATION
                          </span>
                          <span className="text-[#F3F2EE] font-semibold text-sm">
                            Automated Build &amp; Test Verification
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">
                            SOURCE REPOSITORY
                          </span>
                          <a
                            href={activeProject.links.code}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#E6A838] hover:underline flex items-center gap-1 font-semibold text-sm"
                          >
                            <span>Inspect on GitHub</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
