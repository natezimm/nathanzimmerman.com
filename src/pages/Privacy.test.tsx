import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Privacy from './Privacy';
import { ThemeProvider } from '@/contexts/ThemeContext';

describe('Privacy page', () => {
  it('says what each feature sends and sets its own head', () => {
    window.scrollTo = vi.fn();
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Privacy />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Privacy' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Ask my portfolio' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The server stores no questions/)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'EmailJS' })).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    );
    expect(document.title).toBe('Privacy · Nathan Zimmerman');
    expect(
      document.head.querySelector('link[rel="canonical"]')
    ).toHaveAttribute('href', 'https://nathanzimmerman.com/privacy/');
  });
});
