// Writes the site's own content (src/data/portfolioData.ts) as Markdown for the
// Ask my portfolio index, which reads Markdown, not TypeScript. Citations to this
// file link back to src/data/portfolioData.ts (see api/corpus.json).
//
//   node scripts/export-site-data.mjs api/generated/portfolio.md
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadPortfolioData } from './site-data.mjs';

const out = process.argv[2];
if (!out) {
  console.error('usage: node scripts/export-site-data.mjs <output.md>');
  process.exit(2);
}

const data = await loadPortfolioData();
const lines = ['# Nathan Zimmerman, portfolio content', ''];

lines.push('## Featured projects', '');
for (const p of data.projectEntries) {
  lines.push(`### ${p.title}`, '');
  lines.push(`${p.tagline}. ${p.summary}`, '');
  lines.push(`**The problem.** ${p.problem}`, '');
  lines.push(`**Stack:** ${p.stack.join(', ')}.`, '');
  lines.push('**Features:**', '', ...p.features.map((f) => `- ${f}`), '');
  for (const h of p.highlights) {
    lines.push(`**${h.title}.** ${h.detail}`, '');
  }
  lines.push(`Live: ${p.links.live}. Code: ${p.links.code}.`, '');
}

lines.push('## Earlier projects', '');
for (const p of data.earlierProjects) {
  lines.push(`- **${p.title}** (${p.stack.join(', ')}): ${p.summary}`);
}
lines.push('');

lines.push('## Experience', '');
for (const e of data.experienceItems) {
  lines.push(
    `- **${e.title}, ${e.company}** (${e.period}): ${e.summary} Skills: ${e.tags.join(', ')}.`
  );
}
for (const c of data.careerOriginItems) {
  lines.push(`- **${c.title}**: ${c.detail}`);
}
lines.push('');

await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, lines.join('\n'));
console.log(`Wrote ${out}`);
