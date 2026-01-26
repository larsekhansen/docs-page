import { expect, test } from '@playwright/test';

test('home loads and islands mount', async ({ page }) => {
  await page.goto('/');

  const trigger = page.getByRole('button', { name: 'Søk Ctrl K' });
  await expect(trigger).toBeVisible();

  await page.waitForFunction(() => {
    const w = window as any;
    return Boolean(w.ISLANDS_DEBUG?.loaded) && (w.ISLANDS_DEBUG?.mounted ?? 0) >= 1;
  });
});

test('search modal works (click + query + open result + esc)', async ({ page }) => {
  await page.goto('/');

  const trigger = page.getByRole('button', { name: 'Søk Ctrl K' });
  await expect(trigger).toBeVisible();

  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Søk' });
  await expect(dialog).toBeVisible();

  const input = page.getByRole('searchbox', { name: 'Søk gjennom dokumentasjonen…' });
  await expect(input).toBeVisible();

  await input.fill('auth');

  const results = page.locator('[data-search-results] a');
  await expect(results.first()).toBeVisible();

  await results.first().click();
  await expect(page).toHaveURL(/\/authorization\//);

  await page.goBack();
  await expect(trigger).toBeVisible();

  await page.keyboard.press('ControlOrMeta+K');
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
