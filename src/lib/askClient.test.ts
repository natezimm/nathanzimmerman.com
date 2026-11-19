import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  askQuestion,
  fetchAskMeta,
  loadAskMeta,
  resetAskMeta,
  sourceLabel,
} from './askClient';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const stubFetch = (response: Response | Error) => {
  const fetchMock = vi.fn(() =>
    response instanceof Error
      ? Promise.reject(response)
      : Promise.resolve(response)
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const citation = {
  n: 1,
  repo: 'wheelhouse',
  repoTitle: 'Wheelhouse',
  path: 'docs/adr/0002-family-isolation.md',
  heading: 'Decision',
  url: 'https://github.com/natezimm/wheelhouse/blob/abc/docs/adr/0002-family-isolation.md#decision',
};

const meta = {
  enabled: true,
  suggestions: ['Why mpv?'],
  counts: { files: 40, decisionRecords: 23, readmes: 5, chunks: 231 },
  repos: [],
};

afterEach(() => {
  vi.unstubAllGlobals();
  resetAskMeta();
});

describe('askQuestion', () => {
  it('posts the trimmed question as JSON', async () => {
    const fetchMock = stubFetch(
      json(200, { answer: 'Yes [1].', citations: [citation], refused: false })
    );

    const result = await askQuestion('  Why mpv?  ');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/ask',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'Why mpv?' }),
      })
    );
    expect(result).toEqual({
      kind: 'answer',
      answer: 'Yes [1].',
      citations: [citation],
    });
  });

  it('drops citations that do not link to GitHub', async () => {
    stubFetch(
      json(200, {
        answer: 'Yes [1].',
        citations: [
          citation,
          { ...citation, n: 2, url: 'javascript:alert(1)' },
        ],
        refused: false,
      })
    );

    const result = await askQuestion('q');

    expect(result.kind === 'answer' && result.citations).toEqual([citation]);
  });

  it.each([
    [
      200,
      { answer: '', citations: [], refused: true, reason: 'not_in_docs' },
      'not_in_docs',
    ],
    [
      200,
      { answer: '', citations: [], refused: true, reason: 'declined' },
      'declined',
    ],
    [
      200,
      { answer: '', citations: [], refused: true, reason: 'nonsense' },
      'not_in_docs',
    ],
    [503, { refused: true, reason: 'budget' }, 'budget'],
    [503, { refused: true, reason: 'unavailable' }, 'unavailable'],
    [503, 'not json', 'paused'],
    [502, null, 'paused'],
    [504, null, 'unavailable'],
    [429, { reason: 'rate_limited' }, 'rate_limited'],
    [403, null, 'error'],
    [200, { answer: '   ', citations: [] }, 'error'],
  ])('maps %i %j to %s', async (status, body, problem) => {
    stubFetch(json(status, body));
    expect(await askQuestion('q')).toEqual({ kind: 'problem', problem });
  });

  it('reports a network failure as an error', async () => {
    stubFetch(new TypeError('offline'));
    expect(await askQuestion('q')).toEqual({
      kind: 'problem',
      problem: 'error',
    });
  });

  it('rethrows when the caller aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    stubFetch(Object.assign(new Error('aborted'), { name: 'AbortError' }));
    await expect(askQuestion('q', controller.signal)).rejects.toThrow();
  });
});

describe('fetchAskMeta', () => {
  it('returns the meta', async () => {
    stubFetch(json(200, meta));
    expect(await fetchAskMeta()).toEqual(meta);
  });

  it('returns null for an HTML fallback page, an error or a failure', async () => {
    stubFetch(new Response('<!doctype html>', { status: 200 }));
    expect(await fetchAskMeta()).toBeNull();
    stubFetch(json(500, {}));
    expect(await fetchAskMeta()).toBeNull();
    stubFetch(json(200, { enabled: 'yes' }));
    expect(await fetchAskMeta()).toBeNull();
    stubFetch(new TypeError('offline'));
    expect(await fetchAskMeta()).toBeNull();
  });

  it('is requested once per page load', async () => {
    const fetchMock = stubFetch(json(200, meta));
    await Promise.all([loadAskMeta(), loadAskMeta()]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('sourceLabel', () => {
  it.each([
    ['docs/adr/0002-family-isolation.md', 'ADR 0002'],
    ['README.md', 'README'],
    ['api/README.md', 'api/README.md'],
    ['docs/security.md', 'docs/security.md'],
  ])('labels %s as %s', (path, label) => {
    expect(sourceLabel(path)).toBe(label);
  });
});
