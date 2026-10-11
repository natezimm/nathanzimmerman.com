import { ArrowUp, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-background py-12">
      {/* Glowing top edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/60 dark:via-sky-400/60 to-transparent"
      />

      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="group flex items-center justify-center w-11 h-11 rounded-full border border-slate-300 dark:border-white/15 bg-slate-100/70 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:border-sky-500 dark:hover:border-sky-400/50 transition-all duration-300 shadow-sm"
          >
            <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nathan Zimmerman. Built with React &
            Tailwind. Thanks for stopping by.
          </p>

          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/natezimm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/zimmermannathan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
