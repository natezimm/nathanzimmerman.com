import { useEffect, useState, useRef } from 'react';
import {
  Search,
  X,
  FileText,
  ExternalLink,
  ArrowRight,
  Terminal,
  Layers,
  Briefcase,
  Wrench,
  Mail,
  Copy,
  Check,
} from 'lucide-react';
import { searchKnowledge, type KnowledgeItem } from '@/data/knowledgeBase';

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = searchKnowledge(query);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('nathan.a.zimmerman@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette and Career Assistant"
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/95 shadow-2xl shadow-cyan-950/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Ask about Nathan's experience, search skills, or jump to a project..."
            className="w-full bg-transparent text-sm md:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            aria-label="Close command palette"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Suggestion Pills when empty */}
        {!query && (
          <div className="border-b border-slate-800/80 bg-slate-950/50 px-4 py-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Terminal className="h-3 w-3 text-emerald-400" />
              Try asking:
            </span>
            <button
              onClick={() => setQuery('Nelnet microservices')}
              className="rounded-full bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 text-cyan-300 transition-colors"
            >
              Nelnet microservices
            </button>
            <button
              onClick={() => setQuery('Amazon risk screening')}
              className="rounded-full bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 text-cyan-300 transition-colors"
            >
              Amazon risk screening
            </button>
            <button
              onClick={() => setQuery('C# .NET skills')}
              className="rounded-full bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 text-cyan-300 transition-colors"
            >
              C# &amp; .NET stack
            </button>
            <button
              onClick={() => setQuery('Sudoku architecture')}
              className="rounded-full bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 text-cyan-300 transition-colors"
            >
              Sudoku architecture
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2.5">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No matching technical facts found for &quot;{query}&quot;.</p>
              <p className="mt-1 text-xs text-slate-400">
                Try asking about Nelnet, Amazon, C#, Angular, AWS, or Sudoku.
              </p>
            </div>
          ) : (
            results.map((item, idx) => (
              <div
                key={item.id}
                className={`rounded-lg border p-3.5 transition-colors ${
                  idx === selectedIndex
                    ? 'border-cyan-500/50 bg-cyan-950/20'
                    : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {item.category === 'experience' && (
                      <Briefcase className="h-4 w-4 text-emerald-400 shrink-0" />
                    )}
                    {item.category === 'projects' && (
                      <Layers className="h-4 w-4 text-cyan-400 shrink-0" />
                    )}
                    {item.category === 'skills' && (
                      <Wrench className="h-4 w-4 text-amber-400 shrink-0" />
                    )}
                    {item.category === 'about' && (
                      <FileText className="h-4 w-4 text-violet-400 shrink-0" />
                    )}
                    {item.category === 'contact' && (
                      <Mail className="h-4 w-4 text-rose-400 shrink-0" />
                    )}
                    <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 shrink-0">
                    {item.subtitle}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-300">{item.answer}</p>

                {item.bulletPoints && (
                  <ul className="mt-2 space-y-1 pl-4 text-xs text-slate-400 list-disc">
                    {item.bulletPoints.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                )}

                {item.actionLabel && (
                  <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                    {item.id === 'contact-info' && (
                      <button
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1.5 rounded bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 text-slate-400" /> Copy Email
                          </>
                        )}
                      </button>
                    )}
                    <a
                      href={item.actionHref}
                      target={item.isExternal ? '_blank' : undefined}
                      rel={item.isExternal ? 'noopener noreferrer' : undefined}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 px-3 py-1.5 text-xs font-medium text-cyan-200 transition-colors"
                    >
                      {item.actionLabel}
                      {item.isExternal ? (
                        <ExternalLink className="h-3 w-3" />
                      ) : (
                        <ArrowRight className="h-3 w-3" />
                      )}
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-4 py-2.5 text-[11px] text-slate-400">
          <span>Grounded in verified production history · Zero hallucinations</span>
          <span className="flex items-center gap-1.5">
            Press <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">ESC</kbd> to exit
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
