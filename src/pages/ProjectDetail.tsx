import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FileText,
  Github,
} from 'lucide-react';
import { projectBySlug, projectEntries } from '@/data/portfolioData';
import { trackPortfolioEvent } from '@/lib/analytics';
import { projectHead, usePageHead } from '@/lib/pageHead';
import { Button } from '@/components/ui/button';
import { SectionCaption } from '@/components/shared/SectionCaption';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import NotFound from './NotFound';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const outlineButton =
  'rounded-lg border-slate-300 dark:border-white/15 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-foreground hover:border-sky-500 dark:hover:border-sky-400/50';

const ProjectDetail = () => {
  const { slug = '' } = useParams();
  const project = projectBySlug(slug);
  const [autoPlay] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);
  usePageHead(project && projectHead(project));

  if (!project) {
    return <NotFound />;
  }

  const index = projectEntries.indexOf(project);
  const next = projectEntries[(index + 1) % projectEntries.length];

  const track = (
    name: 'project_live_click' | 'project_code_click' | 'project_details_click'
  ) =>
    trackPortfolioEvent(name, {
      project: project.slug,
      source: 'project_detail',
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to={{ pathname: '/', hash: '#projects' }}
            className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-10 md:py-14">
        <article className="mx-auto max-w-5xl">
          <SectionCaption
            command={`cat ~/projects/${project.slug}/README.md`}
            meta={project.kind}
            className="mb-4"
          />
          <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
            {project.title}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
            {project.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('project_live_click')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {project.kind === 'Playable' ? 'Play it' : 'Try the demo'}
              </a>
            </Button>
            <Button variant="outline" className={outlineButton} asChild>
              <a
                href={project.links.code}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('project_code_click')}
              >
                <Github className="h-4 w-4 mr-2" />
                Code
              </a>
            </Button>
            <Button variant="outline" className={outlineButton} asChild>
              <a
                href={project.links.architecture}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('project_details_click')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Architecture docs
              </a>
            </Button>
          </div>

          <figure className="mt-8 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-950 shadow-sm">
            <video
              src={project.video}
              poster={project.media.webp}
              muted
              loop
              playsInline
              controls
              autoPlay={autoPlay}
              preload={autoPlay ? 'auto' : 'none'}
              aria-label={`Screen recording of ${project.title}`}
              className="w-full aspect-[16/8.6] object-cover object-top"
            />
          </figure>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-10">
              <section aria-labelledby="problem">
                <h2
                  id="problem"
                  className="text-2xl font-semibold font-heading mb-3"
                >
                  The problem
                </h2>
                <p className="text-foreground/85 leading-relaxed">
                  {project.problem}
                </p>
              </section>

              <section aria-labelledby="highlights">
                <h2
                  id="highlights"
                  className="text-2xl font-semibold font-heading mb-4"
                >
                  Engineering highlights
                </h2>
                <ul className="space-y-5">
                  {project.highlights.map((highlight) => (
                    <li
                      key={highlight.title}
                      className="border-l-2 border-sky-500/60 pl-4"
                    >
                      <h3 className="font-semibold">{highlight.title}</h3>
                      <p className="mt-1 text-sm text-foreground/80 leading-relaxed">
                        {highlight.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="space-y-6">
              <section
                aria-labelledby="features"
                className="glass-card rounded-2xl border border-slate-200/90 dark:border-white/10 p-5"
              >
                <h2 id="features" className="font-semibold font-heading mb-3">
                  What it does
                </h2>
                <ul className="space-y-2 text-sm text-foreground/85 list-disc pl-5 marker:text-sky-500">
                  {project.features.map((feature) => (
                    <li key={feature} className="leading-relaxed">
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>

              <section
                aria-labelledby="stack"
                className="glass-card rounded-2xl border border-slate-200/90 dark:border-white/10 p-5"
              >
                <h2 id="stack" className="font-semibold font-heading mb-3">
                  Tech stack
                </h2>
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <li
                      key={item}
                      className="px-2.5 py-0.5 text-xs font-medium bg-slate-100/90 dark:bg-secondary/80 border border-slate-200/80 dark:border-white/10 rounded-md"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>

          <section aria-labelledby="architecture" className="mt-12">
            <h2
              id="architecture"
              className="text-2xl font-semibold font-heading mb-4"
            >
              Architecture
            </h2>
            <figure className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white p-4 md:p-6 overflow-x-auto">
              <img
                src={project.diagram}
                alt={project.diagramAlt}
                loading="lazy"
                className="mx-auto w-full min-w-[640px] max-w-4xl h-auto"
              />
            </figure>
            <p className="mt-3 text-sm text-muted-foreground">
              The context, runtime sequence and delivery diagrams are in{' '}
              <a
                href={project.links.architecture}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-4"
                onClick={() => track('project_details_click')}
              >
                docs/architecture.md
              </a>
              .
            </p>
          </section>

          <nav
            aria-label="More projects"
            className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6"
          >
            <Link
              to={{ pathname: '/', hash: '#projects' }}
              className="inline-flex items-center gap-2 min-h-[44px] text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              All projects
            </Link>
            <Link
              to={`/projects/${next.slug}/`}
              className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              Next: {next.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
