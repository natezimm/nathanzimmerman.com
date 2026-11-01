#!/usr/bin/env node
// Draws the 1200 × 630 pictures that link previews (LinkedIn, Slack, iMessage)
// show for the site and for each project page.
//
//   npm run images:social
//
// writes public/og-image.jpg and public/og/<slug>.jpg from the project data and
// screenshots. Run it after changing a project's title, tagline or screenshot,
// and commit the results.
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { loadProjects } from './site-data.mjs';

const root = path.resolve(import.meta.dirname, '..');
const projects = await loadProjects();

const dataUrl = async (file) =>
  `data:image/webp;base64,${(await readFile(path.join(root, file))).toString('base64')}`;

const escape = (text) =>
  text.replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  );

const page = (body) => `<!doctype html>
<html><head><style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    font-family: Inter, system-ui, sans-serif; color: #e2e8f0;
    background:
      radial-gradient(circle at 85% 10%, rgb(14 165 233 / 0.28), transparent 45%),
      radial-gradient(circle at 5% 95%, rgb(99 102 241 / 0.22), transparent 40%),
      linear-gradient(to right, #80808015 1px, transparent 1px) 0 0 / 28px 28px,
      linear-gradient(to bottom, #80808015 1px, transparent 1px) 0 0 / 28px 28px,
      #030712;
  }
  .name { font-size: 26px; font-weight: 600; color: #7dd3fc; letter-spacing: 0.02em; }
  h1 { font-size: 72px; font-weight: 800; line-height: 1.05; letter-spacing: -0.02em; color: #f8fafc; }
  .lead { font-size: 30px; line-height: 1.3; color: #94a3b8; }
  .shot { border-radius: 14px; border: 1px solid rgb(255 255 255 / 0.14);
          box-shadow: 0 24px 60px rgb(0 0 0 / 0.55); object-fit: cover; object-position: top left; }
</style></head><body>${body}</body></html>`;

const siteCard = async () => {
  const shots = await Promise.all(projects.map((p) => dataUrl(p.image)));
  return page(`
  <div style="display:flex;height:100%;padding:64px;gap:48px;align-items:center">
    <div style="flex:0 0 470px;display:flex;flex-direction:column;gap:22px">
      <p class="name">nathanzimmerman.com</p>
      <h1>Nathan<br>Zimmerman</h1>
      <p class="lead">Software engineer building full-stack apps in .NET, Angular and React.</p>
    </div>
    <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:18px">
      ${shots.map((src) => `<img class="shot" src="${src}" style="width:100%;aspect-ratio:1200/648">`).join('')}
    </div>
  </div>`);
};

const projectCard = async (project) =>
  page(`
  <div style="display:flex;flex-direction:column;height:100%;padding:56px 64px 0;gap:16px">
    <p class="name">Nathan Zimmerman · Project</p>
    <h1 style="font-size:64px">${escape(project.title)}</h1>
    <p class="lead" style="font-size:28px">${escape(project.tagline)}</p>
    <img class="shot" src="${await dataUrl(project.image)}"
         style="margin-top:18px;width:100%;flex:1;border-bottom-left-radius:0;border-bottom-right-radius:0">
  </div>`);

// CHROMIUM_PATH points at a Chromium other than Playwright's own download.
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const shoot = async (html, file) => {
  await tab.setContent(html, { waitUntil: 'load' });
  await tab.screenshot({
    path: path.join(root, file),
    type: 'jpeg',
    quality: 86,
  });
  console.log(`wrote ${file}`);
};

await mkdir(path.join(root, 'public/og'), { recursive: true });
await shoot(await siteCard(), 'public/og-image.jpg');
for (const project of projects) {
  await shoot(await projectCard(project), `public/og/${project.slug}.jpg`);
}
await browser.close();
