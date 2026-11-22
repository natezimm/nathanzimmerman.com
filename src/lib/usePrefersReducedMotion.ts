import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

// The prerendered homepage is built with motion on. Hydration starts from that
// snapshot and React then re-renders with the visitor's real setting, so the
// first client render always matches the HTML.
const getServerSnapshot = () => false;

/** True when the visitor has asked the OS for less motion. Follows changes live. */
export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
