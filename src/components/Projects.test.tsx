import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Projects from './Projects';

describe('Projects section', () => {
  it('renders featured work and actions', () => {
    render(<Projects />);

    expect(screen.getByText('Brick Breaker Resume')).toBeInTheDocument();
    expect(screen.getByText('Nerdle')).toBeInTheDocument();
    expect(screen.getByText('Blackjack')).toBeInTheDocument();
    expect(screen.getByText('Sudoku')).toBeInTheDocument();
    expect(screen.getAllByText('Code')).toHaveLength(4);
    expect(screen.getAllByText('Live Demo')).toHaveLength(1);
  });

  it('marks only projects with a live demo playable, with a hover shortcut', () => {
    const { container } = render(<Projects />);

    expect(
      screen.getByText('4 games · 1 playable in your browser')
    ).toBeInTheDocument();
    expect(screen.getAllByText('Playable')).toHaveLength(1);

    const shortcuts = container.querySelectorAll('a[aria-hidden="true"]');
    expect(shortcuts).toHaveLength(1);
    expect(shortcuts[0]).toHaveAttribute(
      'href',
      'https://resume.nathanzimmerman.com'
    );
    expect(shortcuts[0]).toHaveAttribute('tabindex', '-1');
  });
});
