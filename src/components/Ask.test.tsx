import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Ask from './Ask';
import type { AskMeta } from '@/lib/askClient';

const meta: AskMeta = {
  enabled: true,
  suggestions: [
    'How are Know Ball guesses kept idempotent?',
    'Why does Rabbit Ears use mpv?',
  ],
  counts: { files: 40, decisionRecords: 23, readmes: 5, chunks: 231 },
  repos: [
    {
      key: 'wheelhouse',
      title: 'Wheelhouse',
      gitHub: 'https://github.com/natezimm/wheelhouse',
      commit: 'abc',
    },
  ],
};

const answer = {
  answer: 'Rabbit Ears plays streams with `mpv` [1].',
  citations: [
    {
      n: 1,
      repo: 'rabbit-ears',
      repoTitle: 'Rabbit Ears',
      path: 'docs/adr/0003-mpv.md',
      heading: 'Decision',
      url: 'https://github.com/natezimm/rabbit-ears/blob/def/docs/adr/0003-mpv.md#decision',
    },
  ],
  refused: false,
  reason: null,
};

const reply = (status: number, body: unknown) =>
  vi.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      })
    )
  );

const input = () => screen.getByRole('textbox', { name: 'Your question' });

afterEach(() => vi.unstubAllGlobals());

describe('Ask', () => {
  it('asks a suggested question and shows the answer with its sources', async () => {
    const fetchMock = reply(200, answer);
    vi.stubGlobal('fetch', fetchMock);
    render(<Ask meta={meta} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Why does Rabbit Ears use mpv?' })
    );

    expect(await screen.findByText('mpv')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/ask',
      expect.objectContaining({
        body: JSON.stringify({ question: 'Why does Rabbit Ears use mpv?' }),
      })
    );
    expect(screen.getByRole('link', { name: /ADR 0003/ })).toHaveAttribute(
      'href',
      answer.citations[0].url
    );
    expect(screen.getByText(/You asked/).parentElement).toHaveTextContent(
      'Why does Rabbit Ears use mpv?'
    );
  });

  it('submits a typed question with Enter and clears the box after an answer', async () => {
    const fetchMock = reply(200, answer);
    vi.stubGlobal('fetch', fetchMock);
    render(<Ask meta={meta} />);

    fireEvent.change(input(), { target: { value: 'Why mpv?' } });
    fireEvent.submit(input().closest('form')!);

    await screen.findByText('mpv');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(input()).toHaveValue('');
  });

  it('caps the question at 300 characters and counts them', () => {
    render(<Ask meta={meta} />);

    expect(input()).toHaveAttribute('maxlength', '300');
    expect(screen.getByText('0/300')).toBeInTheDocument();
    fireEvent.change(input(), { target: { value: 'Why mpv?' } });
    expect(screen.getByText('8/300')).toBeInTheDocument();
  });

  it('keeps the Ask button off until there is a question', () => {
    render(<Ask meta={meta} />);

    const button = screen.getByRole('button', { name: 'Ask' });
    expect(button).toBeDisabled();
    fireEvent.change(input(), { target: { value: '   ' } });
    expect(button).toBeDisabled();
    fireEvent.change(input(), { target: { value: 'Why?' } });
    expect(button).toBeEnabled();
  });

  it('says so and offers the suggestions when the docs do not cover it', async () => {
    vi.stubGlobal(
      'fetch',
      reply(200, {
        answer: '',
        citations: [],
        refused: true,
        reason: 'not_in_docs',
      })
    );
    render(<Ask meta={meta} />);

    fireEvent.change(input(), { target: { value: 'What is the weather?' } });
    fireEvent.submit(input().closest('form')!);

    expect(
      await screen.findByText(/docs don't cover that/)
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('list', { name: 'Suggested questions' })
    ).toHaveLength(1);
  });

  it('shows the paused state with links to the repos', async () => {
    vi.stubGlobal('fetch', reply(503, { refused: true, reason: 'paused' }));
    render(<Ask meta={meta} />);

    fireEvent.click(screen.getByRole('button', { name: /Know Ball/ }));

    expect(await screen.findByText(/Ask is paused/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Wheelhouse/ })).toHaveAttribute(
      'href',
      'https://github.com/natezimm/wheelhouse'
    );
  });

  it('asks the visitor to slow down after a 429', async () => {
    vi.stubGlobal('fetch', reply(429, { reason: 'rate_limited' }));
    render(<Ask meta={meta} />);

    fireEvent.click(screen.getByRole('button', { name: /Know Ball/ }));

    expect(await screen.findByText(/Wait a minute/)).toBeInTheDocument();
  });

  it('announces the answer region politely and marks it busy while loading', async () => {
    let finish: (value: Response) => void = () => {};
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>((resolve) => (finish = resolve)))
    );
    const { container } = render(<Ask meta={meta} />);
    const region = container.querySelector('[aria-live="polite"]')!;

    fireEvent.click(screen.getByRole('button', { name: /Know Ball/ }));

    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Searching the docs…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rabbit Ears/ })).toBeDisabled();

    finish(new Response(JSON.stringify(answer), { status: 200 }));
    await waitFor(() => expect(region).toHaveAttribute('aria-busy', 'false'));
  });

  it('shows how much the index holds', () => {
    render(<Ask meta={meta} />);

    expect(
      screen.getByText(
        /Searches 5 READMEs, 23 decision records and 12 other docs/
      )
    ).toBeInTheDocument();
  });
});
