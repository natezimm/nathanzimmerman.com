import { useState } from 'react';
import { FileText, Menu, X, ArrowUpRight, Search } from 'lucide-react';

type HeaderProps = {
  onOpenCommandPalette?: () => void;
};

export const Header = ({ onOpenCommandPalette }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090A0D]/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Monogram & Technical Status */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2.5 font-heading text-base font-bold tracking-tight text-[#F3F2EE] hover:text-[#E6A838] transition-colors"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.06] border border-white/[0.1] font-mono text-xs text-[#E6A838]">
              NZ
            </span>
            <span>NATHAN ZIMMERMAN</span>
          </a>

          <div className="hidden lg:flex items-center gap-2 border-l border-white/[0.08] pl-4 font-mono text-[11px] text-zinc-400">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#00E599] animate-pulse" />
            <span>NELNET // SDE II (PAYMENTS &amp; BILLING)</span>
          </div>
        </div>

        {/* Index Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs text-zinc-400">
          <a
            href="#systems"
            className="hover:text-[#F3F2EE] transition-colors flex items-center gap-1"
          >
            <span className="text-[#E6A838]">01</span>
            <span>SYSTEMS</span>
          </a>
          <a
            href="#experience"
            className="hover:text-[#F3F2EE] transition-colors flex items-center gap-1"
          >
            <span className="text-[#E6A838]">02</span>
            <span>DOSSIER</span>
          </a>
          <a
            href="#specification"
            className="hover:text-[#F3F2EE] transition-colors flex items-center gap-1"
          >
            <span className="text-[#E6A838]">03</span>
            <span>SPECIFICATION</span>
          </a>
          <a
            href="#dispatch"
            className="hover:text-[#F3F2EE] transition-colors flex items-center gap-1"
          >
            <span className="text-[#E6A838]">04</span>
            <span>DISPATCH</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 rounded border border-white/[0.12] bg-white/[0.03] hover:border-white/[0.25] hover:bg-white/[0.06] px-3 py-1.5 font-mono text-xs text-zinc-300 transition-all shadow-sm"
              aria-label="Open Command Palette (Cmd + K)"
            >
              <Search className="h-3.5 w-3.5 text-[#E6A838]" />
              <span className="hidden sm:inline">QUERY</span>
              <kbd className="rounded border border-white/[0.15] bg-black/40 px-1.5 py-0.5 text-[10px] text-zinc-400">
                ⌘K
              </kbd>
            </button>
          )}

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded border border-white/[0.15] bg-white/[0.04] hover:bg-[#E6A838] hover:text-black hover:border-[#E6A838] px-3.5 py-1.5 font-mono text-xs font-medium text-[#F3F2EE] transition-all shadow-sm"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>RESUME.PDF</span>
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded border border-white/[0.1] bg-white/[0.03] p-1.5 text-zinc-400 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0B0C0F] px-4 py-4 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 pb-2 text-[11px] text-[#00E599] border-b border-white/[0.06]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00E599]"></span>
            <span>NELNET // SDE II (PAYMENTS &amp; BILLING)</span>
          </div>
          <nav className="flex flex-col space-y-3 pt-1">
            <a
              href="#systems"
              onClick={() => setMobileOpen(false)}
              className="text-zinc-300 hover:text-[#E6A838] flex items-center gap-2"
            >
              <span className="text-[#E6A838]">01</span>
              <span>SYSTEMS &amp; ARCHITECTURE</span>
            </a>
            <a
              href="#experience"
              onClick={() => setMobileOpen(false)}
              className="text-zinc-300 hover:text-[#E6A838] flex items-center gap-2"
            >
              <span className="text-[#E6A838]">02</span>
              <span>ENGINEERING DOSSIER</span>
            </a>
            <a
              href="#specification"
              onClick={() => setMobileOpen(false)}
              className="text-zinc-300 hover:text-[#E6A838] flex items-center gap-2"
            >
              <span className="text-[#E6A838]">03</span>
              <span>SPECIFICATION MATRIX</span>
            </a>
            <a
              href="#dispatch"
              onClick={() => setMobileOpen(false)}
              className="text-zinc-300 hover:text-[#E6A838] flex items-center gap-2"
            >
              <span className="text-[#E6A838]">04</span>
              <span>COMMUNICATION DISPATCH</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
