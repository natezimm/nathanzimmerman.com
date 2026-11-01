import { useEffect } from 'react';

export const SITE_URL = 'https://nathanzimmerman.com';

export type PageHead = {
  title: string;
  description: string;
  /** The page's path, ending in a slash: its canonical form. */
  path: string;
  /** The link-preview picture's path. */
  image: string;
};

/** Matches the tags in index.html, which pageHead.test.ts checks. */
export const HOME_HEAD: PageHead = {
  title: 'Nathan Zimmerman | Software Engineer',
  description:
    'Nathan Zimmerman – Software Engineer specializing in C#, .NET, and Angular, building full-stack web apps on AWS and Azure.',
  path: '/',
  image: '/og-image.jpg',
};

const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.content = value;
};

/**
 * The first page a visitor opens arrives with its own head (index.html for the home page,
 * scripts/prerender-routes.mjs for project pages). This keeps the head in step as the app
 * moves between pages without a reload, so the tab title and canonical link follow the page.
 */
export function applyPageHead(head: PageHead) {
  const url = `${SITE_URL}${head.path}`;
  const image = `${SITE_URL}${head.image}`;
  document.title = head.title;
  setMeta('name', 'description', head.description);
  setMeta('property', 'og:title', head.title);
  setMeta('property', 'og:description', head.description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', image);
  setMeta('name', 'twitter:title', head.title);
  setMeta('name', 'twitter:description', head.description);
  setMeta('name', 'twitter:image', image);

  let canonical = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

/** A project page's head; scripts/prerender-routes.mjs writes the same one into its HTML. */
export const projectHead = (project: {
  slug: string;
  title: string;
  summary: string;
}): PageHead => ({
  title: `${project.title} · Nathan Zimmerman`,
  description: project.summary,
  path: `/projects/${project.slug}/`,
  image: `/og/${project.slug}.jpg`,
});

/** Applies a page's head when the page shows; nothing while it is undefined. */
export function usePageHead(head: PageHead | undefined) {
  const key = head && JSON.stringify(head);
  useEffect(() => {
    if (key) applyPageHead(JSON.parse(key) as PageHead);
  }, [key]);
}
