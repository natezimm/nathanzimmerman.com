import { skillGroups, type ViewMode } from '@/data/portfolioData';
import {
  maxSkillYears,
  parseSkillYears,
  skillFillFromYears,
} from '@/lib/skillMetrics';
import { Code2, Layers, Database, Cpu, Wrench } from 'lucide-react';

type SkillsProps = {
  viewMode?: ViewMode;
};

const getCategoryIcon = (label: string) => {
  switch (label.toUpperCase()) {
    case 'LANGUAGES':
      return <Code2 className="w-4 h-4 text-cyan-400" />;
    case 'FRAMEWORKS':
      return <Layers className="w-4 h-4 text-purple-400" />;
    case 'DATABASES':
      return <Database className="w-4 h-4 text-emerald-400" />;
    case 'TOOLS & OTHER':
    default:
      return <Cpu className="w-4 h-4 text-amber-400" />;
  }
};

const Skills = ({ viewMode: _viewMode }: SkillsProps) => {
  return (
    <section id="skills" className="py-16 md:py-20 relative overflow-hidden scroll-mt-4 bg-secondary/20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-4">
              <Wrench className="w-3.5 h-3.5 text-sky-400" />
              <span>Core Competencies</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight">
              Skills & <span className="gradient-text">Tech</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Core technologies, frameworks, and cloud services I build with daily.
            </p>
          </div>

          {/* 4-column Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {skillGroups.map((group) => (
              <article
                key={group.label}
                className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col justify-between card-glow hover:border-sky-400/30 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border/40">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      {getCategoryIcon(group.label)}
                    </div>
                    <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase font-heading">
                      {group.label}
                    </h3>
                  </div>

                  <ul className="space-y-4">
                    {group.items.map((item) => (
                      <li key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground/90">{item.name}</span>
                          <span className="text-muted-foreground font-mono text-[11px]">{item.years}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-secondary/80 overflow-hidden">
                          <div
                            role="meter"
                            aria-label={`${item.name} experience`}
                            aria-valuemin={0}
                            aria-valuemax={maxSkillYears}
                            aria-valuenow={parseSkillYears(item.years)}
                            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 transition-all duration-500"
                            style={{
                              width: `${skillFillFromYears(item.years)}%`,
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
