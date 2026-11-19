import { useEffect, useState } from 'react';

/** The longest question the API accepts (AskEndpoints.MaxQuestionChars). */
export const MAX_QUESTION_CHARS = 300;

export const ASK_PATH = '/api/ask';

export type AskCitation = {
  n: number;
  repo: string;
  repoTitle: string;
  path: string;
  heading: string;
  url: string;
};

export type AskMeta = {
  enabled: boolean;
  suggestions: string[];
  counts: {
    files: number;
    decisionRecords: number;
    readmes: number;
    chunks: number;
  };
  repos: { key: string; title: string; gitHub: string; commit: string }[];
};

/** Why a question got no answer, as the API names it, plus `error` for anything the API did not explain. */
export type AskProblem =
  | 'not_in_docs'
  | 'declined'
  | 'incomplete'
  | 'paused'
  | 'budget'
  | 'unavailable'
  | 'rate_limited'
  | 'error';

export type AskResult =
  | { kind: 'answer'; answer: string; citations: AskCitation[] }
  | { kind: 'problem'; problem: AskProblem };

/** "ADR 0002" for a decision record, "README" for a readme, otherwise the path. */
export const sourceLabel = (path: string) => {
  const file = path.split('/').pop() ?? path;
  const adr = /^(\d{4})-/.exec(file);
  if (adr && path.includes('adr/')) return `ADR ${adr[1]}`;
  if (/^readme\.md$/i.test(file)) return path.includes('/') ? path : 'README';
  return path;
};

const PROBLEMS: readonly AskProblem[] = [
  'not_in_docs',
  'declined',
  'incomplete',
  'paused',
  'budget',
  'unavailable',
  'rate_limited',
];

const asProblem = (reason: unknown, fallback: AskProblem): AskProblem =>
  PROBLEMS.includes(reason as AskProblem) ? (reason as AskProblem) : fallback;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/** Citations link only to GitHub, whatever the response says. */
const isCitation = (value: unknown): value is AskCitation =>
  isRecord(value) &&
  typeof value.n === 'number' &&
  typeof value.repoTitle === 'string' &&
  typeof value.path === 'string' &&
  typeof value.heading === 'string' &&
  typeof value.url === 'string' &&
  value.url.startsWith('https://github.com/');

const isMeta = (value: unknown): value is AskMeta =>
  isRecord(value) &&
  typeof value.enabled === 'boolean' &&
  Array.isArray(value.suggestions) &&
  value.suggestions.every((s) => typeof s === 'string') &&
  isRecord(value.counts) &&
  Array.isArray(value.repos);

const readJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

/**
 * Asks one question. Never throws for a failed request: every outcome is a result the section can show.
 * A 502 means the container is down, which the section shows the same way as the kill switch.
 */
export const askQuestion = async (
  question: string,
  signal?: AbortSignal
): Promise<AskResult> => {
  let response: Response;
  try {
    response = await fetch(ASK_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question.trim() }),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    return { kind: 'problem', problem: 'error' };
  }

  if (response.status === 429)
    return { kind: 'problem', problem: 'rate_limited' };
  if (response.status === 502) return { kind: 'problem', problem: 'paused' };

  const body = await readJson(response);
  if (response.status === 503 || response.status === 504) {
    const fallback = response.status === 503 ? 'paused' : 'unavailable';
    return {
      kind: 'problem',
      problem: asProblem(isRecord(body) ? body.reason : null, fallback),
    };
  }

  if (!response.ok || !isRecord(body))
    return { kind: 'problem', problem: 'error' };
  if (body.refused === true)
    return { kind: 'problem', problem: asProblem(body.reason, 'not_in_docs') };
  if (typeof body.answer !== 'string' || body.answer.trim() === '')
    return { kind: 'problem', problem: 'error' };

  const citations = Array.isArray(body.citations)
    ? body.citations.filter(isCitation)
    : [];
  return { kind: 'answer', answer: body.answer, citations };
};

/** The section's settings, or null when the API is off, missing or answers with something else. */
export const fetchAskMeta = async (): Promise<AskMeta | null> => {
  try {
    const response = await fetch(`${ASK_PATH}/meta`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const body = await readJson(response);
    return isMeta(body) ? body : null;
  } catch {
    return null;
  }
};

let metaRequest: Promise<AskMeta | null> | null = null;

/** One meta request per page load, shared by the nav link and the section. */
export const loadAskMeta = () => (metaRequest ??= fetchAskMeta());

/** For tests: forget the shared meta request. */
export const resetAskMeta = () => {
  metaRequest = null;
};

/** The meta when Ask is switched on, otherwise null (also while it loads, so nothing flashes). */
export const useAskMeta = (): AskMeta | null => {
  const [meta, setMeta] = useState<AskMeta | null>(null);
  useEffect(() => {
    let live = true;
    loadAskMeta().then((result) => {
      if (live) setMeta(result?.enabled ? result : null);
    });
    return () => {
      live = false;
    };
  }, []);
  return meta;
};
