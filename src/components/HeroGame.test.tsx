import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import HeroGame from './HeroGame';
import { BRICK_LABELS } from '@/lib/brickBreaker';

// Fake timers run every animation frame that falls inside the window.
const advanceFrames = async (ms: number) => {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
};

describe('HeroGame', () => {
  let widthSpy: ReturnType<typeof vi.spyOn>;
  let heightSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    widthSpy = vi
      .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
      .mockReturnValue(400);
    heightSpy = vi
      .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
      .mockReturnValue(500);
  });

  afterEach(() => {
    vi.useRealTimers();
    widthSpy.mockRestore();
    heightSpy.mockRestore();
  });

  it('renders the portrait behind a wall of skill bricks', () => {
    render(<HeroGame reducedMotion={false} />);

    expect(
      screen.getByAltText('Nathan Zimmerman - Software Engineer')
    ).toBeInTheDocument();
    BRICK_LABELS.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    expect(screen.getByTestId('hero-game-bricks')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    expect(screen.getByText('0000')).toBeInTheDocument();
  });

  it('plays itself: the ball moves and breaks bricks for points', async () => {
    render(<HeroGame reducedMotion={false} />);

    const ball = screen.getByTestId('hero-game-ball');
    const startingTransform = ball.style.transform;

    await advanceFrames(2000);

    expect(ball.style.transform).not.toBe(startingTransform);
    expect(screen.queryByText('0000')).not.toBeInTheDocument();
    expect(
      screen
        .getByTestId('hero-game-bricks')
        .querySelector('[data-alive="false"]')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Autoplay · slide across to play')
    ).toBeInTheDocument();
  });

  it('pauses and resumes from the control', async () => {
    render(<HeroGame reducedMotion={false} />);
    const ball = screen.getByTestId('hero-game-ball');

    await advanceFrames(200);
    fireEvent.click(
      screen.getByRole('button', { name: 'Pause brick breaker' })
    );
    expect(screen.getByText('Paused')).toBeInTheDocument();

    const pausedTransform = ball.style.transform;
    await advanceFrames(400);
    expect(ball.style.transform).toBe(pausedTransform);

    fireEvent.click(screen.getByRole('button', { name: 'Play brick breaker' }));
    await advanceFrames(400);
    expect(ball.style.transform).not.toBe(pausedTransform);
  });

  it('starts paused when the visitor prefers reduced motion', async () => {
    render(<HeroGame reducedMotion />);
    const ball = screen.getByTestId('hero-game-ball');
    const startingTransform = ball.style.transform;

    await advanceFrames(400);

    expect(ball.style.transform).toBe(startingTransform);
    expect(
      screen.getByRole('button', { name: 'Play brick breaker' })
    ).toBeInTheDocument();
  });

  it('hands the paddle to the visitor when they move across the card', async () => {
    render(<HeroGame reducedMotion={false} />);
    const paddle = screen.getByTestId('hero-game-paddle');
    const area = paddle.parentElement as HTMLElement;
    area.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 400, height: 500 }) as DOMRect;

    await advanceFrames(100);
    fireEvent.pointerMove(area, { clientX: 0 });
    await advanceFrames(600);

    expect(screen.getByText('You have the paddle')).toBeInTheDocument();
    expect(paddle.style.transform).toBe('translate3d(0%, 0, 0)');
  });

  it('ignores pointer movement before the card has a size', async () => {
    render(<HeroGame reducedMotion={false} />);
    const area = screen.getByTestId('hero-game-paddle')
      .parentElement as HTMLElement;

    fireEvent.pointerMove(area, { clientX: 0 });
    await advanceFrames(200);

    expect(screen.queryByText('You have the paddle')).not.toBeInTheDocument();
  });
});
