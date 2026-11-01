import { expect, test } from '@playwright/test';

const isMobileProject = (projectName: string) => projectName.includes('mobile');

test.describe('portfolio experience', () => {
  test('loads the home page and core sections', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Nathan Zimmerman/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Nathan'
    );
    await expect(
      page.getByRole('heading', { name: /About Me/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Work Experience/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Featured Projects/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Get In Touch/i })
    ).toBeVisible();
  });

  test('toggles between dark and light themes', async ({ page }, testInfo) => {
    await page.goto('/');

    const html = page.locator('html');
    const toggleButton = isMobileProject(testInfo.project.name)
      ? page
          .locator('.md\\:hidden')
          .getByRole('button', { name: 'Toggle theme' })
      : page
          .locator('.md\\:flex')
          .getByRole('button', { name: 'Toggle theme' });

    // Initial theme check
    const initialClass = (await html.getAttribute('class')) || '';

    // Click toggle
    await toggleButton.click({ force: true });
    const updatedClass = (await html.getAttribute('class')) || '';
    expect(updatedClass).not.toEqual(initialClass);

    // Toggle back
    await toggleButton.click({ force: true });
    const revertedClass = (await html.getAttribute('class')) || '';
    expect(revertedClass).toEqual(initialClass);
  });

  test('navigates to the contact section', async ({ page }, testInfo) => {
    await page.goto('/');

    if (isMobileProject(testInfo.project.name)) {
      await page
        .getByRole('button', { name: 'Toggle menu' })
        .click({ force: true });
      const mobileMenu = page.getByTestId('mobile-menu');

      await expect(mobileMenu).toBeVisible();
      await mobileMenu.getByRole('button', { name: 'Contact' }).click();
    } else {
      await page
        .getByRole('navigation')
        .getByRole('button', { name: 'Contact' })
        .click();
    }

    await expect(page.locator('#contact')).toBeInViewport();
    await expect(page.getByLabel('Name')).toHaveAttribute('maxlength', '100');
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'maxlength',
      '254'
    );
    await expect(
      page.getByRole('textbox', { name: 'Message' })
    ).toHaveAttribute('maxlength', '2000');
  });

  test('opens a project page from a project card and comes back', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Know Ball details' }).click();
    await expect(page).toHaveURL('/projects/know-ball');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Know Ball' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /Play it/ })).toHaveAttribute(
      'href',
      'https://knowball.nathanzimmerman.com'
    );
    await expect(
      page.getByRole('img', { name: /KnowBall API/ })
    ).toBeAttached();

    await page.getByRole('link', { name: 'All projects' }).first().click();
    await expect(page).toHaveURL('/#projects');
    await expect(
      page.getByRole('heading', { name: /Featured Projects/i })
    ).toBeInViewport();
  });

  test('lists retired projects with code links only', async ({ page }) => {
    await page.goto('/');

    for (const name of ['Nerdle', 'Sudoku', 'Blackjack']) {
      await expect(
        page.getByRole('link', { name: `${name} code on GitHub` })
      ).toHaveAttribute(
        'href',
        `https://github.com/natezimm/${name.toLowerCase()}`
      );
    }
    await expect(page.locator('a[href*="nerdle.nathanzimmerman"]')).toHaveCount(
      0
    );
  });

  test('shows a not found state for unknown routes', async ({ page }) => {
    await page.goto('/missing-page');

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();

    await page.getByRole('link', { name: 'Return to Home' }).click();
    await expect(page).toHaveURL('/');
  });
});
