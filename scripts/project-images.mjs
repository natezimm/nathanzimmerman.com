#!/usr/bin/env node
// Turns a project screenshot into the files the site serves for it.
//
//   npm run images:project -- <screenshot.png> <slug> [--detail]
//
// writes src/assets/project-<slug>{.png,.webp,.avif,-small.webp,-small.avif},
// and with --detail also project-<slug>-detail.webp at full size.
// The widths match the 600w/1200w srcset in ProjectImage and Projects.
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const FULL_WIDTH = 1200;
const SMALL_WIDTH = 600;
const WEBP = { quality: 80, effort: 6 };
const AVIF = { quality: 55, effort: 6 };

const args = process.argv.slice(2);
const detail = args.includes('--detail');
const [source, slug] = args.filter((arg) => !arg.startsWith('--'));

if (!source || !slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error(
    'Usage: npm run images:project -- <screenshot.png> <slug> [--detail]\n' +
      'The slug is lowercase letters, digits and dashes, e.g. know-ball.'
  );
  process.exit(1);
}

const assets = path.resolve(import.meta.dirname, '../src/assets');
const base = path.join(assets, `project-${slug}`);
await mkdir(assets, { recursive: true });

const { width } = await sharp(source).metadata();
if (width < FULL_WIDTH) {
  console.warn(
    `${source} is ${width}px wide; screenshots look best at ${FULL_WIDTH}px or more.`
  );
}

// Screenshots are opaque, so drop any alpha channel rather than ship it.
const resized = (targetWidth) =>
  sharp(source)
    .flatten({ background: '#ffffff' })
    .resize({ width: targetWidth, withoutEnlargement: true });

const outputs = [
  [`${base}.webp`, resized(FULL_WIDTH).webp(WEBP)],
  [`${base}.avif`, resized(FULL_WIDTH).avif(AVIF)],
  [`${base}-small.webp`, resized(SMALL_WIDTH).webp(WEBP)],
  [`${base}-small.avif`, resized(SMALL_WIDTH).avif(AVIF)],
];
if (detail) {
  outputs.push([
    `${base}-detail.webp`,
    sharp(source).flatten({ background: '#ffffff' }).webp(WEBP),
  ]);
}

// The original PNG is kept beside the outputs so they can be regenerated.
if (path.resolve(source) !== `${base}.png`) {
  await copyFile(source, `${base}.png`);
}
for (const [file, pipeline] of outputs) {
  const info = await pipeline.toFile(file);
  console.log(
    `${path.relative(process.cwd(), file)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`
  );
}
