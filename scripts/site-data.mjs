// Loads the project list from src/data/portfolioData.ts, and each page's head
// from src/lib/pageHead.ts, through Vite, so the build scripts write what the
// app shows.
import path from 'node:path';
import { createServer } from 'vite';

const root = path.resolve(import.meta.dirname, '..');

export const SITE_URL = 'https://nathanzimmerman.com';

export async function loadProjects() {
  const server = await createServer({
    root,
    configFile: path.join(root, 'vite.config.ts'),
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    logLevel: 'error',
  });
  try {
    const data = await server.ssrLoadModule('/src/data/portfolioData.ts');
    const { projectHead } = await server.ssrLoadModule('/src/lib/pageHead.ts');
    // Asset imports resolve to root-relative paths such as
    // /src/assets/project-wheelhouse.webp.
    return data.projectEntries.map((p) => ({
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      summary: p.summary,
      image: p.image.replace(/^\//, ''),
      // The title, description, path and picture the app sets on this page.
      head: projectHead(p),
    }));
  } finally {
    await server.close();
  }
}
