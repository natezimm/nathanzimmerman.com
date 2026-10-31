import { careerOriginItems, experienceItems } from '@/data/portfolioData';
import { Calendar, Building2 } from 'lucide-react';
import { MotionConfig, motion } from 'framer-motion';
import { SpotlightGroup } from '@/components/ui/spotlight-group';
import { SectionCaption } from '@/components/shared/SectionCaption';
import { ScrollReveal } from '@/components/ScrollReveal';

// Vertical-only margin: the lane sits at the screen edge on phones.
const LANE_VIEWPORT = { once: true, margin: '-80px 0px' };
const LANE_EASE = [0.16, 1, 0.3, 1] as const;

const Experience = () => {
  const commitCount = experienceItems.length + careerOriginItems.length;

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
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight">
              Work <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Software engineering roles across enterprise fintech, cloud
              systems, and high-scale platforms.
            </p>
          </ScrollReveal>

          {/* Career Git Graph: --lane is the engineering branch, --origin the path before it */}
          <MotionConfig reducedMotion="user">
            <div className="relative [--lane:8px] md:[--lane:16px] [--origin:28px] md:[--origin:56px]">
              {/* Git Log Caption */}
              <ScrollReveal className="mb-6 pl-9 md:pl-20">
                <SectionCaption
                  command="git log --graph nathan/career"
                  meta={`${commitCount} commits · 1 branch switch`}
                />
              </ScrollReveal>

              {/* Engineering Branch */}
              <div className="relative">
                {/* Highlight climbing the lane toward HEAD */}
                <div
                  aria-hidden="true"
                  className="absolute z-10 top-[42px] bottom-0 left-[calc(var(--lane)_-_2px)] w-1 overflow-hidden rounded-full pointer-events-none"
                >
                  <div className="lane-comet h-full w-full" />
                </div>

                <SpotlightGroup className="space-y-8">
                  {experienceItems.map((item, index) => {
                    const isCurrent = item.period.includes('Present');
                    const isLast = index === experienceItems.length - 1;

                    return (
                      <div
                        key={`${item.title}-${item.company}`}
                        className="relative group"
                      >
                        {/* Lane Segment */}
                        <motion.span
                          aria-hidden="true"
                          data-testid="career-lane"
                          className={`absolute left-[calc(var(--lane)_-_1px)] w-0.5 origin-top bg-gradient-to-b from-sky-400 to-cyan-400 ${
                            index === 0 ? 'top-[42px]' : 'top-0'
                          } ${isLast ? 'bottom-0' : '-bottom-8'}`}
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={LANE_VIEWPORT}
                          transition={{ duration: 0.9, ease: LANE_EASE }}
                        />

                        {/* Commit Node */}
                        <motion.span
                          aria-hidden="true"
                          className="absolute z-10 top-[42px] left-[var(--lane)] h-0 w-0"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={LANE_VIEWPORT}
                          transition={{
                            duration: 0.45,
                            ease: LANE_EASE,
                            delay: 0.2,
                          }}
                        >
                          {isCurrent ? (
                            <span className="absolute flex h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex h-[18px] w-[18px] rounded-full bg-emerald-400 border-[3px] border-emerald-100 shadow-[0_0_16px_rgba(52,211,153,0.8)]" />
                            </span>
                          ) : (
                            <span className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background border-[3px] border-sky-500 dark:border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-transform duration-300 group-hover:scale-125" />
                          )}
                        </motion.span>

                        <ScrollReveal className="pl-9 md:pl-20" delay={0.1}>
                          {/* Experience Card */}
                          <article className="spotlight-card glass-card rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 hover:border-sky-400/40 transition-all duration-300 card-glow shadow-sm">
                            {isCurrent && (
                              <span className="absolute -top-3 left-6 sm:left-8 inline-flex items-center rounded-full border border-emerald-500/50 dark:border-emerald-400/45 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                                HEAD → main
                              </span>
                            )}

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
                        </ScrollReveal>
                      </div>
                    );
                  })}
                </SpotlightGroup>
              </div>

              {/* Branch Point: engineering forked from the path before it */}
              <div className="relative pb-8">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 40 64"
                  preserveAspectRatio="none"
                  fill="none"
                  className="absolute top-0 left-[calc(var(--lane)_-_1px)] h-16 w-[calc(var(--origin)_-_var(--lane)_+_2px)] overflow-visible"
                >
                  <defs>
                    <linearGradient
                      id="career-branch-stroke"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0" stopColor="#22d3ee" />
                      <stop offset="1" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M1 0 C 1 36, 39 28, 39 64"
                    stroke="url(#career-branch-stroke)"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={LANE_VIEWPORT}
                    transition={{ duration: 0.7, ease: LANE_EASE }}
                  />
                </svg>

                <span
                  aria-hidden="true"
                  className="absolute top-5 left-14 md:left-20 font-mono text-[11px] text-muted-foreground"
                >
                  git checkout -b engineering
                </span>

                {/* Origin Lane */}
                <motion.span
                  aria-hidden="true"
                  className="absolute top-16 bottom-0 left-[calc(var(--origin)_-_1px)] w-0.5 origin-top bg-gradient-to-b from-violet-400 via-violet-400/70 to-transparent"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={LANE_VIEWPORT}
                  transition={{ duration: 0.9, ease: LANE_EASE, delay: 0.4 }}
                />

                <h3 className="sr-only">Before engineering</h3>
                <ul className="relative pt-[72px] space-y-6">
                  {careerOriginItems.map((item) => (
                    <li key={item.title} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute top-[5px] left-[calc(var(--origin)_-_7px)] h-3.5 w-3.5 rounded-full bg-background border-[3px] border-violet-500 dark:border-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.6)]"
                      />
                      <ScrollReveal className="pl-14 md:pl-20" delay={0.1}>
                        <p className="font-heading font-semibold text-base text-foreground">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.detail}
                        </p>
                      </ScrollReveal>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MotionConfig>
        </div>
      </div>
    </section>
  );
};

export default Experience;
