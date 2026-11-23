// Build-time only: scripts/prerender-routes.mjs renders the homepage with this
// so the HTML carries the page body and src/main.tsx hydrates it.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppRoutes } from './App';

export const render = (url: string) =>
  renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  );
