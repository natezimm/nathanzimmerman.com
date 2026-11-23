#!/usr/bin/env node
// Runs after `vite build`. The site is a single-page app, so every route used
// to get the home page's HTML, including a canonical link back to "/", which
// tells search engines each project page is a copy of the home page.
//
// It also renders the homepage body into dist/index.html with the server build
// of src/entry-server.tsx (dist-ssr/), so text paints before the JavaScript
// runs and the page reads without it; src/main.tsx hydrates that markup.
//
// This writes dist/projects/<slug>/index.html for each project, and
// dist/privacy/index.html, each with its own title, description, canonical
// link and Open Graph tags, and a sitemap that lists exactly those pages. Project URLs end in a slash: nginx's
// `try_files $uri $uri/ /index.html` serves /projects/<slug>/index.html for
// /projects/<slug>/ and redirects /projects/<slug> there, so the slash form is
// the canonical one and the app links to it. The React app then takes over.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { SITE_URL, loadProjects } from './site-data.mjs';

const dist = path.resolve(import.meta.dirname, '../dist');
const shell = await readFile(path.join(dist, 'index.html'), 'utf8');
const projects = await loadProjects();

const escape = (text) =>
  text.replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  );

// Each pattern must match the shell exactly once, so a renamed tag in
// index.html fails the build instead of shipping a page with the home page's
// canonical link.
const replaceOnce = (html, pattern, replacement) => {
  let matches = 0;
  const result = html.replace(pattern, () => {
    matches += 1;
    return replacement;
  });
  if (matches !== 1) {
    throw new Error(
      `Expected one match for ${pattern} in dist/index.html, found ${matches}`
    );
  }
  return result;
};

const tag = (attr, key) =>
  new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`, 'g');

// The privacy page's head; src/lib/pageHead.ts has the same PRIVACY_HEAD for moves inside the app.
const PRIVACY_HEAD = {
  title: 'Privacy · Nathan Zimmerman',
  description:
    'What nathanzimmerman.com sends where: Ask my portfolio questions go to the Claude API, contact messages go through EmailJS, and the site stores neither.',
  path: '/privacy/',
  image: '/og-image.jpg',
};

const pageFor = (head, altText, type = 'article') => {
  const url = `${SITE_URL}${head.path}`;
  const title = escape(head.title);
  const description = escape(head.description);
  const image = `${SITE_URL}${head.image}`;
  const alt = escape(altText);

  let html = shell;
  html = replaceOnce(html, /<title>[^<]*<\/title>/g, `<title>${title}</title>`);
  html = replaceOnce(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/g,
    `<link rel="canonical" href="${url}" />`
  );
  for (const [attr, key, value] of [
    ['name', 'description', description],
    ['property', 'og:type', type],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', url],
    ['property', 'og:image', image],
    ['property', 'og:image:alt', alt],
  ]) {
    html = replaceOnce(
      html,
      tag(attr, key),
      `<meta ${attr}="${key}" content="${value}" />`
    );
  }
  return html;
};

for (const project of projects) {
  const dir = path.join(dist, 'projects', project.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, 'index.html'),
    pageFor(project.head, `${project.title}: ${project.tagline}`)
  );
}

await mkdir(path.join(dist, 'privacy'), { recursive: true });
await writeFile(
  path.join(dist, 'privacy', 'index.html'),
  pageFor(
    PRIVACY_HEAD,
    'Nathan Zimmerman, software engineer, with screenshots of Wheelhouse, Know Ball, Rabbit Ears and Brick Breaker Resume.',
    'website'
  )
);

// Homepage last: the pages above are built from the shell with an empty root.
const ssrDir = path.resolve(import.meta.dirname, '../dist-ssr');
const { render } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);
const body = render('/');
if (!body.includes('id="experience"')) {
  throw new Error('Prerendered homepage is missing its sections');
}
// Scroll reveals start hidden until JavaScript sees them; without JavaScript
// they would stay hidden, so show them.
const noscriptReveal =
  '<noscript><style>#root [style*="opacity:0"]{opacity:1!important;transform:none!important}</style></noscript>';
await writeFile(
  path.join(dist, 'index.html'),
  replaceOnce(
    replaceOnce(
      shell,
      /<div id="root"><\/div>/g,
      `<div id="root">${body}</div>`
    ),
    /<\/head>/g,
    `${noscriptReveal}</head>`
  )
);
await rm(ssrDir, { recursive: true, force: true });

const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE_URL}/`, priority: '1.0' },
  ...projects.map((p) => ({
    loc: `${SITE_URL}${p.head.path}`,
    priority: '0.8',
  })),
  { loc: `${SITE_URL}${PRIVACY_HEAD.path}`, priority: '0.3' },
];
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`
);

console.log(
  `Prerendered the homepage, ${projects.length} project pages, the privacy page and the sitemap into dist/`
);
