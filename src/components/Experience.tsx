import { experienceItems, type ViewMode } from '@/data/portfolioData';

type ExperienceProps = {
  viewMode: ViewMode;
};

const Experience = ({ viewMode }: ExperienceProps) => {
  return (
    <section
      id="experience"
      className="retro-section experience-zone py-16 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="retro-heading text-center text-4xl text-violet-300 md:text-5xl">
            EXPERIENCE
          </h2>

          <div
            className={
              viewMode === 'map'
                ? 'experience-board mt-8 rounded-md border border-amber-900/40 bg-amber-50/90 p-5 text-slate-900 md:p-8'
                : 'experience-board mt-8 rounded-md border border-cyan-300/28 bg-slate-950/75 p-5 text-slate-100 md:p-8'
            }
          >
            <div className="space-y-6">
              {experienceItems.map((item) => (
                <article
                  key={`${item.title}-${item.company}`}
                  className={
                    viewMode === 'map'
                      ? 'rounded-sm border border-amber-950/30 bg-amber-100/65 p-4'
                      : 'rounded-sm border border-cyan-300/18 bg-slate-900/75 p-4'
                  }
                >
                  <div>
                    <p
                      className={
                        viewMode === 'map'
                          ? 'retro-ui text-xs text-emerald-800'
                          : 'retro-ui text-xs text-emerald-300'
                      }
                    >
                      {item.period}
                    </p>
                    <h3
                      className={
                        viewMode === 'map'
                          ? 'retro-ui mt-1 text-lg text-violet-800'
                          : 'retro-ui mt-1 text-lg text-cyan-100'
                      }
                    >
                      {item.title}
                    </h3>
                    <p
                      className={
                        viewMode === 'map'
                          ? 'text-sm font-semibold text-slate-800'
                          : 'text-sm font-semibold text-slate-300'
                      }
                    >
                      {item.company}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={
                          viewMode === 'map'
                            ? 'retro-ui rounded-sm border border-violet-400/40 bg-violet-500/10 px-2 py-1 text-[11px] text-violet-700'
                            : 'retro-ui rounded-sm border border-cyan-300/35 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-100'
                        }
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p
                    className={
                      viewMode === 'map'
                        ? 'mt-3 text-sm leading-relaxed text-slate-800'
                        : 'mt-3 text-sm leading-relaxed text-slate-200'
                    }
                  >
                    {item.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
