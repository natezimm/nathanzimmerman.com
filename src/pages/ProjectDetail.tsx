import { ArrowLeft, ExternalLink, FileText, Github } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { projectBySlug } from '@/data/portfolioData';
import { trackPortfolioEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import NotFound from './NotFound';

const ProjectDetail = () => {
  const { slug = '' } = useParams();
  const project = projectBySlug(slug);

  if (!project) {
    return <NotFound />;
  }

  return (
    <div className="project-detail-page min-h-screen">
      <header className="detail-topbar sticky top-0 z-40 border-b border-cyan-300/20 bg-slate-950/90 backdrop-blur">
        <div className="container mx-auto flex min-h-[66px] items-center justify-between gap-4 px-4">
          <Link
            to="/"
            className="retro-ui inline-flex items-center gap-2 text-xs text-cyan-100 hover:text-cyan-50"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO NATHAN&apos;S WORLD
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackPortfolioEvent('resume_click', { source: 'project_detail' })
            }
            className="retro-ui inline-flex items-center gap-2 rounded-sm border border-amber-300/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100 hover:bg-amber-500/20"
          >
            <FileText className="h-4 w-4" />
            RESUME
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="detail-frame mx-auto max-w-6xl rounded-md border border-cyan-300/25 bg-slate-950/78 p-5 md:p-8">
          <p className="retro-ui text-xs text-emerald-300/90">
            {project.regionLabel}
          </p>
          <h1 className="retro-heading mt-2 text-3xl text-slate-50 md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-slate-200 md:text-lg">
            {project.summary}
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-4">
              <div
                className={cn(
                  'flex items-center justify-center overflow-hidden rounded-sm border border-slate-200/20',
                  project.mediaBackground === 'dark'
                    ? 'bg-emerald-950/80'
                    : 'bg-white'
                )}
              >
                <img
                  src={project.detailImage ?? project.image}
                  alt={`${project.title} screenshot`}
                  className="h-auto w-full object-contain"
                />
              </div>

              <p className="rounded-sm border border-slate-200/10 bg-slate-900/70 p-4 text-sm leading-relaxed text-slate-200">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3">
                {project.links.live ? (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackPortfolioEvent('project_live_click', {
                        project: project.slug,
                        source: 'project_detail',
                      })
                    }
                    className="detail-action detail-action-live"
                  >
                    <ExternalLink className="h-4 w-4" />
                    VIEW LIVE
                  </a>
                ) : (
                  <span className="detail-action detail-action-muted">
                    LIVE COMING SOON
                  </span>
                )}
                {project.links.code ? (
                  <a
                    href={project.links.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackPortfolioEvent('project_code_click', {
                        project: project.slug,
                        source: 'project_detail',
                      })
                    }
                    className="detail-action detail-action-code"
                  >
                    <Github className="h-4 w-4" />
                    VIEW CODE
                  </a>
                ) : (
                  <span className="detail-action detail-action-muted">
                    PRIVATE CODEBASE
                  </span>
                )}
              </div>
            </section>

            <aside className="space-y-4">
              <article className="rounded-sm border border-emerald-300/20 bg-emerald-500/5 p-4">
                <h2 className="retro-ui text-xs text-emerald-200">
                  TECH STACK
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <li
                      key={item}
                      className="retro-ui rounded-sm border border-emerald-300/30 bg-emerald-600/10 px-2 py-1 text-[10px] text-emerald-100"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-sm border border-cyan-300/20 bg-cyan-500/5 p-4">
                <h2 className="retro-ui text-xs text-cyan-200">FEATURES</h2>
                <ul className="mt-3 space-y-2 text-sm text-cyan-50/90">
                  {project.features.map((feature) => (
                    <li key={feature} className="leading-relaxed">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </article>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
