import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Experience from './Experience';

describe('Experience section', () => {
  it('renders resume timeline entries', () => {
    render(<Experience />);

    expect(
      screen.getByRole('heading', { name: /EXPERIENCE/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Software Engineer II')).toBeInTheDocument();
    expect(screen.getByText('Nelnet')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Built payment-plan and billing workflows across .NET microservices and Angular UI.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Software Development Engineer')
    ).toBeInTheDocument();
    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(
      screen.getByText('Delivered customer-facing mortgage platform features.')
    ).toBeInTheDocument();
  });

  it('draws the career as a git graph with one lane segment per role', () => {
    render(<Experience />);

    expect(screen.getByText('5 commits · 1 branch switch')).toBeInTheDocument();
    expect(screen.getByText('HEAD → main')).toBeInTheDocument();
    expect(screen.getAllByTestId('career-lane')).toHaveLength(3);
    expect(screen.getByText('git checkout -b engineering')).toBeInTheDocument();
  });

  it('shows the path before engineering below the branch point', () => {
    render(<Experience />);

    expect(
      screen.getByRole('heading', { name: 'Before engineering' })
    ).toBeInTheDocument();
    expect(screen.getByText('Special education teacher')).toBeInTheDocument();
    expect(screen.getByText('Studied psychology')).toBeInTheDocument();
  });
});
