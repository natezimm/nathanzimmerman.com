import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { SpotlightGroup } from './spotlight-group';

describe('SpotlightGroup', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderGroup = (onPointerMove?: () => void) => {
    render(
      <SpotlightGroup
        data-testid="group"
        className="grid"
        onPointerMove={onPointerMove}
      >
        <div data-testid="first" className="spotlight-card" />
        <div data-testid="second" className="spotlight-card" />
        <div data-testid="plain" />
      </SpotlightGroup>
    );

    screen.getByTestId('first').getBoundingClientRect = () =>
      ({ left: 0, top: 0 }) as DOMRect;
    screen.getByTestId('second').getBoundingClientRect = () =>
      ({ left: 300, top: 40 }) as DOMRect;

    return screen.getByTestId('group');
  };

  const movePointer = async (target: Element, pointerType: string) => {
    fireEvent.pointerMove(target, { pointerType, clientX: 120, clientY: 60 });
    await act(async () => {
      vi.advanceTimersByTime(32);
    });
  };

  it('keeps its own class alongside the ones it is given', () => {
    const group = renderGroup();

    expect(group).toHaveClass('spotlight-group', 'grid');
  });

  it('gives each card the cursor position relative to itself', async () => {
    const group = renderGroup();

    await movePointer(group, 'mouse');

    const first = screen.getByTestId('first');
    const second = screen.getByTestId('second');
    expect(first.style.getPropertyValue('--spot-x')).toBe('120px');
    expect(first.style.getPropertyValue('--spot-y')).toBe('60px');
    expect(second.style.getPropertyValue('--spot-x')).toBe('-180px');
    expect(second.style.getPropertyValue('--spot-y')).toBe('20px');
    expect(screen.getByTestId('plain').style.getPropertyValue('--spot-x')).toBe(
      ''
    );
  });

  it('ignores touch pointers but still calls the provided handler', async () => {
    const onPointerMove = vi.fn();
    const group = renderGroup(onPointerMove);

    await movePointer(group, 'touch');

    expect(onPointerMove).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('first').style.getPropertyValue('--spot-x')).toBe(
      ''
    );
  });
});
