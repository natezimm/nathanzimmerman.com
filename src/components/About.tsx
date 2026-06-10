import { type ViewMode } from '@/data/portfolioData';

type AboutProps = {
  viewMode: ViewMode;
};

const playerStats = [
  { label: 'Problem Solving', value: 92 },
  { label: 'Backend', value: 90 },
  { label: 'Frontend', value: 87 },
  { label: 'Databases', value: 80 },
  { label: 'Cloud & DevOps', value: 82 },
];

const About = ({ viewMode }: AboutProps) => {
  return (
    <section id="about" className="retro-section about-zone py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.1fr]">
          <article className="about-card rounded-sm border border-cyan-300/30 bg-slate-950/80 p-5">
            <h2 className="retro-heading text-2xl text-emerald-300 md:text-3xl">
              PLAYER PROFILE
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-200 md:text-base">
              Former special education teacher turned software engineer,
              bringing a people-first mindset to development. I build clean,
              intuitive applications and enjoy working across the stack to make
              things simple and useful for real people.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
              I first studied psychology to understand how people think, then
              got into programming to understand how computers think. Teaching
              preschoolers with special needs taught me patience, empathy, and
              how to break down complex ideas.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
              As a full-stack engineer, I&apos;ve worked with Angular, React,
              C#, .NET, Node, AWS, and Azure. I like moving between frontend and
              backend, whatever helps bring an idea to life.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-sm border border-slate-300/20 bg-slate-900/60 p-3">
                <p className="retro-ui text-xs text-violet-200">CLASS</p>
                <p className="mt-1 text-slate-50">Software Engineer II</p>
              </div>
              <div className="rounded-sm border border-slate-300/20 bg-slate-900/60 p-3">
                <p className="retro-ui text-xs text-violet-200">
                  CURRENT STACK
                </p>
                <p className="mt-1 text-slate-50">C# / .NET / Angular</p>
              </div>
            </div>
          </article>

          <article
            className={
              viewMode === 'map'
                ? 'about-card rounded-sm border border-emerald-300/28 bg-emerald-600/8 p-5'
                : 'about-card rounded-sm border border-cyan-300/28 bg-slate-900/70 p-5'
            }
          >
            <h3 className="retro-ui text-sm text-amber-200">PLAYER STATS</h3>
            <div className="mt-4 space-y-3">
              {playerStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between text-xs text-slate-200">
                    <span>{stat.label}</span>
                    <span>{stat.value}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-800/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-emerald-300"
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default About;
