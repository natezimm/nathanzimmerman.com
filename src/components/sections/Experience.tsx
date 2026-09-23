import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

type ExperienceRecord = {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  scope: string;
  domain: string;
  achievements: string[];
  techStack: string[];
};

const EXPERIENCES: ExperienceRecord[] = [
  {
    id: 'nelnet',
    company: 'Nelnet',
    role: 'Software Engineer II',
    period: '10/2023 – Present',
    location: 'Remote · Higher Education SaaS',
    domain: 'Payments & Billing Platform Domain',
    scope:
      'Engineered core features for a multi-tenant payment plan and billing SaaS serving higher education institutions nationwide.',
    achievements: [
      'Engineered C#/.NET microservices with Angular frontend integration and MongoDB document persistence.',
      'Architected payment plan enrollment workflows supporting institutional business rules, down payments, disclosures, and schedules.',
      'Built a reusable payment schedule calculation engine packaged as a shared Angular/npm library, dynamically computing installments from down payments, cadence, and completion dates.',
      'Developed event-driven returned-payment handling that executes policy actions including installment rescheduling, failed-payment recovery, and runtime plan status derivation.',
      'Integrated banking, pricing, disclosure, and messaging microservices to support end-to-end payment plan lifecycles.',
    ],
    techStack: ['C#', '.NET', 'Angular', 'TypeScript', 'MongoDB', 'REST Microservices', 'Azure', 'AWS'],
  },
  {
    id: 'amazon',
    company: 'Amazon',
    role: 'Software Development Engineer',
    period: '05/2022 – 04/2023',
    location: 'Seattle, WA (Remote) · Risk & Security',
    domain: 'Financial Crime Risk & Platform Cutover',
    scope:
      'Built risk-guidance pipelines to screen third-party sellers against regulatory watchlists and anti-money laundering indicators.',
    achievements: [
      'Engineered high-throughput screening applications in Java, Scala, Spring, and AWS against denied-party sanctions lists.',
      'Executed zero-downtime EC2 host migrations across 10+ applications and 100+ environments in IAD/PDX availability zones.',
      'Remediated critical security vulnerabilities by enforcing KMS encryption across SQS/SNS/S3 and tightening IAM policies to least-privilege.',
      'Reduced operational support burden by resolving pipeline failures and monitoring production CloudWatch telemetry alarms.',
    ],
    techStack: ['Java', 'Scala', 'Spring', 'AWS (EC2, SQS, SNS, S3, KMS)', 'IAM', 'CloudWatch'],
  },
  {
    id: 'radian',
    company: 'Radian Group Inc.',
    role: 'Software Developer',
    period: '09/2019 – 04/2022',
    location: 'Philadelphia, PA · Real Estate & Valuation',
    domain: 'Valuation & Asset Management Applications',
    scope:
      'Delivered full-stack capabilities, maintenance, and query optimization for MyRadian, a valuation and asset management platform.',
    achievements: [
      'Delivered features across React, Node.js, and legacy C#/.NET and Java services, supporting production releases and code reviews.',
      'Automated recurring database reconciliation workflows with Python scripts, eliminating manual operations and enhancing data integrity.',
      'Diagnosed and resolved production issues using AWS CloudWatch, X-Ray, DynamoDB, and SQL.',
    ],
    techStack: ['Node.js', 'React', 'C# / .NET', 'Python', 'SQL', 'DynamoDB', 'AWS CloudWatch'],
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="py-16 md:py-24 border-b border-white/[0.08] bg-[#090A0D]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#E6A838] uppercase tracking-wider">
              <Briefcase className="h-4 w-4" />
              <span>02 // PRODUCTION TRACK RECORD &amp; HISTORY</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F2EE]">
              Engineering Dossier
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-400 max-w-md">
            Verified institutional track record spanning mission-critical payment workflows, high-throughput risk screening, and cloud infrastructure.
          </p>
        </div>

        {/* Experience Audit Ledger */}
        <div className="mt-12 space-y-10">
          {EXPERIENCES.map((exp, idx) => (
            <div
              key={exp.id}
              className="rounded-lg border border-white/[0.1] bg-[#0E1015] overflow-hidden shadow-xl"
            >
              {/* Header Bar */}
              <div className="border-b border-white/[0.08] bg-[#12151B] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start md:items-center gap-4">
                  <span className="font-mono text-xs font-bold text-[#E6A838] px-2.5 py-1 rounded bg-black/40 border border-white/[0.08]">
                    AUDIT_0{idx + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#F3F2EE] font-heading">
                        {exp.company}
                      </h3>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-[#00E599] border border-emerald-500/20">
                        {exp.role}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-zinc-400 mt-1">
                      {exp.domain}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{exp.period}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{exp.location}</span>
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-1.5">
                    Operational Scope:
                  </p>
                  <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans max-w-4xl">
                    {exp.scope}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-3">
                    Verified Technical Invariants &amp; Delivery:
                  </p>
                  <div className="space-y-2.5">
                    {exp.achievements.map((item, aIdx) => (
                      <div
                        key={aIdx}
                        className="flex items-start gap-3 rounded border border-white/[0.04] bg-black/20 p-3 text-xs sm:text-sm text-zinc-300 font-sans"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#E6A838] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stack Footer */}
                <div className="border-t border-white/[0.06] pt-4 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider mr-2">
                    Verified Tech:
                  </span>
                  {exp.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
