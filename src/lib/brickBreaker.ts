/**
 * Model for the hero's ambient brick breaker. Positions and velocities are
 * fractions of the play area (0-1), so the game is independent of its
 * rendered size.
 */

export type Brick = {
  label: string;
  row: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type GameState = {
  ball: { x: number; y: number; vx: number; vy: number };
  paddleX: number;
  alive: boolean[];
  reviveAt: number[];
  score: number;
};

export type StepInput = {
  /** Seconds since the previous frame. */
  dt: number;
  /** Frame timestamp in milliseconds. */
  now: number;
  /** Play-area size in CSS pixels. */
  width: number;
  height: number;
  /** The player's paddle target (0-1), or null while autoplay is steering. */
  steerX: number | null;
  random?: () => number;
};

export const BRICK_LABELS = [
  'C#',
  '.NET',
  'Angular',
  'AWS',
  'TypeScript',
  'React',
  'Node.js',
  'Java',
  'JavaScript',
  'Azure',
  'SQL Server',
  'REST APIs',
] as const;

export const BRICK_COLUMNS = 4;
export const BALL_RADIUS = 6;
export const PADDLE_WIDTH = 0.24;
export const PADDLE_Y = 0.94;
export const POINTS_PER_BRICK = 10;
export const REVIVE_DELAY = 6500;

const BRICK_MARGIN = 0.04;
const BRICK_WIDTH = 0.215;
const BRICK_HEIGHT = 0.052;
const BRICK_GAP_X = 0.02;
const BRICK_GAP_Y = 0.016;

const BALL_SPEED = 0.62;
const SERVE_Y = 0.88;
const SERVE_DRIFT = 0.26;
const MAX_DEFLECTION = 0.5;
const DEFLECTION_JITTER = 0.08;
const PADDLE_REACH = 0.02;
const OUT_OF_BOUNDS_Y = 1.08;
const REVIVE_CLEARANCE = 0.04;

// Autoplay sways around the ball so its returns vary instead of looping.
const AUTOPLAY_SWAY = 0.06;
const AUTOPLAY_SWAY_PERIOD = 900;
const AUTOPLAY_FOLLOW = 10;
const PLAYER_FOLLOW = 18;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const createBricks = (
  labels: readonly string[] = BRICK_LABELS,
  columns: number = BRICK_COLUMNS
): Brick[] =>
  labels.map((label, index) => {
    const row = Math.floor(index / columns);
    const left = BRICK_MARGIN + (index % columns) * (BRICK_WIDTH + BRICK_GAP_X);
    const top = BRICK_MARGIN + row * (BRICK_HEIGHT + BRICK_GAP_Y);

    return {
      label,
      row,
      left,
      top,
      right: left + BRICK_WIDTH,
      bottom: top + BRICK_HEIGHT,
    };
  });

export const createGame = (brickCount: number): GameState => ({
  ball: { x: 0.6, y: 0.6, vx: 0.24, vy: -BALL_SPEED },
  paddleX: 0.5,
  alive: Array.from({ length: brickCount }, () => true),
  reviveAt: Array.from({ length: brickCount }, () => 0),
  score: 0,
});

/**
 * Advances the game by one frame, mutating `state` in place.
 * Returns true when a brick broke or came back, so callers can re-render.
 */
export const stepGame = (
  state: GameState,
  bricks: readonly Brick[],
  { dt, now, width, height, steerX, random = Math.random }: StepInput
): boolean => {
  const { ball } = state;
  const radiusX = BALL_RADIUS / width;
  const radiusY = BALL_RADIUS / height;
  const previousX = ball.x;
  const previousY = ball.y;

  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  if (ball.x < radiusX) {
    ball.x = radiusX;
    ball.vx = Math.abs(ball.vx);
  } else if (ball.x > 1 - radiusX) {
    ball.x = 1 - radiusX;
    ball.vx = -Math.abs(ball.vx);
  }

  if (ball.y < radiusY) {
    ball.y = radiusY;
    ball.vy = Math.abs(ball.vy);
  }

  const halfPaddle = PADDLE_WIDTH / 2;
  const target =
    steerX ?? ball.x + Math.sin(now / AUTOPLAY_SWAY_PERIOD) * AUTOPLAY_SWAY;
  const follow = steerX === null ? AUTOPLAY_FOLLOW : PLAYER_FOLLOW;
  state.paddleX = clamp(
    state.paddleX + (target - state.paddleX) * Math.min(1, dt * follow),
    halfPaddle,
    1 - halfPaddle
  );

  const reachedPaddle =
    ball.vy > 0 &&
    ball.y + radiusY >= PADDLE_Y &&
    previousY + radiusY <= PADDLE_Y + PADDLE_REACH;

  if (
    reachedPaddle &&
    Math.abs(ball.x - state.paddleX) <= halfPaddle + radiusX
  ) {
    const offset = (ball.x - state.paddleX) / halfPaddle;
    ball.vx = offset * MAX_DEFLECTION + (random() - 0.5) * DEFLECTION_JITTER;
    ball.vy = -BALL_SPEED;
    ball.y = PADDLE_Y - radiusY;
  } else if (ball.y > OUT_OF_BOUNDS_Y) {
    // Missed: serve again from the paddle rather than ending the game.
    ball.x = state.paddleX;
    ball.y = SERVE_Y;
    ball.vx = (random() < 0.5 ? -1 : 1) * SERVE_DRIFT;
    ball.vy = -BALL_SPEED;
  }

  let changed = false;

  for (let index = 0; index < bricks.length; index += 1) {
    const brick = bricks[index];

    if (!state.alive[index]) {
      const ballIsClear = ball.y - radiusY > brick.bottom + REVIVE_CLEARANCE;
      if (now > state.reviveAt[index] && ballIsClear) {
        state.alive[index] = true;
        changed = true;
      }
      continue;
    }

    const overlaps =
      ball.x + radiusX > brick.left &&
      ball.x - radiusX < brick.right &&
      ball.y + radiusY > brick.top &&
      ball.y - radiusY < brick.bottom;

    if (!overlaps) continue;

    const cameFromAboveOrBelow =
      previousY + radiusY <= brick.top || previousY - radiusY >= brick.bottom;
    if (cameFromAboveOrBelow) {
      ball.vy = -ball.vy;
    } else {
      ball.vx = -ball.vx;
    }
    ball.x = previousX;
    ball.y = previousY;

    state.alive[index] = false;
    state.reviveAt[index] = now + REVIVE_DELAY;
    state.score += POINTS_PER_BRICK;
    changed = true;
    break;
  }

  return changed;
};
