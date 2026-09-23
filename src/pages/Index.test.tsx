import { afterEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from './Index';

describe('Index page', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the executive hero and primary sections', () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    // Hero check
    expect(
      screen.getByRole('heading', { name: /High-Integrity Distributed Systems/i })
    ).toBeInTheDocument();

    // Section headings check
    expect(
      screen.getByRole('heading', { name: /Systems Blueprint Console/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Engineering Dossier/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Technical Specification Matrix/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Communication Dispatch/i })
    ).toBeInTheDocument();
  });

  it('opens and closes the command palette via trigger button', () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const trigger = screen.getByRole('button', {
      name: /Open Command Palette/i,
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close via close button
    const closeBtn = screen.getByRole('button', { name: /Close command palette/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('filters results in the command palette when user searches', () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Open Command Palette/i }));
    const input = screen.getByPlaceholderText(/Ask about Nathan's experience/i);

    fireEvent.change(input, { target: { value: 'Nelnet' } });
    expect(
      screen.getByRole('heading', { name: /Nelnet — Software Engineer II/i })
    ).toBeInTheDocument();
  });

  it('toggles command palette with meta+k keydown', () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
