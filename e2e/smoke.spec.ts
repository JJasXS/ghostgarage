import { test, expect } from '@playwright/test'

test('GhostGarage smoke: load, select vehicle, paint, save & restore', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('app-root')).toBeVisible()
  await expect(page.getByTestId('showroom-canvas')).toBeVisible({ timeout: 30_000 })

  // Vehicle selection
  await page.getByTestId('vehicle-ghost-r').click()
  await expect(page.getByTestId('right-panel').getByText('Ghost R')).toBeVisible()

  // Paint change
  await page.getByTestId('left-panel').getByRole('button', { name: 'Paint' }).click()
  await page.getByTestId('paint-racing-red').click()
  await expect(page.getByTestId('left-panel').getByText('Racing Red')).toBeVisible()

  // Save build — stub prompt
  await page.evaluate(() => {
    window.prompt = () => 'E2E Build'
  })
  await page.getByTestId('save-build-btn').click()

  await page.getByRole('button', { name: /Saved Builds/i }).click()
  await expect(page.getByTestId('saved-build')).toContainText('E2E Build')

  // Change paint then restore
  await page.getByRole('button', { name: /^Configure$/i }).click()
  await page.getByTestId('left-panel').getByRole('button', { name: 'Paint' }).click()
  await page.getByTestId('paint-pearl-white').click()

  await page.getByRole('button', { name: /Saved Builds/i }).click()
  await page.getByRole('button', { name: 'Load' }).click()

  await page.getByRole('button', { name: /^Configure$/i }).click()
  await page.getByTestId('left-panel').getByRole('button', { name: 'Paint' }).click()
  await expect(page.getByTestId('left-panel').getByText('Racing Red')).toBeVisible()
})
