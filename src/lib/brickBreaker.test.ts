import { describe, expect, it } from 'vitest';
import {
  BRICK_COLUMNS,
  BRICK_LABELS,
  PADDLE_WIDTH,
  PADDLE_Y,
  POINTS_PER_BRICK,
  REVIVE_DELAY,
  createBricks,
  createGame,
  stepGame,
  type StepInput,
} from './brickBreaker';

const frame = (overrides: Partial<StepInput> = {}): StepInput => ({
  dt: 0.016,
  now: 1000,
  width: 400,
  height: 500,
  steerX: null,
  random: () => 0.5,
  ...overrides,
});

describe('brickBreaker', () => {
  describe('createBricks', () => {
    it('lays the labels out in rows inside the play area', () => {
      const bricks = createBricks();

      expect(bricks).toHaveLength(BRICK_LABELS.length);
      expect(bricks.map((brick) => brick.label)).toEqual([...BRICK_LABELS]);
      expect(bricks[BRICK_COLUMNS].row).toBe(1);

      bricks.forEach((brick) => {
        expect(brick.left).toBeGreaterThanOrEqual(0);
        expect(brick.right).toBeLessThanOrEqual(1);
        expect(brick.right).toBeGreaterThan(brick.left);
        expect(brick.bottom).toBeGreaterThan(brick.top);
      });
    });

    it('keeps neighbouring bricks from overlapping', () => {
      const [first, second] = createBricks();
      const below = createBricks()[BRICK_COLUMNS];

      expect(second.left).toBeGreaterThan(first.right);
      expect(below.top).toBeGreaterThan(first.bottom);
    });
  });

  it('creates a game with every brick alive and no score', () => {
    const game = createGame(3);

    expect(game.alive).toEqual([true, true, true]);
    expect(game.reviveAt).toEqual([0, 0, 0]);
    expect(game.score).toBe(0);
  });

  describe('stepGame', () => {
    it('moves the ball by its velocity', () => {
      const game = createGame(0);
      game.ball = { x: 0.5, y: 0.5, vx: 0.1, vy: -0.2 };

      const changed = stepGame(game, [], frame({ dt: 0.1 }));

      expect(changed).toBe(false);
      expect(game.ball.x).toBeCloseTo(0.51);
      expect(game.ball.y).toBeCloseTo(0.48);
    });

    it('bounces the ball off the side walls and ceiling', () => {
      const game = createGame(0);

      game.ball = { x: 0.01, y: 0.5, vx: -0.5, vy: 0 };
      stepGame(game, [], frame());
      expect(game.ball.vx).toBeGreaterThan(0);

      game.ball = { x: 0.99, y: 0.5, vx: 0.5, vy: 0 };
      stepGame(game, [], frame());
      expect(game.ball.vx).toBeLessThan(0);

      game.ball = { x: 0.5, y: 0.01, vx: 0, vy: -0.5 };
      stepGame(game, [], frame());
      expect(game.ball.vy).toBeGreaterThan(0);
    });

    it('steers the paddle toward the ball during autoplay', () => {
      const game = createGame(0);
      game.ball = { x: 0.8, y: 0.3, vx: 0, vy: 0 };
      game.paddleX = 0.5;

      stepGame(game, [], frame({ now: 0 }));

      expect(game.paddleX).toBeGreaterThan(0.5);
      expect(game.paddleX).toBeLessThan(0.8);
    });

    it('steers the paddle toward the player and keeps it in bounds', () => {
      const game = createGame(0);
      game.ball = { x: 0.5, y: 0.3, vx: 0, vy: 0 };
      game.paddleX = 0.5;

      stepGame(game, [], frame({ steerX: 0, dt: 1 }));

      expect(game.paddleX).toBeCloseTo(PADDLE_WIDTH / 2);
    });

    it('returns the ball off the paddle, angled by where it lands', () => {
      const game = createGame(0);
      game.paddleX = 0.5;
      game.ball = { x: 0.58, y: PADDLE_Y - 0.015, vx: 0, vy: 0.62 };

      stepGame(game, [], frame({ steerX: 0.5 }));

      expect(game.ball.vy).toBeLessThan(0);
      expect(game.ball.vx).toBeGreaterThan(0);
      expect(game.ball.y).toBeLessThan(PADDLE_Y);
    });

    it('serves again from the paddle after a miss', () => {
      const game = createGame(0);
      game.paddleX = 0.3;
      game.ball = { x: 0.9, y: 1.2, vx: 0, vy: 0.62 };

      stepGame(game, [], frame({ steerX: 0.3, random: () => 0.9 }));

      expect(game.ball.x).toBeCloseTo(0.3);
      expect(game.ball.y).toBeLessThan(PADDLE_Y);
      expect(game.ball.vy).toBeLessThan(0);
      expect(game.ball.vx).toBeGreaterThan(0);
    });

    it('breaks a brick hit from below and scores it', () => {
      const bricks = createBricks(['C#'], 1);
      const game = createGame(bricks.length);
      const [brick] = bricks;
      game.ball = {
        x: (brick.left + brick.right) / 2,
        y: brick.bottom + 0.02,
        vx: 0,
        vy: -0.62,
      };

      const changed = stepGame(game, bricks, frame({ now: 2000 }));

      expect(changed).toBe(true);
      expect(game.alive).toEqual([false]);
      expect(game.score).toBe(POINTS_PER_BRICK);
      expect(game.reviveAt[0]).toBe(2000 + REVIVE_DELAY);
      expect(game.ball.vy).toBeGreaterThan(0);
    });

    it('deflects sideways when the ball clips the edge of a brick', () => {
      const bricks = createBricks(['C#'], 1);
      const game = createGame(bricks.length);
      const [brick] = bricks;
      game.ball = {
        x: brick.right + 0.02,
        y: (brick.top + brick.bottom) / 2,
        vx: -0.62,
        vy: 0.01,
      };

      stepGame(game, bricks, frame());

      expect(game.alive).toEqual([false]);
      expect(game.ball.vx).toBeGreaterThan(0);
    });

    it('brings a brick back once its delay passes and the ball is clear', () => {
      const bricks = createBricks(['C#'], 1);
      const game = createGame(bricks.length);
      game.alive = [false];
      game.reviveAt = [5000];
      game.ball = { x: 0.5, y: 0.6, vx: 0, vy: 0 };

      expect(stepGame(game, bricks, frame({ now: 4000 }))).toBe(false);
      expect(game.alive).toEqual([false]);

      expect(stepGame(game, bricks, frame({ now: 6000 }))).toBe(true);
      expect(game.alive).toEqual([true]);
    });

    it('waits to bring a brick back while the ball is still on top of it', () => {
      const bricks = createBricks(['C#'], 1);
      const game = createGame(bricks.length);
      game.alive = [false];
      game.reviveAt = [0];
      game.ball = { x: 0.1, y: bricks[0].top, vx: 0, vy: 0 };

      expect(stepGame(game, bricks, frame({ now: 6000 }))).toBe(false);
      expect(game.alive).toEqual([false]);
    });
  });
});
