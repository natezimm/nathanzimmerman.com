import { describe, expect, it } from 'vitest';
import { HOME_HEAD, applyPageHead, projectHead } from './pageHead';
import indexHtml from '../../index.html?raw';

const canonical = () =>
  document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
const meta = (selector: string) =>
  document.head.querySelector<HTMLMetaElement>(`meta[${selector}]`)?.content;

describe('page head', () => {
  it('matches the home page tags index.html ships with', () => {
    const html = indexHtml;
    expect(html).toContain(`<title>${HOME_HEAD.title}</title>`);
    expect(html.replace(/\s+/g, ' ')).toContain(
      `content="${HOME_HEAD.description}"`
    );
    expect(html).toContain(
      `content="https://nathanzimmerman.com${HOME_HEAD.image}"`
    );
  });

  it('moves the title, description, canonical link and preview to the page shown', () => {
    applyPageHead(
      projectHead({ slug: 'know-ball', title: 'Know Ball', summary: 'Trivia.' })
    );

    expect(document.title).toBe('Know Ball · Nathan Zimmerman');
    expect(canonical()).toBe('https://nathanzimmerman.com/projects/know-ball/');
    expect(meta('name="description"')).toBe('Trivia.');
    expect(meta('property="og:url"')).toBe(
      'https://nathanzimmerman.com/projects/know-ball/'
    );
    expect(meta('property="og:image"')).toBe(
      'https://nathanzimmerman.com/og/know-ball.jpg'
    );

    applyPageHead(HOME_HEAD);

    expect(document.title).toBe(HOME_HEAD.title);
    expect(canonical()).toBe('https://nathanzimmerman.com/');
    expect(meta('name="twitter:description"')).toBe(HOME_HEAD.description);
  });
});
