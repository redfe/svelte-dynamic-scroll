import { expect, test } from '@playwright/test';

async function scroll(page) {
	let selector = 'ul li:last-child';
	await page.waitForSelector(selector);
	await page.$eval(selector, (dom) => {
		dom.scrollIntoView();
	});
	await new Promise((resolve) => setTimeout(resolve, 300));
}

test.describe('simple page', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({
			width: 200,
			height: 100
		});
	});

	test('row count after initial mount is expected to be 10', async ({ page }) => {
		// Arrange & Action
		await page.goto('/simple');
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Assertion
		await expect((await page.getByRole('row').all()).length).toBe(10);
	});

	test('row count after scrolling is expected to be greater than 10', async ({ page }) => {
		// Arrange
		await page.goto('/simple');

		// Action
		await scroll(page);

		// Assertion
		await expect((await page.getByRole('row').all()).length).toBeGreaterThan(10);
		console.log((await page.getByRole('row').all()).length);
	});

	test('row count after scrolling tow times is expected to be greater than 20', async ({
		page
	}) => {
		// Arrange
		await page.goto('/simple');

		// Action
		for (let i = 0; i < 2; i++) {
			await scroll(page);
		}

		// Assertion
		await expect((await page.getByRole('row').all()).length).toBeGreaterThan(20);
		console.log((await page.getByRole('row').all()).length);
	});
});
