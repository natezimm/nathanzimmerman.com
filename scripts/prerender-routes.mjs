#!/usr/bin/env node
// Runs after `vite build`. The site is a single-page app, so every route used
// to get the home page's HTML, including a canonical link back to "/", which
// tells search engines each project page is a copy of the home page.
//
// This writes dist/projects/<slug>/index.html for each project with its own
// title, description, canonical link and link-preview tags, and a sitemap that
// lists exactly those pages. Project URLs end in a slash: nginx's
// `try_files $uri $uri/ /index.html` serves /projects/<slug>/index.html for
// /projects/<slug>/ and redirects /projects/<slug> there, so the slash form is
// the canonical one and the app links to it. The React app then takes over.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
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
  const matches = html.match(new RegExp(pattern, 'g')) ?? [];
  if (matches.length !== 1) {
    throw new Error(
      `Expected one match for ${pattern} in dist/index.html, found ${matches.length}`
    );
  }
  return html.replace(pattern, replacement);
};

const tag = (attr, key) =>
  new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`);

const pageFor = (project) => {
  const { head } = project;
  const url = `${SITE_URL}${head.path}`;
  const title = escape(head.title);
  const description = escape(head.description);
  const image = `${SITE_URL}${head.image}`;
  const alt = escape(`${project.title}: ${project.tagline}`);

  let html = shell;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = replaceOnce(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`
  );
  for (const [attr, key, value] of [
    ['name', 'description', description],
    ['property', 'og:type', 'article'],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', url],
    ['property', 'og:image', image],
    ['property', 'og:image:alt', alt],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:image', image],
    ['name', 'twitter:image:alt', alt],
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
  await writeFile(path.join(dir, 'index.html'), pageFor(project));
}

const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE_URL}/`, priority: '1.0' },
  ...projects.map((p) => ({
    loc: `${SITE_URL}${p.head.path}`,
    priority: '0.8',
  })),
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
  `Prerendered ${projects.length} project pages and the sitemap into dist/`
);
