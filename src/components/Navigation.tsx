import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';
import { FileText, ArrowUpRight } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
] as const;

const MOBILE_MENU_ID = 'mobile-menu';

/** The section whose top half fills the middle of the viewport is the current one. */
const useActiveSection = () => {
  const [active, setActive] = useState<string>(NAV_ITEMS[0].id);

  useEffect(() => {
    const sections = NAV_ITEMS.map(({ id }) =>
      document.getElementById(id)
    ).filter((section): section is HTMLElement => section !== null);
    if (!sections.length || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const rafRef = useRef<number | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeSection = useActiveSection();

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

  // Escape closes the drawer and hands focus back to the button that opened it.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'py-1.5' : 'py-3',
        // The open mobile drawer needs a solid backdrop so it never sits over hero text.
        isMobileMenuOpen
          ? 'bg-background shadow-lg border-b border-border/60'
          : isScrolled
            ? 'glass shadow-lg'
            : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <a
            href="#home"
            onClick={closeMenu}
            aria-label="Nathan Zimmerman, back to top"
            className="inline-flex min-h-11 min-w-11 items-center text-2xl font-bold gradient-text hover:opacity-85 transition-opacity font-heading tracking-tight rounded-md"
          >
            NZ
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        'relative group inline-flex items-center h-10 px-2.5 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'text-foreground'
                          : 'text-foreground/75 hover:text-foreground'
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute bottom-1 left-2.5 right-2.5 h-0.5 rounded-full bg-sky-500 dark:bg-sky-400 origin-left transition-transform duration-300',
                          isActive
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover:scale-x-100'
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div aria-hidden="true" className="h-5 w-px bg-border/60" />

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-300 dark:border-white/15 bg-slate-100/70 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 text-xs font-medium text-foreground px-3.5 transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Resume</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls={MOBILE_MENU_ID}
              className="relative w-11 h-11 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
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
            id={MOBILE_MENU_ID}
            data-testid="mobile-menu"
            className="md:hidden pt-3 pb-2 border-t border-border/50 animate-fade-in"
          >
            <ul className="flex flex-col gap-1 font-medium text-sm pt-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={closeMenu}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        'flex items-center min-h-11 px-3 rounded-md hover:bg-accent transition-colors',
                        isActive
                          ? 'text-foreground bg-accent/60'
                          : 'text-foreground/80 hover:text-foreground'
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
              <li>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 min-h-11 px-3 rounded-md hover:bg-accent text-sky-700 dark:text-sky-400"
                >
                  <FileText className="w-4 h-4" />
                  <span>Resume PDF</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto" />
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
