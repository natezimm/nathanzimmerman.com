import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

type ExperienceRecord = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
  techStack: string[];
};

const EXPERIENCES: ExperienceRecord[] = [
  {
    company: 'Nelnet',
    role: 'Software Engineer II',
    period: '10/2023 – Present',
    location: 'Remote / Educational Technologies',
    summary:
      'Engineered core capabilities within a greenfield Payment Plans & Billing domain for a multi-tenant SaaS platform serving higher education institutions.',
    achievements: [
      'Built distributed microservices in C#/.NET integrated with Angular frontends and MongoDB.',
      'Designed payment plan offering and enrollment workflows across admin and payer-facing apps, supporting plan rules, schedules, and disclosures.',
      'Developed a reusable payment schedule calculator packaged as a shared Angular/npm library, generating installment schedules from down payments, cadence, and fees.',
      'Built event-driven returned-payment handling that applied return policy actions including installment rescheduling, failed-payment handling, and runtime plan status derivation.',
      'Integrated payment, banking, disclosure, pricing, and messaging services to support lifecycle updates.',
    ],
    techStack: ['C#', '.NET', 'Angular', 'TypeScript', 'MongoDB', 'REST Microservices', 'Azure', 'AWS'],
  },
  {
    company: 'Amazon',
    role: 'Software Development Engineer',
    period: '05/2022 – 04/2023',
    location: 'Risk Guidance & Platform Reliability',
    summary:
      'Engineered seller risk-guidance applications to screen third-party sellers against denied-party sanctions lists and financial crime indicators.',
    achievements: [
      'Engineered screening pipelines using Java, Scala, Spring, and AWS against money-laundering signals and regulatory denied-party lists.',
      'Executed zero-downtime EC2 host migrations across 10+ applications and 100+ environments across IAD and PDX availability zones.',
      'Remediated critical security vulnerabilities by enabling KMS encryption across SQS/SNS/S3 and enforcing least-privilege IAM policies.',
      'Reduced operational support load by diagnosing high-throughput pipeline failures and monitoring CloudWatch alarms.',
    ],
    techStack: ['Java', 'Scala', 'Spring', 'AWS (EC2, SQS, SNS, S3, KMS)', 'IAM', 'CloudWatch'],
  },
  {
    company: 'Radian Group Inc.',
    role: 'Software Developer',
    period: '09/2019 – 04/2022',
    location: 'Valuation & Asset Management',
    summary:
      'Contributed to the launch, maintenance, and performance optimization of MyRadian, a React and Node.js suite for real estate valuation and asset management.',
    achievements: [
      'Delivered full-stack features, code reviews, and bug fixes across modern Node.js and legacy C#/.NET and Java services.',
      'Automated database reconciliation workflows with Python scripts, eliminating recurring manual operations and increasing data accuracy.',
      'Troubleshot production issues and optimized query performance using AWS CloudWatch, X-Ray, DynamoDB, and SQL.',
    ],
    techStack: ['Node.js', 'React', 'C# / .NET', 'Python', 'SQL', 'DynamoDB', 'AWS CloudWatch'],
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Career Track Record
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
            Production Engineering Experience
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            7+ years delivering mission-critical financial systems, payment infrastructure, 
            and zero-downtime cloud migrations.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.company}
              className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6 sm:p-8 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl sm:text-2xl font-bold text-slate-100">{exp.company}</span>
                    <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                      {exp.role}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{exp.summary}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 sm:text-right shrink-0">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Bullet points */}
              <div className="mt-5 space-y-2.5">
                {exp.achievements.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Tech stack badges */}
              <div className="mt-6 pt-4 border-t border-slate-800/70 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
                  Stack:
                </span>
                {exp.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-slate-800 bg-slate-950 px-2.5 py-0.5 text-xs text-slate-300 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
