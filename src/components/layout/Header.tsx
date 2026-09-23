import { useState } from 'react';
import { Search, FileText, Menu, X } from 'lucide-react';

type HeaderProps = {
  onOpenCommandPalette: () => void;
};

export const Header = ({ onOpenCommandPalette }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Live Role Status */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-base font-bold tracking-tight text-slate-100 hover:text-cyan-400 transition-colors"
          >
            Nathan Zimmerman
          </a>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Nelnet · Software Engineer II</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#projects" className="hover:text-cyan-300 transition-colors">
            Projects
          </a>
          <a href="#experience" className="hover:text-cyan-300 transition-colors">
            Experience
          </a>
          <a href="#skills" className="hover:text-cyan-300 transition-colors">
            Skills
          </a>
          <a href="#contact" className="hover:text-cyan-300 transition-colors">
            Contact
          </a>
        </nav>

        {/* Action Controls: Cmd+K & Resume */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800/90 transition-all shadow-sm"
            aria-label="Open Command Palette (Cmd + K)"
          >
            <Search className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden lg:inline text-slate-300">Ask or search...</span>
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20 transition-colors shadow-sm"
          >
            <FileText className="h-3.5 w-3.5" />
            Resume PDF
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <div className="flex items-center gap-2 pb-2 text-xs text-emerald-300 border-b border-slate-800/80">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Nelnet · Software Engineer II</span>
          </div>
          <nav className="flex flex-col space-y-2.5 text-sm font-medium text-slate-200">
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-cyan-300"
            >
              Projects
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-cyan-300"
            >
              Experience
            </a>
            <a
              href="#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-cyan-300"
            >
              Skills
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-cyan-300"
            >
              Contact
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-300 pt-2 font-semibold"
            >
              <FileText className="h-4 w-4" />
              Download Resume (PDF)
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
