import { expect, test } from '@playwright/test';

const isMobileProject = (projectName: string) => projectName.includes('mobile');

test.describe('portfolio experience', () => {
  test('loads the home page and core sections', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Nathan Zimmerman/);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Thoughtful software. A playful mind./,
      })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'People first. Code follows.' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Built out of curiosity.' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'EXPERIENCE' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'MY EVERYDAY TOOLKIT' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Let’s build something useful.' })
    ).toBeVisible();
    await expect(
      page.getByRole('img', { name: 'Brick Breaker application screenshot' })
    ).toBeVisible();
  });

  test('switches between map and resume views', async ({ page }, testInfo) => {
    const shell = page.locator('.retro-shell');

    await page.goto('/explore');

    if (isMobileProject(testInfo.project.name)) {
      await expect(shell).toHaveAttribute('data-view-mode', 'grid');

      await page.getByRole('button', { name: 'Switch to map view' }).click();
      await expect(shell).toHaveAttribute('data-view-mode', 'map');

      await page.getByRole('button', { name: 'Switch to resume view' }).click();
      await expect(shell).toHaveAttribute('data-view-mode', 'grid');
      return;
    }

    await expect(shell).toHaveAttribute('data-view-mode', 'map');

    await page.getByRole('button', { name: 'RESUME VIEW' }).click();
    await expect(shell).toHaveAttribute('data-view-mode', 'grid');

    await page.getByRole('button', { name: 'MAP VIEW' }).click();
    await expect(shell).toHaveAttribute('data-view-mode', 'map');
  });

  test('navigates to the contact section', async ({ page }, testInfo) => {
    await page.goto('/explore');

    if (isMobileProject(testInfo.project.name)) {
      await page.getByRole('button', { name: 'Toggle menu' }).click();
      const mobileMenu = page.getByTestId('mobile-menu');

      await expect(mobileMenu).toBeVisible();
      await mobileMenu.getByRole('button', { name: 'CONTACT' }).click();
    } else {
      await page
        .getByRole('navigation')
        .getByRole('button', { name: 'CONTACT' })
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

  test('opens project detail pages from project cards', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('link', { name: 'Explore Brick Breaker', exact: true })
      .click();

    await expect(page).toHaveURL(/\/projects\/brick-breaker$/);
    await expect(
      page.getByRole('heading', { name: 'BRICK BREAKER' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'TECH STACK' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /VIEW LIVE/ })).toHaveAttribute(
      'href',
      'https://resume.nathanzimmerman.com'
    );
  });

  test('shows a not found state for unknown routes', async ({ page }) => {
    await page.goto('/missing-page');

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();

    await page.getByRole('link', { name: 'Return to Home' }).click();
    await expect(page).toHaveURL('/');
  });
});
