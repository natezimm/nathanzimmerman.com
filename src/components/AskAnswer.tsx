import type { ReactNode } from 'react';
import { sourceLabel, type AskCitation } from '@/lib/askClient';

/**
 * The model may write plain sentences, "- " bullets, `inline code` and [n] source markers, nothing else.
 * Everything is rendered as React text nodes: no HTML from the answer ever reaches the page.
 */
const INLINE = /(`[^`\n]+`|\[\s*\d+(?:\s*,\s*\d+)*\s*\])/g;

const renderInline = (text: string, key: string): ReactNode[] =>
  text
    // "family [1]." reads as "family¹." with the marker against its word.
    .replace(/\s+(?=\[\s*\d)/g, '')
    .split(INLINE)
    .filter((part) => part !== '')
    .map((part, i) => {
      const id = `${key}-${i}`;
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={id}
            className="rounded bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      const marker = /^\[\s*(\d+(?:\s*,\s*\d+)*)\s*\]$/.exec(part);
      if (marker) {
        const numbers = marker[1].split(',').map((n) => n.trim());
        return (
          <sup
            key={id}
            className="ml-0.5 font-semibold text-sky-600 dark:text-cyan-400"
            aria-label={`source${numbers.length > 1 ? 's' : ''} ${numbers.join(', ')}`}
          >
            {numbers.join(',')}
          </sup>
        );
      }
      return part;
    });

type Block = { kind: 'p'; text: string } | { kind: 'ul'; items: string[] };

const BULLET = /^\s*[-*•]\s+/;

const toBlocks = (answer: string): Block[] => {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ kind: 'p', text: paragraph.join(' ') });
    paragraph = [];
  };
  for (const line of answer.split('\n')) {
    if (BULLET.test(line)) {
      flush();
      const item = line.replace(BULLET, '').trim();
      const last = blocks[blocks.length - 1];
      if (last?.kind === 'ul') last.items.push(item);
      else blocks.push({ kind: 'ul', items: [item] });
    } else if (line.trim() === '') {
      flush();
    } else {
      paragraph.push(line.trim());
    }
  }
  flush();
  return blocks;
};

export const AskAnswerText = ({ answer }: { answer: string }) => (
  <div className="space-y-3 text-[0.95rem] leading-relaxed text-foreground/90">
    {toBlocks(answer).map((block, i) =>
      block.kind === 'p' ? (
        <p key={i}>{renderInline(block.text, `p${i}`)}</p>
      ) : (
        <ul key={i} className="list-disc space-y-1.5 pl-5">
          {block.items.map((item, j) => (
            <li key={j}>{renderInline(item, `l${i}-${j}`)}</li>
          ))}
        </ul>
      )
    )}
  </div>
);

export const AskCitations = ({ citations }: { citations: AskCitation[] }) => {
  if (citations.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Sources">
      {citations.map((citation) => (
        <li key={citation.n} className="max-w-full">
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 px-3 py-1.5 text-xs text-foreground/90 transition-colors hover:border-sky-500/50 hover:text-primary dark:hover:border-cyan-400/40"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-[10px] font-semibold text-sky-700 dark:text-cyan-300">
              {citation.n}
            </span>
            <span className="truncate">
              {sourceLabel(citation.path)}
              {citation.heading && ` · ${citation.heading}`}
            </span>
            <span className="shrink-0 text-muted-foreground">
              {citation.repoTitle}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

const AskAnswer = ({
  answer,
  citations,
}: {
  answer: string;
  citations: AskCitation[];
}) => (
  <div className="flex gap-3 sm:gap-4">
    <div
      aria-hidden="true"
      className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-xs font-bold text-white"
    >
      NZ
    </div>
    <div className="min-w-0 flex-1 space-y-4">
      <AskAnswerText answer={answer} />
      <AskCitations citations={citations} />
    </div>
  </div>
);

export default AskAnswer;
