import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App shell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('renders the index route', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Nathan's World/i })
    ).toBeInTheDocument();
  });

  it('renders a valid project detail route', () => {
    window.history.pushState({}, '', '/projects/nerdle');
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /NERDLE/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /BACK TO NATHAN'S WORLD/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Word puzzle game inspired by Wordle/i)
    ).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  });

  it('shows not found behavior for unknown project slug', () => {
    window.history.pushState({}, '', '/projects/unknown-project');
    render(<App />);

    expect(screen.getByText(/Oops! Page not found/i)).toBeInTheDocument();
  });
});
