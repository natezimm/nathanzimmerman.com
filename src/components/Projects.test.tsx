import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Projects from './Projects';

const renderProjects = () =>
  render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>
  );

const setMatchMedia = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia;
};

describe('Projects section', () => {
  it('features the four live projects with case study, code and demo links', () => {
    renderProjects();

    for (const [title, slug, live] of [
      ['Wheelhouse', 'wheelhouse', 'https://calendar.nathanzimmerman.com'],
      ['Know Ball', 'know-ball', 'https://knowball.nathanzimmerman.com'],
      ['Rabbit Ears', 'rabbit-ears', 'https://rabbitears.nathanzimmerman.com'],
      [
        'Brick Breaker Resume',
        'brick-breaker',
        'https://resume.nathanzimmerman.com',
      ],
    ]) {
      expect(screen.getByRole('link', { name: title })).toHaveAttribute(
        'href',
        `/projects/${slug}`
      );
      expect(
        screen.getByRole('link', { name: `${title} live demo` })
      ).toHaveAttribute('href', live);
      expect(
        screen.getByRole('link', { name: `${title} case study` })
      ).toHaveAttribute('href', `/projects/${slug}`);
    }

    expect(screen.getAllByText('Live Demo')).toHaveLength(4);
    expect(screen.getByText('4 projects · all live')).toBeInTheDocument();
  });

  it('lists the retired projects with code links only', () => {
    renderProjects();

    const earlier = screen
      .getByRole('heading', { name: 'Earlier projects' })
      .closest('div') as HTMLElement;
    const list = within(earlier).getByRole('list');
    const links = within(list).getAllByRole('link');

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      'https://github.com/natezimm/nerdle',
      'https://github.com/natezimm/sudoku',
      'https://github.com/natezimm/blackjack',
    ]);
    expect(screen.queryByText(/nerdle\.nathanzimmerman/)).toBeNull();
  });

  it('plays the recording on hover only when motion and hover allow it', () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);
    const pause = vi
      .spyOn(HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {});
    const { container } = renderProjects();
    const card = container.querySelector('.spotlight-card') as HTMLElement;
    const video = card.querySelector('video') as HTMLVideoElement;

    setMatchMedia(false);
    fireEvent.mouseEnter(card);
    expect(play).not.toHaveBeenCalled();
    expect(video).toHaveClass('opacity-0');

    setMatchMedia(true);
    // The second query is prefers-reduced-motion; answer it "no".
    (window.matchMedia as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce({ matches: true })
      .mockReturnValueOnce({ matches: false });
    fireEvent.mouseEnter(card);
    expect(play).toHaveBeenCalledTimes(1);
    expect(video).toHaveClass('opacity-100');

    fireEvent.mouseLeave(card);
    expect(pause).toHaveBeenCalled();
    expect(video).toHaveClass('opacity-0');
  });
});
