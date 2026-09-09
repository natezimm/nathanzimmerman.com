import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App shell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders the new landing page with working project and resume destinations', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Thoughtful software. A playful mind./i,
      })
    ).toBeInTheDocument();
    for (const [name, slug] of [
      ['Sudoku', 'sudoku'],
      ['Nerdle', 'nerdle'],
      ['Blackjack', 'blackjack'],
      ['Brick Breaker', 'brick-breaker'],
    ]) {
      expect(
        screen.getByRole('link', { name: `Explore ${name}` })
      ).toHaveAttribute('href', `/projects/${slug}`);
    }
    expect(
      screen
        .getAllByRole('link', { name: /résumé|resume/i })
        .every((link) => link.getAttribute('href') === '/resume.pdf')
    ).toBe(true);
  });

  it('retains the interactive world as a reachable route', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole('link', { name: /Welcome to my world/i })
    );
    expect(window.location.pathname).toBe('/explore');
    expect(
      screen.getByRole('heading', { name: /Nathan's World/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'NATHAN ZIMMERMAN' })
    ).toHaveAttribute('href', '/');
  });

  it('closes mobile navigation on selection and Escape, returning focus to the toggle', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(toggle);
    const menu = screen.getByRole('navigation', { name: 'Mobile navigation' });
    await user.click(within(menu).getByRole('link', { name: 'Work' }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    within(menu).getByRole('link', { name: 'About' }).focus();
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('offers direct email when the hosted form is unavailable', () => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', '');
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', '');
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', '');
    render(<App />);

    expect(
      screen.getByRole('link', { name: 'Write an email' })
    ).toHaveAttribute('href', 'mailto:nathan.a.zimmerman@gmail.com');
    expect(
      screen.queryByRole('button', { name: 'Send Message' })
    ).not.toBeInTheDocument();
  });

  it('retains the contact form when its configuration is present', () => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'test-service');
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'test-template');
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'test-public-key');
    render(<App />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'type',
      'email'
    );
    expect(
      screen.getByRole('button', { name: 'Send Message' })
    ).toBeInTheDocument();
  });

  it('records resume and email interest through the existing analytics events', async () => {
    const user = userEvent.setup();
    const events: unknown[] = [];
    const recordEvent = (event: Event) => {
      events.push((event as CustomEvent).detail);
    };
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', '');
    window.addEventListener('portfolio-analytics', recordEvent);
    render(<App />);

    try {
      const links = [
        screen.getByRole('link', { name: 'Résumé', exact: true }),
        screen.getByRole('link', { name: 'Write an email' }),
        screen.getByRole('link', { name: 'GitHub', exact: true }),
      ];
      for (const link of links) {
        // Exercise each handler without opening an external app or document.
        link.addEventListener('click', (event) => event.preventDefault(), {
          once: true,
        });
        await user.click(link);
      }
      expect(events).toEqual([
        { name: 'resume_click', properties: { source: 'landing_nav' } },
        {
          name: 'contact_link_click',
          properties: { destination: 'email', source: 'landing_contact' },
        },
        {
          name: 'social_link_click',
          properties: { destination: 'github', source: 'contact' },
        },
      ]);
    } finally {
      window.removeEventListener('portfolio-analytics', recordEvent);
    }
  });

  it('renders a valid project detail route', () => {
    window.history.pushState({}, '', '/projects/nerdle');
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /NERDLE/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /BACK TO PORTFOLIO/i })
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
