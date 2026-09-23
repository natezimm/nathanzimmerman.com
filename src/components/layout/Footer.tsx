import { ArrowUp, Github, Linkedin, FileText } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#07080A] py-12 font-mono text-xs text-zinc-500">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-zinc-200 font-bold font-heading text-sm">
              NATHAN ZIMMERMAN
            </p>
            <p className="mt-1 text-zinc-400">
              Senior Software Engineer · Distributed Systems, C#/.NET, Angular &amp; Payments Architecture.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/natezimm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[#E6A838] transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/zimmermannathan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[#E6A838] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[#E6A838] transition-colors"
              aria-label="Resume PDF"
            >
              <FileText className="h-4 w-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="rounded border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2 text-zinc-500 text-[11px]">
          <p>© {new Date().getFullYear()} Nathan Zimmerman. Architectural Engineering Portfolio.</p>
          <p>Raritan, NJ · NYC Metro Area</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
