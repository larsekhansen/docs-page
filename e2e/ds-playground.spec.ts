import { expect, test } from '@playwright/test';

test('ds playground renders and components are interactive', async ({ page }) => {
  await page.goto('/ds-playground/');

  await expect(page.getByTestId('ds-playground')).toBeVisible();

  await expect(page.getByTestId('ds-alert')).toContainText('Dette er en informasjonsmelding');

  const button = page.getByTestId('ds-button-action');
  await button.click();
  await button.click();
  await expect(page.getByTestId('ds-button-count')).toHaveText('2');

  const textfield = page.getByTestId('ds-textfield-input');
  await textfield.fill('hello');
  await expect(page.getByTestId('ds-textfield-value')).toHaveText('hello');

  const checkbox = page.getByTestId('ds-checkbox-input');
  await checkbox.check();
  await expect(checkbox).toBeChecked();

  const radioB = page.getByTestId('ds-radio-b');
  await radioB.check();
  await expect(radioB).toBeChecked();

  const select = page.getByTestId('ds-select-input');
  await select.selectOption('2');
  await expect(page.getByTestId('ds-select-value')).toHaveText('2');

  await page.getByRole('tab', { name: 'Two' }).click();
  await expect(page.getByTestId('ds-tabs-two')).toBeVisible();

  await page.getByText('Details summary').click();
  await expect(page.getByTestId('ds-details-content')).toBeVisible();

  await page.getByTestId('ds-dialog-open').click();
  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId('ds-dialog-body')).toBeVisible();

  await page.getByRole('button', { name: /Lukk/i }).click();
  await expect(dialog).toBeHidden();
});
