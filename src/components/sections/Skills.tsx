import { Code, Layers, Database, Cloud, Cog } from 'lucide-react';

const SKILL_CATEGORIES = [
  {
    title: 'Languages',
    icon: Code,
    color: 'text-cyan-400',
    skills: [
      { name: 'C#', level: 'Production (3+ yrs)' },
      { name: 'TypeScript', level: 'Production (3+ yrs)' },
      { name: 'JavaScript', level: 'Production (6+ yrs)' },
      { name: 'Java', level: 'Production (3+ yrs)' },
      { name: 'SQL', level: 'Production (3+ yrs)' },
      { name: 'Python', level: 'Automation & Scripting' },
      { name: 'Scala', level: 'Risk Pipelines at Amazon' },
    ],
  },
  {
    title: 'Frameworks & Frontend',
    icon: Layers,
    color: 'text-emerald-400',
    skills: [
      { name: '.NET / ASP.NET Core', level: 'Web APIs & Microservices' },
      { name: 'Angular', level: 'Multi-Tenant SaaS Portals' },
      { name: 'React', level: 'Web UI & State Management' },
      { name: 'Node.js / Express', level: 'REST APIs & Tooling' },
      { name: 'Spring Boot', level: 'Enterprise Services & Security' },
    ],
  },
  {
    title: 'Databases & Storage',
    icon: Database,
    color: 'text-amber-400',
    skills: [
      { name: 'MongoDB', level: 'Document Models & Aggregations' },
      { name: 'DynamoDB', level: 'Key-Value NoSQL at Scale' },
      { name: 'SQL Server', level: 'Relational Schemas & Queries' },
      { name: 'AWS S3', level: 'Object Storage & KMS Encryption' },
    ],
  },
  {
    title: 'Cloud & Infrastructure',
    icon: Cloud,
    color: 'text-violet-400',
    skills: [
      { name: 'AWS (EC2, SQS, SNS, KMS)', level: 'Zero-Downtime Migrations' },
      { name: 'CloudWatch & X-Ray', level: 'Observability & Alarm Routing' },
      { name: 'Azure', level: 'Cloud Services & Integration' },
      { name: 'Linux / VM Hosting', level: 'GCP, Nginx Reverse Proxy' },
    ],
  },
  {
    title: 'Architecture & Practices',
    icon: Cog,
    color: 'text-rose-400',
    skills: [
      { name: 'Microservices Architecture', level: 'Decoupled Service Domains' },
      { name: 'Event-Driven Systems', level: 'Returned-Payment Rescheduling' },
      { name: 'REST API Design', level: 'Contract-First & Swagger/OpenAPI' },
      { name: 'CI/CD & Git Workflows', level: 'Automated Build & Test Gates' },
    ],
  },
];

export const Skills = () => {
  return (
    <section id="skills" className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950/60">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Technical Competencies
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
            Verified Skills &amp; Technology Stack
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            Technologies and tools with proven production delivery across Nelnet, Amazon, and Radian Group.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILL_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="rounded-xl border border-slate-800/90 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                  <Icon className={`h-5 w-5 ${cat.color}`} />
                  <h3 className="text-base font-bold text-slate-100">{cat.title}</h3>
                </div>

                <div className="mt-4 space-y-3">
                  {cat.skills.map((skill) => (
                    <div key={skill.name} className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-slate-200">{skill.name}</span>
                      <span className="text-xs text-slate-400 text-right shrink-0">{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
