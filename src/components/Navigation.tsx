import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => setIsWide(e.matches);
    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass shadow-lg py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection("home")}
            className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity font-heading"
          >
            NZ
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <div className="h-6 w-px bg-border/50" />
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
                {/* Top line */}
                <span
                  className={cn(
                    "block h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out origin-left",
                    isMobileMenuOpen ? "rotate-45 translate-x-[3px] -translate-y-[1px] w-[29px]" : "w-full"
                  )}
                />
                {/* Middle line */}
                <span
                  className={cn(
                    "block h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out",
                    isMobileMenuOpen ? "opacity-0 translate-x-4" : "opacity-100 w-full"
                  )}
                />
                {/* Bottom line */}
                <span
                  className={cn(
                    "block h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out origin-left",
                    isMobileMenuOpen ? "-rotate-45 translate-x-[3px] translate-y-[1px] w-[29px]" : "w-full"
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            data-testid="mobile-menu"
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-white/10 shadow-xl animate-fade-in"
          >
            <div className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-foreground/70 hover:text-primary hover:bg-white/5 transition-all font-medium text-left px-4 py-3 rounded-md"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
