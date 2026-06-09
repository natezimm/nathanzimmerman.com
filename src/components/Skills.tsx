import { skillGroups, type ViewMode } from "@/data/portfolioData";
import { maxSkillYears, parseSkillYears, skillFillFromYears } from "@/lib/skillMetrics";

type SkillsProps = {
  viewMode: ViewMode;
};

const Skills = ({ viewMode }: SkillsProps) => {
  return (
    <section id="skills" className="retro-section skills-zone py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="retro-heading text-center text-4xl text-violet-300 md:text-5xl">SKILLS & TECH</h2>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {skillGroups.map((group) => (
              <article
                key={group.label}
                className={
                  viewMode === "map"
                    ? "retro-skill-card rounded-sm border border-cyan-300/35 bg-slate-900/82 p-4"
                    : "retro-skill-card rounded-sm border border-cyan-300/30 bg-slate-950/72 p-4"
                }
              >
                <h3 className="retro-ui text-sm text-amber-200">{group.label}</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-100">{item.name}</span>
                        <span className="text-cyan-200">{item.years}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-slate-800">
                        <div
                          role="meter"
                          aria-label={`${item.name} experience`}
                          aria-valuemin={0}
                          aria-valuemax={maxSkillYears}
                          aria-valuenow={parseSkillYears(item.years)}
                          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"
                          style={{ width: `${skillFillFromYears(item.years)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
