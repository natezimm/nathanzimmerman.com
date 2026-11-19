import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import { PRIVACY_HEAD, usePageHead } from '@/lib/pageHead';

const linkClass =
  'text-primary underline underline-offset-4 hover:text-primary/80';

const External = ({ href, children }: { href: string; children: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={linkClass}
  >
    {children}
  </a>
);

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  usePageHead(PRIVACY_HEAD);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-10 md:py-14">
        <article className="mx-auto max-w-2xl space-y-8 leading-relaxed text-foreground/85">
          <header className="space-y-3">
            <h1 className="text-4xl font-bold font-heading tracking-tight text-foreground">
              Privacy
            </h1>
            <p className="text-lg text-muted-foreground">
              This site has no accounts, sets no cookies and runs no analytics.
              Two features send what you type to an outside service, and this
              page says exactly what goes where.
            </p>
          </header>

          <section className="space-y-3" aria-labelledby="privacy-ask">
            <h2
              id="privacy-ask"
              className="text-2xl font-semibold font-heading text-foreground"
            >
              Ask my portfolio
            </h2>
            <p>
              When you ask a question, the site&apos;s server finds the most
              relevant passages in the public READMEs, architecture notes and
              decision records of my GitHub repositories, then sends your
              question and those passages to Anthropic&apos;s Claude API to
              write the answer. Nothing else about you goes with it: no name, no
              cookie, no IP address.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>The server stores no questions.</strong> Its logs record
                only whether a question was answered, how many tokens it used
                and how long it took.
              </li>
              <li>
                <strong>Your IP address</strong> is kept in the server&apos;s
                memory for a day at most, to enforce the per-visitor limit of 5
                questions a minute and 30 a day, and is gone when the server
                restarts. It is never written to disk or sent to Anthropic.
              </li>
              <li>
                <strong>Anthropic</strong> receives the question under its
                commercial terms. It does not train models on API inputs or
                outputs by default and deletes them within 30 days, unless a
                question is flagged under its usage policy. See{' '}
                <External href="https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data">
                  how long Anthropic stores API data
                </External>{' '}
                and{' '}
                <External href="https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training">
                  whether it trains on it
                </External>
                .
              </li>
              <li>
                Please don&apos;t put anything personal in a question; it only
                needs to be about my projects.
              </li>
            </ul>
          </section>

          <section className="space-y-3" aria-labelledby="privacy-contact">
            <h2
              id="privacy-contact"
              className="text-2xl font-semibold font-heading text-foreground"
            >
              The contact form
            </h2>
            <p>
              The form sends your name, email address and message from your
              browser through{' '}
              <External href="https://www.emailjs.com/legal/privacy-policy/">
                EmailJS
              </External>{' '}
              to my inbox. This site keeps no copy; the email itself stays in my
              inbox so I can reply.
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="privacy-other">
            <h2
              id="privacy-other"
              className="text-2xl font-semibold font-heading text-foreground"
            >
              Everything else
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Your light or dark theme choice is saved in your browser&apos;s
                local storage and never leaves it.
              </li>
              <li>
                Fonts load from Google Fonts, so your browser asks Google&apos;s
                servers for them.
              </li>
              <li>
                The web server keeps standard access logs (IP address, page and
                time) to keep the site running.
              </li>
            </ul>
            <p>
              Questions about any of this? Use the{' '}
              <Link
                to={{ pathname: '/', hash: '#contact' }}
                className={linkClass}
              >
                contact form
              </Link>
              .
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
