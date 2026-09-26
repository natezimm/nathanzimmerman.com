import {
  Github,
  Linkedin,
  ArrowDown,
  Activity,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import nathanPortraitAvif from '@/assets/nathan-portrait.avif';
import nathanPortraitWebp from '@/assets/nathan-portrait.webp';
import nathanPortraitJpg from '@/assets/nathan-portrait.jpg';
import nathanVectorJpg from '@/assets/nathan-vector.jpg';
import nathanVectorLightJpg from '@/assets/nathan-vector-light.jpg';

const ROLES = [
  'Full-Stack Engineer',
  'Product-Minded Builder',
  'C# & TypeScript Developer',
] as const;
const TYPING_SPEED = 80;
const DELETING_SPEED = 50;
const PAUSE_DURATION = 2000;

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const fullRolesText = ROLES.join(' • ');

  return (
    <section
      id="home"
      className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-16 lg:py-28"
    >
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-purple-500/20 blur-[70px] md:blur-[130px] animate-pulse" />
        <div className="absolute top-[15%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/20 blur-[60px] md:blur-[120px] animate-pulse delay-1000" />
        <div className="absolute bottom-[-10%] left-[25%] w-[50%] h-[50%] rounded-full bg-cyan-500/15 blur-[80px] md:blur-[140px] animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] opacity-75" />

      {/* Radial ambient illumination */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[900px] h-[900px] rounded-full bg-gradient-radial from-sky-500/10 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container px-4 sm:px-6 mx-auto animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column: Headlines, Role typing, Bio, CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Live Role Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-sky-400/40 dark:border-sky-400/35 bg-sky-500/10 dark:bg-sky-500/15 px-4 py-1.5 text-xs sm:text-sm font-semibold sm:font-medium text-sky-700 dark:text-sky-200 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Software Engineer II @ Nelnet</span>
            </div>

            {/* Main Greeting */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight font-heading leading-[1.1]">
              Hi, my name is <span className="gradient-text">Nathan</span>.
            </h1>

            {/* Accessible Typing Subtitle */}
            <p
              className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-light min-h-[1.5em]"
              aria-label={fullRolesText}
            >
              <span
                aria-hidden="true"
                className="inline-flex items-center font-heading"
              >
                {displayText}
                <span
                  className="inline-block w-[3px] h-[1em] bg-sky-400 ml-1 animate-blink"
                  aria-hidden="true"
                />
              </span>
              {/* Visually hidden text for screen readers */}
              <span className="sr-only">{fullRolesText}</span>
            </p>

            {/* Bio Paragraph */}
            <p className="text-base sm:text-lg text-foreground/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Former special education teacher turned software engineer,
              bringing empathy and clear thinking to enterprise fintech. I build
              clean, reliable systems from frontend interfaces to backend
              microservices.
            </p>

            {/* Buttons & Socials */}
            <div className="pt-2">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base rounded-full bg-primary text-primary-foreground font-medium shadow-lg shadow-sky-500/20 hover:shadow-sky-500/35 transition-all duration-300 hover:-translate-y-0.5"
                  onClick={() => scrollToSection('projects')}
                >
                  View My Work
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base rounded-full border border-slate-300 dark:border-white/20 bg-slate-100/70 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 text-foreground backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                  onClick={() => scrollToSection('contact')}
                >
                  Get In Touch
                </Button>

                <div className="flex items-center gap-2.5 pl-1">
                  {[
                    {
                      href: 'https://github.com/natezimm',
                      icon: Github,
                      label: 'GitHub',
                    },
                    {
                      href: 'https://www.linkedin.com/in/zimmermannathan',
                      icon: Linkedin,
                      label: 'LinkedIn',
                    },
                  ].map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-300 dark:border-white/15 bg-slate-100/70 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:border-sky-500 dark:hover:border-sky-400/50 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-sm"
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Portrait & Fintech Hub Anchor */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
              {/* Glowing Aura behind the card */}
              <div className="absolute inset-0 -m-6 sm:-m-10 rounded-full bg-gradient-to-tr from-cyan-500/25 via-sky-500/20 to-purple-600/25 blur-3xl opacity-80 pointer-events-none" />

              {/* Floating Top Telemetry Pill */}
              <div className="animate-float-slow absolute -top-4 -right-2 sm:-top-6 sm:-right-4 z-20 bg-white/60 dark:bg-card/50 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 dark:border-white/20 shadow-xl shadow-slate-900/10 dark:shadow-slate-950/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground flex items-center gap-1.5 font-heading">
                    Enterprise Fintech
                  </div>
                  <div className="text-[11px] text-emerald-500 dark:text-emerald-400 font-medium">
                    Payments & Microservices
                  </div>
                </div>
              </div>

              {/* Floating Bottom Architecture Card */}
              <div className="animate-float-reverse absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-4 z-20 bg-white/60 dark:bg-card/50 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 dark:border-white/20 shadow-xl shadow-slate-900/10 dark:shadow-slate-950/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-500 dark:text-sky-400">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-foreground font-heading">
                    Primary Stack
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['.NET', 'C#', 'Angular', 'AWS'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-secondary/80 text-foreground border border-slate-200 dark:border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Central Portrait Card */}
              <div className="relative rounded-[2rem] p-3 sm:p-3.5 bg-gradient-to-b from-card/95 via-card/85 to-card/95 border border-slate-200/90 dark:border-white/20 group-hover:border-sky-400/30 backdrop-blur-xl shadow-2xl shadow-slate-900/10 dark:shadow-slate-950/50 group overflow-hidden transition-all duration-500">
                {/* Header System Line */}
                <div className="flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl bg-slate-100/90 dark:bg-secondary/60 border border-slate-200/80 dark:border-white/10 text-[11px] font-mono text-muted-foreground transition-colors group-hover:border-sky-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-foreground/80 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                    nathan_zimmerman.dev
                  </span>
                </div>

                {/* Picture Container with Clean Photo Crossfade Transition */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-secondary/50 group-hover:ring-2 group-hover:ring-sky-400/30 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-500">
                  {/* Base Real Headshot */}
                  <picture>
                    <source srcSet={nathanPortraitAvif} type="image/avif" />
                    <source srcSet={nathanPortraitWebp} type="image/webp" />
                    <img
                      src={nathanPortraitJpg}
                      alt="Nathan Zimmerman - Software Engineer"
                      fetchPriority="high"
                      width={480}
                      height={600}
                      className="w-full h-full object-cover object-top select-none transition-opacity duration-700 group-hover:opacity-0"
                    />
                  </picture>

                  {/* Illustrated Vector Portrait - Dark Theme (Reveals on Hover) */}
                  <img
                    src={nathanVectorJpg}
                    alt="Nathan Zimmerman - Illustrated Vector Portrait"
                    width={480}
                    height={600}
                    className="hidden dark:block absolute inset-0 w-full h-full object-cover object-top select-none opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />

                  {/* Illustrated Vector Portrait - Light Theme (Reveals on Hover) */}
                  <img
                    src={nathanVectorLightJpg}
                    alt="Nathan Zimmerman - Illustrated Vector Portrait"
                    width={480}
                    height={600}
                    className="block dark:hidden absolute inset-0 w-full h-full object-cover object-top select-none opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />

                  {/* Subtle inner shadow / gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 dark:from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="text-center pt-8 sm:pt-12">
          <button
            onClick={() => scrollToSection('about')}
            className="inline-block text-muted-foreground hover:text-sky-400 transition-colors animate-bounce p-2"
            aria-label="Scroll to about section"
          >
            <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
