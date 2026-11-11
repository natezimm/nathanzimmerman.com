import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionCaption } from '@/components/shared/SectionCaption';
import { ScrollReveal } from '@/components/ScrollReveal';
import AskAnswer from '@/components/AskAnswer';
import {
  MAX_QUESTION_CHARS,
  askQuestion,
  type AskMeta,
  type AskProblem,
  type AskResult,
} from '@/lib/askClient';
import { trackPortfolioEvent } from '@/lib/analytics';

const PROBLEM_TEXT: Record<AskProblem, string> = {
  not_in_docs: "The docs don't cover that, so I won't guess. Try one of these:",
  declined: "That isn't something I'll answer from the docs. Try one of these:",
  incomplete:
    "The answer didn't come out right. Try a narrower question, or one of these:",
  paused: 'Ask is paused right now. The docs are all on GitHub:',
  budget:
    "Today's question budget is spent, so Ask is resting until tomorrow. The docs are all on GitHub:",
  unavailable:
    "The model didn't answer in time. Try again in a moment, or read the docs on GitHub:",
  rate_limited:
    "That's more questions than the limit allows. Wait a minute and try again.",
  error: 'Something went wrong sending that. Try again in a moment.',
};

/** Problems where another question might work; the rest point at the repos instead. */
const SUGGEST_AFTER: readonly AskProblem[] = [
  'not_in_docs',
  'declined',
  'incomplete',
];
const REPOS_AFTER: readonly AskProblem[] = ['paused', 'budget', 'unavailable'];

type Exchange = { question: string; result: AskResult | null };

const chipClassName =
  'rounded-full border border-dashed border-slate-300 dark:border-white/15 px-3.5 py-1.5 text-left text-xs sm:text-sm text-foreground/75 transition-colors hover:border-sky-500/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50';

const Ask = ({ meta }: { meta: AskMeta }) => {
  const [question, setQuestion] = useState('');
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const request = useRef<AbortController | null>(null);
  const inputId = useId();
  const hintId = useId();
  const loading = exchange !== null && exchange.result === null;

  useEffect(() => {
    // The section appears after the page has loaded, too late for the browser to follow a /#ask link.
    if (window.location.hash === '#ask')
      document.getElementById('ask')?.scrollIntoView();
    return () => request.current?.abort();
  }, []);

  const ask = async (text: string, source: 'typed' | 'suggestion') => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_QUESTION_CHARS || loading) return;

    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setExchange({ question: trimmed, result: null });
    trackPortfolioEvent('ask_submit', { source });

    try {
      const result = await askQuestion(trimmed, controller.signal);
      if (controller.signal.aborted) return;
      setExchange({ question: trimmed, result });
      trackPortfolioEvent('ask_result', {
        outcome: result.kind === 'answer' ? 'answer' : result.problem,
      });
      // Clear the box only if the visitor hasn't started a new question while this one loaded.
      if (result.kind === 'answer')
        setQuestion((current) => (current === text ? '' : current));
    } catch {
      // Aborted: a newer question or leaving the page replaced this one.
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void ask(question, 'typed');
  };

  const { counts } = meta;
  const otherDocs = Math.max(
    0,
    counts.files - counts.decisionRecords - counts.readmes
  );
  const result = exchange?.result;
  const problem = result?.kind === 'problem' ? result.problem : null;

  const suggestions = (
    <ul className="flex flex-wrap gap-2" aria-label="Suggested questions">
      {meta.suggestions.map((suggestion) => (
        <li key={suggestion}>
          <button
            type="button"
            className={chipClassName}
            disabled={loading}
            onClick={() => {
              setQuestion(suggestion);
              void ask(suggestion, 'suggestion');
            }}
          >
            {suggestion}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      id="ask"
      aria-labelledby="ask-heading"
      className="py-16 md:py-20 relative overflow-hidden scroll-mt-4"
    >
      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="mb-10">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-cyan-400">
              Ask about my work
            </p>
            <h2
              id="ask-heading"
              className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight"
            >
              Questions about a project?{' '}
              <span className="gradient-text">Ask the docs.</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Answers come only from the READMEs, architecture notes and
              decision records in my repositories, with a link to every source.
            </p>
          </ScrollReveal>

          <ScrollReveal className="mb-4">
            <SectionCaption
              command="grep -r docs/ ~/repos"
              meta={`${meta.repos.length} repos · ${counts.files} docs`}
            />
          </ScrollReveal>

          <div className="glass-card rounded-2xl border border-slate-200/90 dark:border-white/10 p-4 sm:p-6 shadow-sm space-y-6">
            <div aria-live="polite" aria-busy={loading} className="space-y-5">
              {exchange && (
                <>
                  <p className="ml-auto w-fit max-w-[90%] rounded-2xl bg-slate-100 dark:bg-white/10 px-4 py-2.5 text-sm sm:text-base break-words">
                    <span className="sr-only">You asked: </span>
                    {exchange.question}
                  </p>

                  {loading && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full bg-sky-500 animate-pulse motion-reduce:animate-none"
                      />
                      Searching the docs…
                    </p>
                  )}

                  {result?.kind === 'answer' && (
                    <AskAnswer
                      answer={result.answer}
                      citations={result.citations}
                    />
                  )}

                  {problem && (
                    <div className="space-y-3">
                      <p className="text-sm sm:text-base text-foreground/85">
                        {PROBLEM_TEXT[problem]}
                      </p>
                      {SUGGEST_AFTER.includes(problem) && suggestions}
                      {REPOS_AFTER.includes(problem) && (
                        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                          {meta.repos.map((repo) => (
                            <li key={repo.key}>
                              <a
                                href={repo.gitHub}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-4"
                              >
                                {repo.title}
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <form onSubmit={onSubmit} className="space-y-2">
              <label htmlFor={inputId} className="sr-only">
                Your question
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-background/70 p-1.5 pl-3 focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={inputId}
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={MAX_QUESTION_CHARS}
                  placeholder="Ask about Wheelhouse, Know Ball, Rabbit Ears…"
                  aria-describedby={hintId}
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading || question.trim() === ''}
                  className="rounded-lg px-4"
                >
                  Ask
                </Button>
              </div>
              <div
                id={hintId}
                className="flex flex-wrap justify-between gap-x-4 gap-y-1 px-1 text-xs text-muted-foreground"
              >
                <span>
                  Your question goes to Anthropic&apos;s Claude API to write the
                  answer. Nothing is stored.
                </span>
                <span>
                  {question.length}/{MAX_QUESTION_CHARS}
                </span>
              </div>
            </form>

            {!(problem && SUGGEST_AFTER.includes(problem)) && suggestions}

            <p className="border-t border-border/40 pt-4 text-xs text-muted-foreground">
              Searches {counts.readmes} READMEs, {counts.decisionRecords}{' '}
              decision records and {otherDocs} other docs. Not in the docs? It
              says so instead of guessing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ask;
