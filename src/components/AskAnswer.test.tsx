import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import AskAnswer from './AskAnswer';

const citation = {
  n: 1,
  repo: 'wheelhouse',
  repoTitle: 'Wheelhouse',
  path: 'docs/adr/0002-family-isolation.md',
  heading: 'Decision',
  url: 'https://github.com/natezimm/wheelhouse/blob/abc/docs/adr/0002-family-isolation.md#decision',
};

describe('AskAnswer', () => {
  it('renders paragraphs, bullets, inline code and source markers', () => {
    const { container } = render(
      <AskAnswer
        answer={
          'Every table implements `IFamilyOwned` [1].\n\n- Seeders call `IgnoreQueryFilters()` [1, 2].\n- Tests check it [2].'
        }
        citations={[citation]}
      />
    );

    expect(container.querySelectorAll('p')).toHaveLength(1);
    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('IFamilyOwned').tagName).toBe('CODE');
    expect(screen.getByLabelText('sources 1, 2')).toHaveTextContent('1,2');
    expect(container.textContent).not.toContain('[1]');
  });

  it('links each source chip to GitHub in a new tab', () => {
    render(<AskAnswer answer="Yes [1]." citations={[citation]} />);

    const link = within(
      screen.getByRole('list', { name: 'Sources' })
    ).getByRole('link');
    expect(link).toHaveAttribute('href', citation.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveTextContent('ADR 0002 · Decision');
    expect(link).toHaveTextContent('Wheelhouse');
  });

  it('shows markup from the model as text', () => {
    const { container } = render(
      <AskAnswer
        answer={'<script>alert(1)</script> <b>bold</b> [1]'}
        citations={[]}
      />
    );

    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('b')).toBeNull();
    expect(container.textContent).toContain('<script>alert(1)</script>');
  });
});
