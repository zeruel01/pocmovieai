import { expect, test } from '@playwright/test'

test('searches with combined criteria, opens details, and clears without navigation', async ({
  page,
}) => {
  await page.goto('/')
  const initialUrl = page.url()

  await page.getByLabel('Movie title').fill('matrix')
  await page.getByLabel('Genre').fill('action')
  await page.getByLabel('Actor name').fill('keanu')
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(page.getByText('2 movies')).toBeVisible()
  await expect(
    page.getByRole('button', { name: /^View details for The Matrix$/ }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'View details for The Matrix Reloaded' }),
  ).toBeVisible()

  await page
    .getByRole('button', { name: /^View details for The Matrix$/ })
    .click()

  await expect(
    page.getByRole('heading', { level: 3, name: 'The Matrix' }),
  ).toBeVisible()
  await expect(page.getByText('March 31, 1999')).toBeVisible()
  await expect(page.getByText('Carrie-Anne Moss')).toBeVisible()
  await expect(page.getByText('Keanu Reeves')).toBeVisible()
  await expect(page.getByText('Laurence Fishburne')).toBeVisible()
  expect(page.url()).toBe(initialUrl)

  await page.getByRole('button', { name: 'Clear' }).click()

  await expect(page.getByLabel('Movie title')).toHaveValue('')
  await expect(page.getByRole('region', { name: 'Results' })).toHaveCount(0)
})

test('keeps the populated workspace contained and stacks details on mobile', async ({
  page,
}, testInfo) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByText('9 movies')).toBeVisible()
  await page
    .getByRole('button', { name: 'View details for The Matrix', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { level: 3, name: 'The Matrix' }),
  ).toBeVisible()

  const layout = await page.evaluate(() => {
    const results = document
      .querySelector('[aria-label="Movie search results"]')
      ?.getBoundingClientRect()
    const details = document.querySelector('aside')?.getBoundingClientRect()

    return {
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      resultsBottom: results?.bottom ?? 0,
      detailsTop: details?.top ?? 0,
    }
  })

  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth)

  if (testInfo.project.name === 'mobile-chromium') {
    expect(layout.detailsTop).toBeGreaterThan(layout.resultsBottom)
  }
})