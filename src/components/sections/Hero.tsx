import { ArrowDown, FileText, Mail, Terminal, ArrowUpRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-white/[0.08]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-12 items-start">
          {/* Left Column: Monolithic Typographic Statement */}
          <div>
            {/* System Coordinate Tag */}
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#E6A838] tracking-widest uppercase mb-6 bg-white/[0.03] border border-white/[0.08] px-3 py-1 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E6A838]" />
              <span>SYS_CORE // SENIOR SOFTWARE ENGINEER // NYC METRO</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F3F2EE] leading-[1.08]">
              High-Integrity Distributed Systems &amp; Transaction Platforms.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl font-sans">
              7+ years building production software across <strong>Nelnet</strong>, <strong>Amazon</strong>, and <strong>Radian Group</strong>. 
              Currently engineering greenfield multi-tenant payment plan workflows, billing microservices, and event-driven returned-payment state machines using 
              C#, .NET, Angular, TypeScript, MongoDB, and AWS.
            </p>

            {/* Verified Stack Chips */}
            <div className="mt-8">
              <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 mb-2.5">
                Verified Production Stack:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'C#',
                  '.NET Core',
                  'Angular',
                  'TypeScript',
                  'MongoDB',
                  'AWS',
                  'Azure',
                  'Microservices',
                  'SQL',
                  'REST APIs',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-xs px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:border-[#E6A838]/60 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <a
                href="#systems"
                className="inline-flex items-center gap-2 rounded bg-[#E6A838] hover:bg-[#f3b544] text-black px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <span>Inspect Systems</span>
                <ArrowDown className="h-4 w-4" />
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-white/[0.15] bg-white/[0.03] hover:bg-white/[0.08] px-5 py-3 font-mono text-xs font-medium text-[#F3F2EE] transition-colors"
              >
                <FileText className="h-4 w-4 text-[#E6A838]" />
                <span>Resume (PDF)</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </a>

              <a
                href="#dispatch"
                className="inline-flex items-center gap-2 rounded border border-white/[0.08] hover:border-white/[0.2] px-5 py-3 font-mono text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Dispatch</span>
              </a>
            </div>
          </div>

          {/* Right Column: Architectural Telemetry Ledger */}
          <div className="rounded-lg border border-white/[0.1] bg-[#0E1015] p-6 lg:p-7 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-300">
                <Terminal className="h-4 w-4 text-[#E6A838]" />
                <span>TELEMETRY &amp; AUDIT LEDGER</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                VERIFIED_DATA
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Row 1 */}
              <div className="border border-white/[0.06] bg-black/30 rounded p-3.5">
                <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                  <span>01 // CURRENT FOCUS</span>
                  <span className="text-[#00E599]">ACTIVE</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-[#F3F2EE] font-sans">
                  Nelnet: Multi-Tenant Billing Platform
                </p>
                <p className="mt-1 text-zinc-400 text-xs font-sans leading-relaxed">
                  C#/.NET microservices, Angular schedule calculation engine, and event-driven returned-payment rescheduling.
                </p>
              </div>

              {/* Row 2 */}
              <div className="border border-white/[0.06] bg-black/30 rounded p-3.5">
                <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                  <span>02 // HIGH-RELIABILITY CUTOVER</span>
                  <span className="text-[#E6A838]">100+ ENVS</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-[#F3F2EE] font-sans">
                  Amazon: Zero-Downtime AWS Migrations
                </p>
                <p className="mt-1 text-zinc-400 text-xs font-sans leading-relaxed">
                  Executed host migrations across 10+ applications in IAD/PDX availability zones with real-time CloudWatch alarm telemetry.
                </p>
              </div>

              {/* Row 3 */}
              <div className="border border-white/[0.06] bg-black/30 rounded p-3.5">
                <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                  <span>03 // RISK COMPLIANCE</span>
                  <span className="text-cyan-400">SANCTIONS / AML</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-[#F3F2EE] font-sans">
                  Financial Crime Risk Screening
                </p>
                <p className="mt-1 text-zinc-400 text-xs font-sans leading-relaxed">
                  Screened high-throughput seller traffic against denied-party regulatory watchlists and anti-money laundering signals.
                </p>
              </div>

              {/* Quick stats footer */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-center text-[11px]">
                <div className="border border-white/[0.08] bg-white/[0.02] p-2.5 rounded">
                  <span className="text-zinc-500 block text-[10px]">TOTAL EXP</span>
                  <span className="text-[#F3F2EE] font-bold text-base">7+ YEARS</span>
                </div>
                <div className="border border-white/[0.08] bg-white/[0.02] p-2.5 rounded">
                  <span className="text-zinc-500 block text-[10px]">LOCATION</span>
                  <span className="text-[#F3F2EE] font-bold text-base">NYC METRO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
