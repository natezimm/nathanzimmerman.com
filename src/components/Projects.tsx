import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpotlightGroup } from '@/components/ui/spotlight-group';
import { SectionCaption } from '@/components/shared/SectionCaption';
import { ProjectImage } from '@/components/shared/ProjectImage';
import { ScrollReveal } from '@/components/ScrollReveal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  earlierProjects,
  projectEntries,
  type ProjectEntry,
} from '@/data/portfolioData';
import { trackPortfolioEvent } from '@/lib/analytics';

const CARD_IMAGE_SIZES =
  '(max-width: 768px) calc(100vw - 2rem), (max-width: 1280px) calc(50vw - 3rem), 600px';

const tagClassName =
  'px-2.5 py-0.5 text-xs font-medium bg-slate-100/90 dark:bg-secondary/80 text-foreground/90 border border-slate-200/80 dark:border-white/10 rounded-md';

/** Hover previews are for mouse users who have not asked for less motion. */
const canPreviewVideo = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ProjectCard = ({ project }: { project: ProjectEntry }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [previewing, setPreviewing] = useState(false);

  const startPreview = () => {
    const video = videoRef.current;
    if (!video || !canPreviewVideo()) return;
    setPreviewing(true);
    // The browser may refuse to play; the screenshot stays visible then.
    video.play()?.catch(() => setPreviewing(false));
  };

  const stopPreview = () => {
    const video = videoRef.current;
    setPreviewing(false);
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  const caseStudy = `/projects/${project.slug}/`;

  return (
    <Card
      className="spotlight-card glass-card overflow-hidden group border border-slate-200/90 dark:border-white/10 rounded-2xl flex flex-col justify-between card-glow hover:border-sky-500/40 dark:hover:border-sky-400/30 transition-all duration-300 shadow-sm h-full"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      <div>
        <div className="relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 aspect-[16/9] w-full bg-slate-900">
          <ProjectImage
            project={project}
            className="w-full h-full"
            imgClassName="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            sizes={CARD_IMAGE_SIZES}
            width={600}
            height={338}
          />
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 ${
              previewing ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {project.kind}
          </div>

          {/* Mouse shortcut to the project page; the title link is the accessible one */}
          <Link
            to={caseStudy}
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0"
          />
        </div>

        <CardHeader className="pt-6 pb-2">
          <CardTitle className="text-2xl font-bold font-heading">
            <Link
              to={caseStudy}
              className="group-hover:text-primary transition-colors duration-300 focus-visible:outline-none focus-visible:underline"
            >
              {project.title}
            </Link>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-foreground/80 leading-relaxed mt-1">
            {project.summary}
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="pt-4 pb-6 space-y-4">
        <ul
          className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40"
          aria-label={`${project.title} tech stack`}
        >
          {project.stack.map((tag) => (
            <li key={tag} className={tagClassName}>
              {tag}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <Link
            to={caseStudy}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
            aria-label={`${project.title} details`}
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-slate-300 dark:border-white/15 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-foreground hover:border-sky-500 dark:hover:border-sky-400/50 transition-all text-xs font-medium shadow-sm"
              asChild
            >
              <a
                href={project.links.code}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} code on GitHub`}
                onClick={() =>
                  trackPortfolioEvent('project_code_click', {
                    project: project.slug,
                    source: 'project_card',
                  })
                }
              >
                <Github className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                Code
              </a>
            </Button>
            <Button
              size="sm"
              className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20 hover:shadow-primary/40 text-xs font-medium"
              asChild
            >
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                onClick={() =>
                  trackPortfolioEvent('project_live_click', {
                    project: project.slug,
                    source: 'project_card',
                  })
                }
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Live Demo
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Projects = () => (
  <section
    id="projects"
    className="py-16 md:py-20 relative overflow-hidden scroll-mt-4"
  >
    {/* Background decoration */}
    <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
    <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

    <div className="container px-4 sm:px-6 mx-auto relative z-10">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Full-stack apps I designed, built, tested and run in production,
            each with a live demo you can try right now.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mb-6">
          <SectionCaption
            command="ls ~/projects"
            meta={`${projectEntries.length} projects · all live`}
          />
        </ScrollReveal>

        <SpotlightGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectEntries.map((project, index) => (
            <ScrollReveal key={project.slug} delay={0.1 + index * 0.1}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </SpotlightGroup>

        <ScrollReveal className="mt-16">
          <h3 className="text-xl font-semibold font-heading mb-1">
            Earlier projects
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            Retired games from when I was learning new stacks. Their demos are
            offline, but the code and a recording are on GitHub.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {earlierProjects.map((project) => (
              <li
                key={project.title}
                className="glass-card rounded-xl border border-slate-200/90 dark:border-white/10 p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold">{project.title}</h4>
                  <a
                    href={project.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} code on GitHub`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors min-h-[44px] -my-3"
                  >
                    <Github className="w-3.5 h-3.5" />
                    Code
                  </a>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {project.summary}
                </p>
                <p className="mt-auto font-mono text-xs text-muted-foreground">
                  {project.stack.join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default Projects;
