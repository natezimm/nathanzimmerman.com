import { Pause, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';
import {
  PADDLE_WIDTH,
  PADDLE_Y,
  createBricks,
  createGame,
  stepGame,
  type GameState,
} from '@/lib/brickBreaker';
import nathanPortraitAvif from '@/assets/nathan-portrait.avif';
import nathanPortraitWebp from '@/assets/nathan-portrait.webp';
import nathanPortraitJpg from '@/assets/nathan-portrait.jpg';
import nathanVectorJpg from '@/assets/nathan-vector.jpg';
import nathanVectorLightJpg from '@/assets/nathan-vector-light.jpg';

const STEER_TIMEOUT = 2500;
const MAX_FRAME_SECONDS = 0.033;

const BRICK_ROW_STYLES = [
  'border-sky-500/70 bg-sky-500/25 shadow-[0_0_18px_-4px_rgba(56,189,248,0.7)]',
  'border-cyan-500/60 bg-cyan-500/20 shadow-[0_0_18px_-4px_rgba(34,211,238,0.6)]',
  'border-indigo-400/70 bg-indigo-400/25 shadow-[0_0_18px_-4px_rgba(129,140,248,0.65)]',
];

const percent = (fraction: number) => `${fraction * 100}%`;

const ballTransform = ({ ball }: GameState) =>
  `translate3d(${percent(ball.x)}, ${percent(ball.y)}, 0)`;

const paddleTransform = ({ paddleX }: GameState) =>
  `translate3d(${percent(paddleX - PADDLE_WIDTH / 2)}, 0, 0)`;

type HeroGameProps = {
  reducedMotion: boolean;
};

const HeroGame = ({ reducedMotion }: HeroGameProps) => {
  const bricks = useMemo(() => createBricks(), []);
  const [game] = useState(() => createGame(bricks.length));
  const areaRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const paddleRef = useRef<HTMLDivElement>(null);
  const steer = useRef({ x: 0.5, at: Number.NEGATIVE_INFINITY });

  const [alive, setAlive] = useState(() => [...game.alive]);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(reducedMotion);
  const [inView, setInView] = useState(true);
  const [playerHasPaddle, setPlayerHasPaddle] = useState(false);

  useEffect(() => {
    if (reducedMotion) setPaused(true);
  }, [reducedMotion]);

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting)
    );
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView) return;

    let frameId = 0;
    let lastTime = 0;
    let steering = false;

    const tick = (time: number) => {
      frameId = requestAnimationFrame(tick);

      const area = areaRef.current;
      const width = area?.clientWidth ?? 0;
      const height = area?.clientHeight ?? 0;
      if (!lastTime || !width || !height) {
        lastTime = time;
        return;
      }

      const dt = Math.min(MAX_FRAME_SECONDS, (time - lastTime) / 1000);
      lastTime = time;

      const isSteering = time - steer.current.at < STEER_TIMEOUT;
      const changed = stepGame(game, bricks, {
        dt,
        now: time,
        width,
        height,
        steerX: isSteering ? steer.current.x : null,
      });

      if (ballRef.current)
        ballRef.current.style.transform = ballTransform(game);
      if (paddleRef.current) {
        paddleRef.current.style.transform = paddleTransform(game);
      }

      if (changed) {
        setAlive([...game.alive]);
        setScore(game.score);
      }
      if (isSteering !== steering) {
        steering = isSteering;
        setPlayerHasPaddle(isSteering);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [paused, inView, game, bricks]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;

    steer.current = {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      at: performance.now(),
    };
  };

  const status = paused
    ? 'Paused'
    : playerHasPaddle
      ? 'You have the paddle'
      : 'Autoplay · slide across to play';

  return (
    <>
      <div
        ref={areaRef}
        onPointerMove={handlePointerMove}
        className="relative rounded-2xl overflow-hidden aspect-[4/5.15] touch-pan-y bg-slate-200 dark:bg-slate-950/50 group-hover:ring-2 group-hover:ring-sky-400/30 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-500"
      >
        {/* Portrait with Clean Photo Crossfade Transition */}
        <div className="hero-photo-fade absolute inset-x-0 bottom-0 h-[84%]">
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
        </div>

        {/* Subtle inner shadow / gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 dark:from-slate-950/60 via-transparent to-transparent pointer-events-none" />

        {/* Skill Bricks */}
        <div
          aria-hidden="true"
          data-testid="hero-game-bricks"
          className="absolute inset-0 pointer-events-none font-heading text-[10px] sm:text-xs font-semibold text-slate-900 dark:text-slate-50"
        >
          {bricks.map((brick, index) => (
            <span
              key={brick.label}
              data-alive={alive[index]}
              className={cn(
                'absolute flex items-center justify-center rounded-md sm:rounded-lg border backdrop-blur-sm transition-all duration-300',
                BRICK_ROW_STYLES[brick.row % BRICK_ROW_STYLES.length],
                alive[index] ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              )}
              style={{
                left: percent(brick.left),
                top: percent(brick.top),
                width: percent(brick.right - brick.left),
                height: percent(brick.bottom - brick.top),
              }}
            >
              {brick.label}
            </span>
          ))}
        </div>

        {/* Ball: a full-size layer, so percentage transforms track the area */}
        <div
          ref={ballRef}
          aria-hidden="true"
          data-testid="hero-game-ball"
          className="absolute inset-0 pointer-events-none will-change-transform"
          style={{ transform: ballTransform(game) }}
        >
          <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-sky-500 dark:bg-sky-100 shadow-[0_0_14px_4px_rgba(56,189,248,0.85)]" />
        </div>

        {/* Paddle */}
        <div
          ref={paddleRef}
          aria-hidden="true"
          data-testid="hero-game-paddle"
          className="absolute inset-x-0 h-2.5 pointer-events-none will-change-transform"
          style={{ top: percent(PADDLE_Y), transform: paddleTransform(game) }}
        >
          <span
            className="block h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.7)]"
            style={{ width: percent(PADDLE_WIDTH) }}
          />
        </div>
      </div>

      {/* Scoreboard & Controls */}
      <div className="flex items-center justify-between gap-3 pt-2 sm:pt-2.5 pl-1 font-mono text-[10px] sm:text-[11px] text-muted-foreground">
        <span aria-hidden="true" className="shrink-0">
          SCORE{' '}
          <span className="font-semibold text-foreground tabular-nums">
            {String(score).padStart(4, '0')}
          </span>
        </span>
        <span aria-hidden="true" className="truncate">
          {status}
        </span>
        <button
          type="button"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? 'Play brick breaker' : 'Pause brick breaker'}
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-slate-300 dark:border-white/15 bg-slate-100/70 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:border-sky-500 dark:hover:border-sky-400/50 transition-colors"
        >
          {paused ? (
            <Play className="w-3.5 h-3.5" />
          ) : (
            <Pause className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </>
  );
};

export default HeroGame;
