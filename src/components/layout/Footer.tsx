import { ArrowUp, Github, Linkedin, FileText } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-500">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-slate-300 font-medium">Nathan Zimmerman</p>
            <p className="mt-1">
              Senior Software Engineer · Distributed Systems, C#/.NET, Angular &amp; Microservices.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/natezimm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/zimmermannathan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Resume PDF"
            >
              <FileText className="h-4 w-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 p-2 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500">
          <p>© {new Date().getFullYear()} Nathan Zimmerman. All rights reserved.</p>
          <p>Raritan, New Jersey · NYC Metro</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
