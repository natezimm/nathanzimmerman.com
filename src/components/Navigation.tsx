import { useState } from "react";
import { Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ViewMode } from "@/data/portfolioData";
import { trackPortfolioEvent } from "@/lib/analytics";

type NavigationProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

const Navigation = ({ viewMode, onViewModeChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const changeViewMode = (mode: ViewMode) => {
    trackPortfolioEvent("view_mode_change", { mode, source: "navigation" });
    onViewModeChange(mode);
  };

  const navItems = [
    { label: "ABOUT", id: "about" },
    { label: "PROJECTS", id: "projects" },
    { label: "EXPERIENCE", id: "experience" },
    { label: "SKILLS", id: "skills" },
    { label: "CONTACT", id: "contact" },
  ];

  return (
    <nav className="retro-nav fixed left-0 right-0 top-0 z-50 border-b border-cyan-300/30 bg-slate-950/92 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex min-h-[66px] items-center justify-between gap-4">
          <button
            onClick={() => scrollToSection("home")}
            className="retro-ui text-xs text-emerald-300 md:text-sm"
          >
            NATHAN ZIMMERMAN
          </button>

          <div className="hidden items-center gap-5 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="retro-ui text-xs text-foreground/85 transition-colors hover:text-amber-200"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <div className="inline-flex overflow-hidden rounded-sm border border-cyan-300/35">
              <button
                onClick={() => changeViewMode("map")}
                aria-pressed={viewMode === "map"}
                className={cn(
                  "retro-ui px-3 py-2 text-[11px] transition",
                  viewMode === "map"
                    ? "bg-emerald-500/25 text-emerald-50"
                    : "bg-slate-900/70 text-slate-200 hover:bg-slate-800/80"
                )}
              >
                MAP VIEW
              </button>
              <button
                onClick={() => changeViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                className={cn(
                  "retro-ui border-l border-cyan-300/35 px-3 py-2 text-[11px] transition",
                  viewMode === "grid"
                    ? "bg-cyan-500/25 text-cyan-50"
                    : "bg-slate-900/70 text-slate-200 hover:bg-slate-800/80"
                )}
              >
                RESUME VIEW
              </button>
            </div>

            <a
              href="https://github.com/natezimm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              onClick={() => trackPortfolioEvent("social_link_click", { destination: "github", source: "nav" })}
              className="rounded-sm border border-slate-400/40 bg-slate-700/35 p-2 text-slate-100 transition hover:bg-slate-700/60"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/zimmermannathan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              onClick={() => trackPortfolioEvent("social_link_click", { destination: "linkedin", source: "nav" })}
              className="rounded-sm border border-slate-400/40 bg-slate-700/35 p-2 text-slate-100 transition hover:bg-slate-700/60"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackPortfolioEvent("resume_click", { source: "nav" })}
              className="retro-ui rounded-sm border border-amber-300/50 bg-amber-400/15 px-3 py-2 text-[11px] text-amber-100 transition-colors hover:bg-amber-400/25"
            >
              RESUME
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="retro-ui rounded-sm border border-cyan-300/40 px-2 py-1 text-xs text-cyan-100 md:hidden"
          >
            MENU
          </button>
        </div>

        {isMobileMenuOpen && (
          <div data-testid="mobile-menu" className="md:hidden pb-3">
            <div className="flex flex-col gap-2 rounded-sm border border-cyan-300/25 bg-slate-950/95 p-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "retro-ui rounded-sm border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-left text-xs text-cyan-100"
                  )}
                >
                  {item.label}
                </button>
              ))}

              <div className="mt-1 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    changeViewMode("map");
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "retro-ui rounded-sm border px-3 py-2 text-xs",
                    viewMode === "map"
                      ? "border-emerald-300/40 bg-emerald-500/20 text-emerald-50"
                      : "border-slate-500/35 bg-slate-700/20 text-slate-100"
                  )}
                >
                  MAP VIEW
                </button>
                <button
                  onClick={() => {
                    changeViewMode("grid");
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "retro-ui rounded-sm border px-3 py-2 text-xs",
                    viewMode === "grid"
                      ? "border-cyan-300/40 bg-cyan-500/20 text-cyan-50"
                      : "border-slate-500/35 bg-slate-700/20 text-slate-100"
                  )}
                >
                  RESUME VIEW
                </button>
              </div>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackPortfolioEvent("resume_click", { source: "mobile_nav" })}
                className="retro-ui rounded-sm border border-amber-300/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-100"
              >
                RESUME
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
