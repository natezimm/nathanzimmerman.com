import { Github, Linkedin, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";

const ROLES = ["Full-Stack Engineer", "Builder", "Lifelong Learner"] as const;
const TYPING_SPEED = 80;
const DELETING_SPEED = 50;
const PAUSE_DURATION = 2000;

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const typeEffect = useCallback(() => {
    const currentRole = ROLES[roleIndex];

    if (isDeleting) {
      if (displayText.length > 0) {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      }
    } else {
      if (displayText.length < currentRole.length) {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
      } else {
        setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
        return;
      }
    }
  }, [displayText, roleIndex, isDeleting]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(ROLES[roleIndex]);
      return;
    }

    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    const timer = setTimeout(typeEffect, speed);

    return () => clearTimeout(timer);
  }, [typeEffect, isDeleting, prefersReducedMotion, roleIndex]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const fullRolesText = ROLES.join(" • ");

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-20"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/20 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[140px] animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Radial center glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/5 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 mx-auto text-center animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            Hi, I'm <span className="gradient-text">Nathan</span> <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h1>

          {/* Accessible typing effect - full text for screen readers, animated text for visual users */}
          <p
            className="text-2xl md:text-3xl text-muted-foreground font-light h-[1.5em]"
            aria-label={fullRolesText}
          >
            <span aria-hidden="true" className="inline-flex items-center">
              {displayText}
              <span
                className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-blink"
                aria-hidden="true"
              />
            </span>
            {/* Visually hidden text for screen readers */}
            <span className="sr-only">{fullRolesText}</span>
          </p>

          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Former special education teacher turned software engineer, bringing a people-first mindset to development. I build clean, intuitive applications and enjoy working across the stack to make things simple and useful for real people.
          </p>

          <div className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-items-center">
              <Button
                size="lg"
                className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 sm:justify-self-end"
                onClick={() => scrollToSection("projects")}
              >
                View My Work
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-lg rounded-full border border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 text-foreground backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 sm:justify-self-start"
                onClick={() => scrollToSection("contact")}
              >
                Get In Touch
              </Button>
            </div>

            <button
              onClick={() => scrollToSection("about")}
              className="mt-8 mx-auto block text-muted-foreground hover:text-primary transition-colors animate-bounce"
              aria-label="Scroll to about section"
            >
              <ArrowDown className="w-8 h-8" />
            </button>

            <div className="flex items-center justify-center gap-8 pt-6">
              {[
                { href: "https://github.com/natezimm", icon: Github, label: "GitHub" },
                {
                  href: "https://www.linkedin.com/in/zimmermannathan",
                  icon: Linkedin,
                  label: "LinkedIn"
                },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label={label}
                >
                  <Icon className="w-8 h-8" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
