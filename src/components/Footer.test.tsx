import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the current year', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const year = new Date().getFullYear().toString();
    expect(
      screen.getByText((content) => content.includes(year))
    ).toBeInTheDocument();
  });

  it('scrolls back to the top', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    scrollTo.mockRestore();
  });
});
