import { experienceItems, type ViewMode } from '@/data/portfolioData';
import { Briefcase, Calendar, Building2, Sparkles, CheckCircle2 } from 'lucide-react';

type ExperienceProps = {
  viewMode?: ViewMode;
};

const Experience = ({ viewMode: _viewMode }: ExperienceProps) => {
  return (
    <section
      id="experience"
      className="py-16 md:py-20 relative overflow-hidden scroll-mt-4"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight">
              Work <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Software engineering roles across enterprise fintech, cloud systems, and high-scale platforms.
            </p>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Vertical timeline spine */}
            <div className="hidden md:block absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-sky-400/40 via-purple-500/30 to-transparent" />

            <div className="space-y-8">
              {experienceItems.map((item) => {
                const isCurrent = item.period.includes('Present');

                return (
                  <div
                    key={`${item.title}-${item.company}`}
                    className="relative md:pl-20 group"
                  >
                    {/* Timeline Node Icon (Desktop) */}
                    <div
                      className={`hidden md:flex absolute left-4 -translate-x-1/2 top-6 w-9 h-9 rounded-full items-center justify-center border transition-all duration-300 shadow-sm ${
                        isCurrent
                          ? 'border-emerald-500/50 dark:border-emerald-400/60 bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.35)]'
                          : 'border-slate-300 dark:border-white/20 bg-background text-muted-foreground group-hover:border-sky-500 dark:group-hover:border-sky-400/50 group-hover:text-sky-500 dark:group-hover:text-sky-400'
                      }`}
                    >
                      {isCurrent ? (
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                        </span>
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                    </div>

                    {/* Experience Card */}
                    <article className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 hover:border-sky-400/40 transition-all duration-300 card-glow shadow-sm">
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors font-heading">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-medium text-base mt-1">
                            <Building2 className="w-4 h-4" />
                            <span>{item.company}</span>
                          </div>
                        </div>

                        {/* Period Badge */}
                        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-slate-100/90 dark:bg-secondary/60 border border-slate-200/80 dark:border-white/10 px-3 py-1 text-xs font-medium text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                          <span>{item.period}</span>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-foreground/85 text-base leading-relaxed mb-6">
                        {item.summary}
                      </p>

                      {/* Tech Stack Tags */}
                      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/40">
                        <span className="text-xs font-semibold text-muted-foreground mr-1">
                          Stack:
                        </span>
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-slate-100/90 dark:bg-secondary/80 text-foreground/90 border border-slate-200/80 dark:border-white/10 transition-all duration-200 hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:bg-sky-500/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
