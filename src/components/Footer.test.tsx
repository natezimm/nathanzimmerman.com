import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the current year', () => {
    render(<Footer />);

    const year = new Date().getFullYear().toString();
    expect(
      screen.getByText((content) => content.includes(year))
    ).toBeInTheDocument();
  });

  it('scrolls back to the top', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<Footer />);

    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    scrollTo.mockRestore();
  });
});
