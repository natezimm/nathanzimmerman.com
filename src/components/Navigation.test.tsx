import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import Navigation from './Navigation';
import { ThemeProvider } from '@/contexts/ThemeContext';

const SECTION_IDS = ['home', 'about', 'experience', 'projects', 'contact'];

const renderNavigation = () =>
  render(
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );

describe('Navigation', () => {
  let observerCallback: IntersectionObserverCallback | undefined;
  const originalObserver = window.IntersectionObserver;

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    SECTION_IDS.forEach((id) => {
      const section = document.createElement('section');
      section.id = id;
      document.body.appendChild(section);
    });
    window.IntersectionObserver = vi.fn(function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback
    ) {
      observerCallback = callback;
      return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    SECTION_IDS.forEach((id) => document.getElementById(id)?.remove());
    window.IntersectionObserver = originalObserver;
    observerCallback = undefined;
  });

  it('links each item to its section and names the landmark', () => {
    renderNavigation();

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(
      within(nav).getByRole('link', { name: 'Nathan Zimmerman, back to top' })
    ).toHaveAttribute('href', '#home');
    expect(within(nav).getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'href',
      '#projects'
    );
  });

  it('marks the section in view as the current location', () => {
    renderNavigation();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'location'
    );

    act(() => {
      observerCallback?.(
        [
          {
            isIntersecting: true,
            target: document.getElementById('experience'),
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'aria-current',
      'location'
    );
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('turns glassy on scroll and opens and closes the mobile menu', async () => {
    renderNavigation();
    const nav = screen.getByRole('navigation');

    window.scrollY = 100;
    fireEvent.scroll(window);
    await waitFor(() => expect(nav).toHaveClass('glass'));

    const toggle = screen.getByRole('button', { name: 'Toggle menu' });
    fireEvent.click(toggle);
    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(toggle).toHaveAttribute('aria-controls', mobileMenu.id);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(nav).toHaveClass('bg-background');
    expect(nav).not.toHaveClass('glass');

    fireEvent.click(within(mobileMenu).getByRole('link', { name: 'Contact' }));
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('closes the mobile menu on Escape and returns focus to its button', () => {
    renderNavigation();
    const toggle = screen.getByRole('button', { name: 'Toggle menu' });

    fireEvent.click(toggle);
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });
});
