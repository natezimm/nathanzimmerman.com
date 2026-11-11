import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import Navigation from './Navigation';
import { resetAskMeta } from '@/lib/askClient';
import { ThemeProvider } from '@/contexts/ThemeContext';

const createMockElement = () => {
  const element = document.createElement('div');
  element.scrollIntoView = vi.fn();
  return element;
};

describe('Navigation', () => {
  let getElementSpy: ReturnType<typeof vi.spyOn>;
  const homeElement = createMockElement();
  const projectsElement = createMockElement();
  const contactElement = createMockElement();

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
    });
    getElementSpy = vi
      .spyOn(document, 'getElementById')
      .mockImplementation((id) => {
        if (id === 'home') return homeElement;
        if (id === 'projects') return projectsElement;
        if (id === 'contact') return contactElement;
        return null;
      });
  });

  afterEach(() => {
    getElementSpy.mockRestore();
    homeElement.scrollIntoView = vi.fn();
    projectsElement.scrollIntoView = vi.fn();
    contactElement.scrollIntoView = vi.fn();
  });

  it('scrolls when navigation items are clicked', () => {
    render(
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'NZ' }));
    expect(homeElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Projects' }));
    expect(projectsElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    });
  });

  it('reacts to scroll and opens the mobile menu', async () => {
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    render(
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    );

    const nav = screen.getByRole('navigation');

    window.scrollY = 100;
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(nav).toHaveClass('glass');
    });

    fireEvent.click(screen.getByLabelText('Toggle menu'));
    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(mobileMenu).toBeInTheDocument();
    expect(nav).toHaveClass('bg-background');
    expect(nav).not.toHaveClass('glass');

    fireEvent.click(
      within(mobileMenu).getByRole('button', { name: 'Contact' })
    );
    expect(contactElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    });
  });
});

describe('Navigation Ask link', () => {
  const renderWithMeta = (body: unknown) => {
    resetAskMeta();
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify(body), {
            headers: { 'Content-Type': 'application/json' },
          })
        )
      )
    );
    render(
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    );
  };

  afterEach(() => {
    vi.unstubAllGlobals();
    resetAskMeta();
  });

  it('links to the Ask section when the API says it is on', async () => {
    renderWithMeta({
      enabled: true,
      suggestions: [],
      counts: { files: 1, decisionRecords: 0, readmes: 1, chunks: 1 },
      repos: [],
    });

    expect(
      await screen.findByRole('button', { name: 'Ask' })
    ).toBeInTheDocument();
  });

  it('leaves the link out while Ask is paused', async () => {
    renderWithMeta({
      enabled: false,
      suggestions: [],
      counts: { files: 1, decisionRecords: 0, readmes: 1, chunks: 1 },
      repos: [],
    });

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await Promise.resolve();
    expect(screen.queryByRole('button', { name: 'Ask' })).toBeNull();
  });
});
