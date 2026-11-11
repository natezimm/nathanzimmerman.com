import { expect, test, type Page, type Route } from '@playwright/test';

// Every test stubs /api/ask*, so CI never reaches the API or the model.

const isMobileProject = (projectName: string) => projectName.includes('mobile');

const meta = {
  enabled: true,
  suggestions: [
    "How does Wheelhouse stop one family from seeing another family's data?",
    'How are Know Ball guesses kept idempotent?',
    'Why does Rabbit Ears use mpv?',
    "How are Wheelhouse's backups protected?",
  ],
  counts: { files: 40, decisionRecords: 23, readmes: 5, chunks: 231 },
  repos: [
    {
      key: 'wheelhouse',
      title: 'Wheelhouse',
      gitHub: 'https://github.com/natezimm/wheelhouse',
      commit: 'abc123',
    },
    {
      key: 'knowball',
      title: 'Know Ball',
      gitHub: 'https://github.com/natezimm/knowball',
      commit: 'def456',
    },
  ],
};

const wheelhouse = (path: string, anchor: string) =>
  `https://github.com/natezimm/wheelhouse/blob/abc123/${path}#${anchor}`;

const answer = {
  answer:
    "Every table that holds a family's data implements `IFamilyOwned`, and the DbContext filters on the signed-in family [1].\n\n- Code that must cross families calls `IgnoreQueryFilters()` by name [1].\n- Integration tests check the boundary on real PostgreSQL [2].\n- A paired wall display sees private events as Busy [3].",
  citations: [
    {
      n: 1,
      repo: 'wheelhouse',
      repoTitle: 'Wheelhouse',
      path: 'docs/adr/0002-family-isolation.md',
      heading: 'Decision',
      url: wheelhouse('docs/adr/0002-family-isolation.md', 'decision'),
    },
    {
      n: 2,
      repo: 'wheelhouse',
      repoTitle: 'Wheelhouse',
      path: 'docs/security.md',
      heading: 'Threat model',
      url: wheelhouse('docs/security.md', 'threat-model'),
    },
    {
      n: 3,
      repo: 'wheelhouse',
      repoTitle: 'Wheelhouse',
      path: 'README.md',
      heading: 'Private events',
      url: wheelhouse('README.md', 'private-events'),
    },
  ],
  refused: false,
  reason: null,
};

const fulfillJson = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });

const stubAsk = async (
  page: Page,
  reply: (route: Route) => Promise<void> = (route) =>
    fulfillJson(route, 200, answer),
  metaBody: unknown = meta
) => {
  await page.route('**/api/ask/meta', (route) =>
    fulfillJson(route, 200, metaBody)
  );
  await page.route('**/api/ask', reply);
};

const section = (page: Page) => page.locator('#ask');

test.describe('ask my portfolio', () => {
  test('stays hidden when the API is missing', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /Featured Projects/i })
    ).toBeVisible();
    await expect(section(page)).toHaveCount(0);
    await expect(
      page.getByRole('navigation').getByRole('button', { name: 'Ask' })
    ).toHaveCount(0);
  });

  test('stays hidden while Ask is switched off', async ({ page }) => {
    await stubAsk(page, undefined, { ...meta, enabled: false });
    const metaLoaded = page.waitForResponse('**/api/ask/meta');
    await page.goto('/');
    await metaLoaded;
    await expect(section(page)).toHaveCount(0);
  });

  test('the nav link scrolls to the section and a suggestion gets a cited answer', async ({
    page,
  }, testInfo) => {
    await stubAsk(page);
    await page.goto('/');

    if (isMobileProject(testInfo.project.name)) {
      await page.getByRole('button', { name: 'Toggle menu' }).click();
      await page
        .getByTestId('mobile-menu')
        .getByRole('button', { name: 'Ask' })
        .click();
    } else {
      await page
        .getByRole('navigation')
        .getByRole('button', { name: 'Ask' })
        .click();
    }
    await expect(
      page.getByRole('heading', { name: /Ask the docs/ })
    ).toBeInViewport();

    const request = page.waitForRequest('**/api/ask');
    await page
      .getByRole('button', { name: 'Why does Rabbit Ears use mpv?' })
      .click();
    expect((await request).postDataJSON()).toEqual({
      question: 'Why does Rabbit Ears use mpv?',
    });

    const sources = section(page).getByRole('list', { name: 'Sources' });
    await expect(sources.getByRole('link')).toHaveCount(3);
    await expect(
      sources.getByRole('link', { name: /ADR 0002 · Decision/ })
    ).toHaveAttribute(
      'href',
      wheelhouse('docs/adr/0002-family-isolation.md', 'decision')
    );
    await expect(section(page).locator('code').first()).toHaveText(
      'IFamilyOwned'
    );
  });

  test('refuses rather than guesses', async ({ page }) => {
    await stubAsk(page, (route) =>
      fulfillJson(route, 200, {
        answer: '',
        citations: [],
        refused: true,
        reason: 'not_in_docs',
      })
    );
    await page.goto('/#ask');

    await page
      .getByRole('textbox', { name: 'Your question' })
      .fill('What is the weather tomorrow?');
    await section(page)
      .getByRole('button', { name: 'Ask', exact: true })
      .click();

    await expect(section(page)).toContainText("The docs don't cover that");
    await expect(
      section(page).getByRole('list', { name: 'Suggested questions' })
    ).toBeVisible();
  });

  test('shows the paused state when the API is switched off mid-visit', async ({
    page,
  }) => {
    await stubAsk(page, (route) =>
      fulfillJson(route, 503, {
        answer: '',
        citations: [],
        refused: true,
        reason: 'paused',
      })
    );
    await page.goto('/#ask');

    await page
      .getByRole('button', {
        name: 'How are Know Ball guesses kept idempotent?',
      })
      .click();

    await expect(section(page)).toContainText('Ask is paused');
    await expect(
      section(page).getByRole('link', { name: 'Know Ball' })
    ).toHaveAttribute('href', 'https://github.com/natezimm/knowball');
  });

  test('works from the keyboard alone', async ({ page }) => {
    await stubAsk(page);
    await page.goto('/#ask');

    const box = page.getByRole('textbox', { name: 'Your question' });
    await box.focus();
    await page.keyboard.type('How does Wheelhouse isolate families?');
    await page.keyboard.press('Enter');

    await expect(
      section(page).getByRole('list', { name: 'Sources' }).getByRole('link')
    ).toHaveCount(3);
    await expect(box).toHaveValue('');
  });

  test('fits a 375 px screen without sideways scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await stubAsk(page);
    await page.goto('/#ask');

    await page
      .getByRole('button', { name: /Wheelhouse stop one family/ })
      .click();
    await expect(
      section(page).getByRole('list', { name: 'Sources' })
    ).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('does not animate the loading dot for reduced motion', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    let release: () => void = () => {};
    const held = new Promise<void>((resolve) => (release = resolve));
    await stubAsk(page, async (route) => {
      await held;
      await fulfillJson(route, 200, answer);
    });
    await page.goto('/#ask');

    await page.getByRole('button', { name: /Know Ball/ }).click();
    const dot = section(page).locator('.animate-pulse');
    await expect(dot).toBeVisible();
    expect(await dot.evaluate((el) => getComputedStyle(el).animationName)).toBe(
      'none'
    );
    release();
  });
});
