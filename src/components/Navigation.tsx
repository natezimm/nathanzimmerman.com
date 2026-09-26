import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';
import { FileText, ArrowUpRight } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'glass shadow-lg py-2.5' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <button
            onClick={() => scrollToSection('home')}
            className="text-2xl font-bold gradient-text hover:opacity-85 transition-opacity font-heading tracking-tight"
          >
            NZ
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-foreground/75 hover:text-primary transition-colors relative group py-1"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-400 transition-all duration-300 group-hover:w-full rounded-full" />
              </button>
            ))}

            <div className="h-5 w-px bg-border/60" />

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-white/15 bg-slate-100/70 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 text-xs font-medium text-foreground px-3.5 py-1.5 transition-all hover:scale-105 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>Resume</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              className="relative w-10 h-10 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={cn(
                    'block h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out origin-left',
                    isMobileMenuOpen
                      ? 'rotate-45 translate-x-[3px] -translate-y-[1px] w-[29px]'
                      : 'w-full'
                  )}
                />
                <span
                  className={cn(
                    'block h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out',
                    isMobileMenuOpen
                      ? 'opacity-0 translate-x-4'
                      : 'opacity-100 w-full'
                  )}
                />
                <span
                  className={cn(
                    'block h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out origin-left',
                    isMobileMenuOpen
                      ? '-rotate-45 translate-x-[3px] translate-y-[1px] w-[29px]'
                      : 'w-full'
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            data-testid="mobile-menu"
            className="md:hidden overflow-hidden transition-all duration-300 ease-in-out pt-4 pb-2 border-t border-border/50 animate-fade-in"
          >
            <div className="flex flex-col space-y-2 font-medium text-sm pt-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left py-2 px-3 rounded-md hover:bg-accent text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent text-sky-400"
              >
                <FileText className="w-4 h-4" />
                <span>Resume PDF</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto" />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
