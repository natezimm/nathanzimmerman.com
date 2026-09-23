import { Wrench, Terminal, Cpu, Database, Cloud, Cog } from 'lucide-react';

const SPEC_SECTIONS = [
  {
    code: 'SPEC_01',
    title: 'Core Languages',
    icon: Terminal,
    color: 'text-[#E6A838]',
    items: [
      { name: 'C#', metric: '3+ Years', context: 'Production Microservices & Web APIs' },
      { name: 'TypeScript', metric: '3+ Years', context: 'Multi-Tenant Angular Architecture' },
      { name: 'JavaScript', metric: '6+ Years', context: 'Modern ES6+, Node.js & React SPAs' },
      { name: 'Java', metric: '3+ Years', context: 'Enterprise Spring Boot Services' },
      { name: 'SQL', metric: '3+ Years', context: 'Relational Modeling & Performance Tuning' },
      { name: 'Python', metric: 'Production', context: 'Database Reconciliation Automation' },
      { name: 'Scala', metric: 'Production', context: 'Amazon Seller Risk Screening Pipeline' },
    ],
  },
  {
    code: 'SPEC_02',
    title: 'Frameworks & Runtimes',
    icon: Cpu,
    color: 'text-[#00E599]',
    items: [
      { name: 'ASP.NET Core / .NET', metric: 'Current', context: 'Greenfield Web APIs & Service Endpoints' },
      { name: 'Angular (TypeScript)', metric: 'Current', context: 'Shared NPM Calculation Packages & Portals' },
      { name: 'React', metric: 'Production', context: 'Component Architecture & Responsive UIs' },
      { name: 'Node.js / Express', metric: 'Production', context: 'Server-Side Validation & Service APIs' },
      { name: 'Spring Boot', metric: 'Production', context: 'Session Security & Rules Enforcement' },
    ],
  },
  {
    code: 'SPEC_03',
    title: 'Cloud & Infrastructure',
    icon: Cloud,
    color: 'text-cyan-400',
    items: [
      { name: 'AWS (EC2, SQS, SNS)', metric: '6+ Years', context: '100+ Environment Host Migrations' },
      { name: 'AWS Security (KMS, IAM)', metric: 'Hardened', context: 'At-Rest Encryption & Least-Privilege' },
      { name: 'CloudWatch & X-Ray', metric: 'Observability', context: 'Automated Alarm Telemetry & Tracing' },
      { name: 'Azure Cloud', metric: '3+ Years', context: 'Enterprise SaaS Cloud Integrations' },
      { name: 'Linux / Nginx', metric: 'Production', context: 'Reverse Proxy & VM Service Hosting' },
    ],
  },
  {
    code: 'SPEC_04',
    title: 'Data & Persistence',
    icon: Database,
    color: 'text-amber-400',
    items: [
      { name: 'MongoDB', metric: '3+ Years', context: 'Document Storage & Aggregation Pipelines' },
      { name: 'DynamoDB', metric: '3+ Years', context: 'Low-Latency Key-Value Storage at Scale' },
      { name: 'SQL Server', metric: 'Production', context: 'Relational Data Stores & Stored Procedures' },
      { name: 'AWS S3', metric: 'Encrypted', context: 'Document Asset Storage & Lifecycle Policies' },
    ],
  },
  {
    code: 'SPEC_05',
    title: 'Architecture & Invariants',
    icon: Cog,
    color: 'text-rose-400',
    items: [
      { name: 'Microservices', metric: 'Distributed', context: 'Domain-Driven Decoupled Services' },
      { name: 'Event-Driven Systems', metric: 'Resilient', context: 'Returned-Payment Handling & Rescheduling' },
      { name: 'REST API Design', metric: 'Contract-First', context: 'Predictable, Versioned Endpoints' },
      { name: 'CI/CD Pipelines', metric: 'Automated', context: 'Automated Build, Lint, and Test Gates' },
    ],
  },
];

export const Skills = () => {
  return (
    <section id="specification" className="py-16 md:py-24 border-b border-white/[0.08] bg-[#0A0C0F]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#E6A838] uppercase tracking-wider">
              <Wrench className="h-4 w-4" />
              <span>03 // HARDWARE &amp; SOFTWARE SPECIFICATION</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F2EE]">
              Technical Specification Matrix
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-400 max-w-md">
            Verified technical competencies backed by production deployments across institutional banking, retail risk, and mortgage fintech.
          </p>
        </div>

        {/* Technical Data Sheet Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPEC_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.code}
                className="rounded-lg border border-white/[0.1] bg-[#0E1015] p-6 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${section.color}`} />
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F3F2EE]">
                        {section.title}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {section.code}
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    {section.items.map((item) => (
                      <div
                        key={item.name}
                        className="rounded border border-white/[0.04] bg-white/[0.02] p-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#F3F2EE] font-sans text-xs">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-[#E6A838] font-mono px-1.5 py-0.5 rounded bg-black/40">
                            {item.metric}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-400 font-sans leading-tight">
                          {item.context}
                        </p>
                      </div>
                    ))}
                  </div>
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
