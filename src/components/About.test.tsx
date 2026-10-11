import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About section', () => {
  it('renders the key skills', () => {
    render(<About />);

    const skillHeadings = [
      'Full-Stack Development',
      'Backend & Architecture',
      'Cloud & DevOps',
      'Team Collaboration',
    ];

    skillHeadings.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it('groups the capability cards so they share one cursor spotlight', () => {
    const { container } = render(<About />);

    const group = container.querySelector('.spotlight-group');
    expect(group?.querySelectorAll('.spotlight-card')).toHaveLength(4);
    expect(screen.getByText('how people think')).toBeInTheDocument();
  });
});
