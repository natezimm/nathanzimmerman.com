import { Code2, Database, Rocket, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SpotlightGroup } from '@/components/ui/spotlight-group';
import { SectionCaption } from '@/components/shared/SectionCaption';
import { ScrollReveal } from '@/components/ScrollReveal';

const About = () => {
  const skills = [
    {
      icon: Code2,
      color:
        'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_24px_-6px_rgba(34,211,238,0.55)]',
      watermark: 'text-cyan-500',
      title: 'Full-Stack Development',
      description:
        'Building modern, responsive apps with Angular, React, and TypeScript. I enjoy creating smooth, fast experiences for users.',
    },
    {
      icon: Database,
      color:
        'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_24px_-6px_rgba(168,85,247,0.55)]',
      watermark: 'text-purple-500',
      title: 'Backend & Architecture',
      description:
        'Creating solid backend APIs and services with C#, Node, and Java. Comfortable working with both SQL and NoSQL databases.',
    },
    {
      icon: Rocket,
      color:
        'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20 shadow-[0_0_24px_-6px_rgba(56,189,248,0.55)]',
      watermark: 'text-sky-500',
      title: 'Cloud & DevOps',
      description:
        'Deploying apps to AWS and Azure, and keeping things running smoothly with CI/CD pipelines.',
    },
    {
      icon: Users,
      color:
        'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_24px_-6px_rgba(52,211,153,0.55)]',
      watermark: 'text-emerald-500',
      title: 'Team Collaboration',
      description:
        'Easy to work with and big on communication. My teaching background helps me explain things clearly and work well with any team.',
    },
  ];

  return (
    <section
      id="about"
      className="py-16 md:py-20 bg-secondary/30 relative overflow-hidden scroll-mt-4"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-purple-500/5 rounded-full blur-[140px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Former teacher turned software engineer who loves building useful
              things and learning something new every day.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-4">
            {/* Story column */}
            <ScrollReveal
              delay={0.1}
              className="space-y-6 text-lg leading-relaxed text-foreground/90"
            >
              <SectionCaption command="cat about.md" />
              <p>
                I first studied psychology to understand{' '}
                <strong className="font-semibold text-foreground">
                  how people think
                </strong>
                , then got into programming to understand{' '}
                <strong className="font-semibold text-foreground">
                  how computers think
                </strong>
                . Teaching preschoolers with special needs taught me patience,
                empathy, and how to break down complex ideas—skills I bring into
                the way I write code and build software.
              </p>
              <p>
                As a full‑stack engineer, I’ve worked with Angular, React, C#,
                .NET, Node, AWS, and more. I like bouncing between frontend and
                backend—whatever helps bring an idea to life.
              </p>
              <p>
                When I’m not coding, I’m probably watching Philly sports,
                playing guitar, or getting into a good fantasy book.
              </p>
            </ScrollReveal>

            {/* Core Capability Cards Grid */}
            <SpotlightGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <ScrollReveal key={skill.title} delay={0.2 + index * 0.1}>
                    <Card className="spotlight-card glass-card group overflow-hidden h-full rounded-2xl border border-slate-200/90 dark:border-white/10 hover:border-sky-500/40 dark:hover:border-sky-400/30 transition-all duration-300 card-glow shadow-sm">
                      {/* Oversized icon watermark */}
                      <Icon
                        aria-hidden="true"
                        className={`absolute -right-5 -bottom-5 w-28 h-28 opacity-[0.09] dark:opacity-[0.07] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6 ${skill.watermark}`}
                      />
                      <CardContent className="relative p-6">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-4 ${skill.color}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold mb-2 text-lg text-foreground font-heading">
                          {skill.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {skill.description}
                        </p>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </SpotlightGroup>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
