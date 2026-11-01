import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProjectDetail from './ProjectDetail';

const renderAt = (path: string) =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );

describe('ProjectDetail page', () => {
  it('shows a project page with links, highlights and the architecture diagram', () => {
    renderAt('/projects/wheelhouse');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Wheelhouse' })
    ).toBeInTheDocument();
    expect(document.title).toBe('Wheelhouse · Nathan Zimmerman');

    expect(screen.getByRole('link', { name: /Try the demo/ })).toHaveAttribute(
      'href',
      'https://calendar.nathanzimmerman.com'
    );
    expect(screen.getByRole('link', { name: /^Code$/ })).toHaveAttribute(
      'href',
      'https://github.com/natezimm/wheelhouse'
    );
    screen.getByRole('link', { name: /Try the demo/ }).click();
    screen.getByRole('link', { name: /Architecture docs/ }).click();

    expect(
      screen.getByRole('heading', { name: 'Engineering highlights' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /proxies to the ASP.NET Core API/ })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Screen recording of Wheelhouse')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Next: Know Ball/ })
    ).toHaveAttribute('href', '/projects/know-ball/');
  });

  it('calls a game playable and wraps to the first project', () => {
    renderAt('/projects/brick-breaker');

    expect(screen.getByRole('link', { name: /Play it/ })).toHaveAttribute(
      'href',
      'https://resume.nathanzimmerman.com'
    );
    expect(
      screen.getByRole('link', { name: /Next: Wheelhouse/ })
    ).toHaveAttribute('href', '/projects/wheelhouse/');
  });

  it('shows the not found page for a retired or unknown project', () => {
    renderAt('/projects/nerdle');

    expect(screen.queryByRole('heading', { name: 'Nerdle' })).toBeNull();
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
  });
});
