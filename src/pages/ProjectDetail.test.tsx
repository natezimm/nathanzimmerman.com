import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProjectDetail from './ProjectDetail';

describe('ProjectDetail page', () => {
  it('renders project with light background and handles external link clicks', () => {
    render(
      <MemoryRouter initialEntries={['/projects/nerdle']}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /NERDLE/i })
    ).toBeInTheDocument();

    const liveLink = screen.getByRole('link', { name: /VIEW LIVE/i });
    expect(liveLink).toBeInTheDocument();
    liveLink.click();

    const codeLink = screen.getByRole('link', { name: /VIEW CODE/i });
    expect(codeLink).toBeInTheDocument();
    codeLink.click();

    const resumeLink = screen.getByRole('link', { name: /RESUME/i });
    expect(resumeLink).toBeInTheDocument();
    resumeLink.click();
  });

  it('renders project with dark background', () => {
    render(
      <MemoryRouter initialEntries={['/projects/blackjack']}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /BLACKJACK/i })
    ).toBeInTheDocument();
  });
});
