import {
  Github,
  Linkedin,
  ArrowDown,
  ArrowRight,
  Activity,
  Gamepad2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroGame from '@/components/HeroGame';
import {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef,
  type PointerEvent,
} from 'react';

const ROLES = [
  'Full-Stack Engineer',
  'Product-Minded Builder',
  'C# & TypeScript Developer',
] as const;
const TYPING_SPEED = 80;
const DELETING_SPEED = 50;
const PAUSE_DURATION = 2000;

const GREETING_WORDS = [
  { word: 'Hi,', delay: '[--rise-delay:60ms]' },
  { word: 'my', delay: '[--rise-delay:120ms]' },
  { word: 'name', delay: '[--rise-delay:180ms]' },
  { word: 'is', delay: '[--rise-delay:240ms]' },
];

// Light pulses that run along the 28px background grid lines.
const GRID_PACKETS = [
  'hero-packet-x top-[195px] w-[120px] text-sky-400 [--packet-duration:7s]',
  'hero-packet-x top-[391px] w-[90px] text-cyan-400 [--packet-duration:9s] [--packet-delay:2.5s]',
  'hero-packet-x top-[615px] w-[140px] text-violet-400 [--packet-duration:8s] [--packet-delay:1.2s]',
  'hero-packet-x top-[755px] w-[100px] text-sky-400 [--packet-duration:11s] [--packet-delay:4s]',
  'hero-packet-y left-[251px] h-[120px] text-cyan-400 [--packet-duration:6s] [--packet-delay:1s]',
  'hero-packet-y left-[867px] h-[100px] text-sky-400 [--packet-duration:7.5s] [--packet-delay:3s]',
  'hero-packet-y left-[1231px] h-[130px] text-violet-400 [--packet-duration:9s]',
];

const MAX_TILT_X = 9;
const MAX_TILT_Y = 12;
const BRICK_BREAKER_URL = 'https://resume.nathanzimmerman.com';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => () => cancelAnimationFrame(pointerFrame.current), []);

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

  // Points the grid spotlight at the cursor and leans the portrait card toward it.
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;

    const { clientX, clientY } = event;
    // Hold the card level while the visitor is steering the game inside it.
    const overCard = cardRef.current?.contains(event.target as Node) ?? false;

    cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = requestAnimationFrame(() => {
      const section = sectionRef.current;
      const rect = section?.getBoundingClientRect();
      if (!section || !rect?.width || !rect.height) return;

      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      const tilt = prefersReducedMotion || overCard ? 0 : 1;

      section.style.setProperty('--hero-mx', `${(x * 100).toFixed(2)}%`);
      section.style.setProperty('--hero-my', `${(y * 100).toFixed(2)}%`);
      section.style.setProperty(
        '--hero-rx',
        `${((0.5 - y) * MAX_TILT_X * tilt).toFixed(2)}deg`
      );
      section.style.setProperty(
        '--hero-ry',
        `${((x - 0.5) * MAX_TILT_Y * tilt).toFixed(2)}deg`
      );
    });
  };

  const fullRolesText = ROLES.join(' • ');

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-16 lg:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {/* Dynamic Background Atmosphere */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-aurora absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-purple-500/20 blur-[70px] md:blur-[130px] [--aurora-duration:16s]" />
          <div className="animate-aurora absolute top-[15%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/20 blur-[60px] md:blur-[120px] [--aurora-duration:20s] [animation-direction:reverse]" />
          <div className="animate-aurora absolute bottom-[-10%] left-[25%] w-[50%] h-[50%] rounded-full bg-cyan-500/15 blur-[80px] md:blur-[140px] [--aurora-duration:24s]" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] opacity-75" />

        {/* Cursor spotlight: ambient glow plus the grid lines it lights up */}
        <div className="hero-spotlight absolute inset-0" />
        <div className="hero-lit-grid absolute inset-0" />

        {/* Grid packets */}
        <div className="absolute inset-0 overflow-hidden">
          {GRID_PACKETS.map((packet) => (
            <span key={packet} className={`hero-packet ${packet}`} />
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container px-4 sm:px-6 mx-auto animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column: Headlines, Role typing, Bio, CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Live Role Badge */}
            <div className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-sky-400/40 dark:border-sky-400/35 bg-sky-500/10 dark:bg-sky-500/15 px-4 py-1.5 text-xs sm:text-sm font-semibold sm:font-medium text-sky-700 dark:text-sky-200 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Software Engineer II @ Nelnet</span>
            </div>

            {/* Main Greeting */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight font-heading leading-[1.1]">
              {GREETING_WORDS.map(({ word, delay }) => (
                <Fragment key={word}>
                  <span className={`animate-rise inline-block ${delay}`}>
                    {word}
                  </span>{' '}
                </Fragment>
              ))}
              <span className="animate-rise inline-block [--rise-delay:320ms]">
                <span className="gradient-text gradient-text-live">Nathan</span>
                .
              </span>
            </h1>

            {/* Accessible Typing Subtitle */}
            <p
              className="animate-rise [--rise-delay:420ms] text-xl sm:text-2xl md:text-3xl text-muted-foreground font-light min-h-[1.5em]"
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
            <p className="animate-rise [--rise-delay:500ms] text-base sm:text-lg text-foreground/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Former special education teacher turned software engineer,
              bringing empathy and clear thinking to enterprise fintech. I build
              clean, reliable systems from frontend interfaces to backend
              microservices.
            </p>

            {/* Buttons & Socials */}
            <div className="animate-rise [--rise-delay:580ms] pt-2">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Button
                  size="lg"
                  className="relative overflow-hidden h-12 px-8 text-base rounded-full bg-primary text-primary-foreground font-medium shadow-lg shadow-sky-500/20 hover:shadow-sky-500/35 transition-all duration-300 hover:-translate-y-0.5"
                  onClick={() => scrollToSection('projects')}
                >
                  View My Work
                  <span
                    aria-hidden="true"
                    className="animate-sheen absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent pointer-events-none"
                  />
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

            {/* Brick Breaker Tie-In */}
            <a
              href={BRICK_BREAKER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-rise [--rise-delay:660ms] group/game inline-flex items-center gap-2.5 text-sm font-medium text-sky-700 dark:text-sky-300 hover:text-sky-600 dark:hover:text-sky-200 transition-colors"
            >
              <Gamepad2 className="w-[18px] h-[18px] shrink-0" />
              <span>
                Those bricks are my stack. Play the full Brick Breaker Resume
              </span>
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover/game:translate-x-1" />
            </a>
          </div>

          {/* Right Column: Playable Portrait Card */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
              {/* Glowing Aura behind the card */}
              <div className="absolute inset-0 -m-6 sm:-m-10 rounded-full bg-gradient-to-tr from-cyan-500/25 via-sky-500/20 to-purple-600/25 blur-3xl opacity-80 pointer-events-none" />

              <div className="hero-tilt relative">
                {/* Floating Top Telemetry Pill, lifted off the card for depth */}
                <div className="absolute -top-3 right-0 sm:-top-4 sm:-right-3 z-20 [transform:translateZ(40px)]">
                  <div className="animate-float-slow bg-white/60 dark:bg-card/50 backdrop-blur-md rounded-2xl p-2.5 sm:p-3.5 border border-slate-200/90 dark:border-white/20 shadow-xl shadow-slate-900/10 dark:shadow-slate-950/50 flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] sm:text-xs font-semibold text-foreground flex items-center gap-1.5 font-heading">
                        Enterprise Fintech
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-emerald-500 dark:text-emerald-400 font-medium whitespace-nowrap">
                        Payments & Microservices
                      </div>
                    </div>
                  </div>
                </div>

                {/* Central Portrait Card, edged by a rotating beam */}
                <div
                  ref={cardRef}
                  className="group relative rounded-[2rem] p-[1.5px] overflow-hidden bg-slate-200/90 dark:bg-white/20 shadow-2xl shadow-slate-900/10 dark:shadow-slate-950/50"
                >
                  <div aria-hidden="true" className="card-beam" />

                  <div className="relative rounded-[calc(2rem-1.5px)] p-3 sm:p-3.5 bg-card">
                    {/* Header System Line */}
                    <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-100/90 dark:bg-secondary/60 border border-slate-200/80 dark:border-white/10 text-[10px] sm:text-[11px] font-mono text-muted-foreground transition-colors group-hover:border-sky-400/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="font-semibold text-foreground/80 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors truncate">
                          nathan_zimmerman.dev
                        </span>
                      </div>
                    </div>

                    <HeroGame reducedMotion={prefersReducedMotion} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="text-center pt-8 sm:pt-10">
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
