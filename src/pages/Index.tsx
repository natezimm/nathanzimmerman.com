import { lazy, Suspense, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { HOME_HEAD, usePageHead } from '@/lib/pageHead';
import { useAskMeta } from '@/lib/askClient';

// Its own chunk, fetched only when the API says Ask is on, so the first load does not grow.
const Ask = lazy(() => import('@/components/Ask'));

const Index = () => {
  const { hash } = useLocation();
  const arrivalHash = useRef(hash);
  usePageHead(HOME_HEAD);
  const askMeta = useAskMeta();

  // Links back from a project page land on /#projects; jump there once on
  // arrival. Later hash changes come from in-page links the browser scrolls to.
  useEffect(() => {
    const id = arrivalHash.current.slice(1);
    if (id) {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-sky-500/20 selection:text-sky-900 dark:selection:text-sky-200 relative">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to content
      </a>

      <div className="relative z-10">
        <Navigation />
        <main id="main" tabIndex={-1} className="relative focus:outline-none">
          {/* The hero's grid, continued faintly behind the rest of the page */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] opacity-75"
          />
          <Hero />
          <About />
          <Experience />
          <Projects />
          {askMeta && (
            <Suspense fallback={null}>
              <Ask meta={askMeta} />
            </Suspense>
          )}
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
