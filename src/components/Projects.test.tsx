import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Projects from './Projects';

describe('Projects section', () => {
  it('renders featured project cards', () => {
    render(
      <MemoryRouter>
        <Projects viewMode="map" />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /FEATURED PROJECTS/i })
    ).toBeInTheDocument();
    expect(screen.getByText('BRICK BREAKER')).toBeInTheDocument();
    expect(screen.getByText('NERDLE')).toBeInTheDocument();
    expect(screen.getByText('SUDOKU')).toBeInTheDocument();
    expect(screen.getByText('BLACKJACK')).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'DETAILS' }).length
    ).toBeGreaterThan(0);
  });

  it('renders cards in grid viewMode', () => {
    const { container } = render(
      <MemoryRouter>
        <Projects viewMode="grid" />
      </MemoryRouter>
    );

    const gridCards = container.querySelectorAll('.border-cyan-300\\/30');
    expect(gridCards.length).toBeGreaterThan(0);
  });

  it('handles clicks on project links and details', () => {
    render(
      <MemoryRouter>
        <Projects viewMode="map" />
      </MemoryRouter>
    );

    const liveLinks = screen.getAllByRole('link', { name: /LIVE/i });
    expect(liveLinks.length).toBeGreaterThan(0);
    liveLinks[0].click();

    const codeLinks = screen.getAllByRole('link', { name: /CODE/i });
    expect(codeLinks.length).toBeGreaterThan(0);
    codeLinks[0].click();

    const detailsLinks = screen.getAllByRole('link', { name: /DETAILS/i });
    expect(detailsLinks.length).toBeGreaterThan(0);
    detailsLinks[0].click();
  });
});
