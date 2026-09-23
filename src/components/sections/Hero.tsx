import { ArrowDown, FileText, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>Enterprise Distributed Systems &amp; Financial Platforms</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.1]">
            Senior Software Engineer
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-teal-200">
            C# / .NET · Angular · Microservices · Payments &amp; Risk
          </p>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-300">
            7+ years building resilient production software across <strong>Nelnet</strong>, <strong>Amazon</strong>, and <strong>Radian Group</strong>. 
            Currently engineering payment plan workflows, billing microservices, and event-driven returned-payment systems using C#, .NET, Angular, TypeScript, MongoDB, and AWS.
          </p>

          {/* Verified Stack Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              'C# / .NET',
              'Angular',
              'TypeScript',
              'MongoDB',
              'AWS',
              'Azure',
              'Microservices',
              'REST APIs',
              'SQL',
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-slate-300 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-all shadow-lg shadow-cyan-500/20"
            >
              Explore Live Systems
              <ArrowDown className="h-4 w-4" />
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-slate-600 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors shadow-sm"
            >
              <FileText className="h-4 w-4 text-cyan-400" />
              Resume (PDF)
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-800 hover:bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition-colors"
            >
              <Mail className="h-4 w-4 text-slate-400" />
              Get in Touch
            </a>
          </div>
        </div>

        {/* Highlight Metrics Strip */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              Experience
            </div>
            <p className="mt-1.5 text-2xl font-bold text-slate-100">7+ Years</p>
            <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
              Enterprise full-stack engineering across finance, billing, and risk.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Cloud Reliability
            </div>
            <p className="mt-1.5 text-2xl font-bold text-slate-100">100+ Envs</p>
            <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
              Executed zero-downtime AWS EC2 host migrations across 10+ apps at Amazon.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
              Domain Focus
            </div>
            <p className="mt-1.5 text-2xl font-bold text-slate-100">Payments &amp; Billing</p>
            <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
              Payment calculators, event-driven returned payments, and sanctions screening.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
