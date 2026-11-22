import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = document.getElementById('root')!;

// The homepage arrives prerendered (scripts/prerender-routes.mjs), so it is
// hydrated. nginx also falls back to that same file for unknown paths, so any
// other route drops the homepage markup and renders from scratch.
if (window.location.pathname === '/' && root.hasChildNodes()) {
  hydrateRoot(root, <App />);
} else {
  root.replaceChildren();
  createRoot(root).render(<App />);
}
