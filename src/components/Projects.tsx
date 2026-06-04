import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { projectEntries, type ViewMode } from "@/data/portfolioData";
import { cn } from "@/lib/utils";

const accentClasses: Record<string, string> = {
  forest: "border-green-400/38 bg-green-500/10",
  violet: "border-violet-400/40 bg-violet-500/10",
  ember: "border-orange-400/42 bg-orange-500/10",
  azure: "border-blue-400/42 bg-blue-500/10",
  gold: "border-yellow-400/42 bg-yellow-500/10",
  jade: "border-emerald-400/42 bg-emerald-500/10",
};

type ProjectsProps = {
  viewMode: ViewMode;
};

const Projects = ({ viewMode }: ProjectsProps) => {
  return (
    <section id="projects" className="retro-section projects-zone py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="retro-heading text-4xl text-violet-300 md:text-5xl">FEATURED PROJECTS</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
              Interactive full-stack projects that combine engineering, design, and gameplay to create engaging user
              experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {projectEntries.map((project) => (
              <article
                key={project.slug}
                className={`retro-project-card rounded-sm border p-3 ${
                  viewMode === "map"
                    ? accentClasses[project.accent]
                    : "border-cyan-300/30 bg-slate-900/75"
                }`}
              >
                <p className="retro-ui text-[10px] text-amber-200">{project.regionLabel}</p>
                <h3 className="retro-ui mt-1 text-lg text-slate-50">{project.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{project.subtitle}</p>

                <div
                  className={cn(
                    "mt-3 flex aspect-[1200/648] items-center justify-center overflow-hidden rounded-sm border border-slate-200/20",
                    project.mediaBackground === "dark" ? "bg-emerald-950/80" : "bg-white"
                  )}
                >
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>

                <p className="mt-3 min-h-[68px] text-sm leading-relaxed text-slate-200">{project.summary}</p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {project.links.live ? (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="retro-ui inline-flex items-center justify-center gap-1 rounded-sm border border-emerald-300/45 bg-emerald-500/15 px-2 py-2 text-[10px] text-emerald-100 hover:bg-emerald-500/25"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      LIVE
                    </a>
                  ) : (
                    <span className="retro-ui inline-flex items-center justify-center rounded-sm border border-slate-500/40 bg-slate-600/20 px-2 py-2 text-[10px] text-slate-300">
                      LIVE
                    </span>
                  )}

                  {project.links.code ? (
                    <a
                      href={project.links.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="retro-ui inline-flex items-center justify-center gap-1 rounded-sm border border-cyan-300/45 bg-cyan-500/15 px-2 py-2 text-[10px] text-cyan-100 hover:bg-cyan-500/25"
                    >
                      <Github className="h-3.5 w-3.5" />
                      CODE
                    </a>
                  ) : (
                    <span className="retro-ui inline-flex items-center justify-center rounded-sm border border-slate-500/40 bg-slate-600/20 px-2 py-2 text-[10px] text-slate-300">
                      CODE
                    </span>
                  )}

                  <Link
                    to={`/projects/${project.slug}`}
                    className="retro-ui inline-flex items-center justify-center rounded-sm border border-amber-300/45 bg-amber-500/15 px-2 py-2 text-[10px] text-amber-100 hover:bg-amber-500/25"
                  >
                    DETAILS
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
