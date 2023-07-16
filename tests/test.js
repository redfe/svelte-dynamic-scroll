import { expect, test } from '@playwright/test';

// 10 件ぐらいだと nextChunk が複数かい発動してしまうのである程度増やしておく
const CHUNK_SIZE = 20;

async function scroll(page) {
	let selector = `ul li:last-child`;
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
			height: 200
		});
	});

	test(`row count after initial mount is expected to be ${CHUNK_SIZE}`, async ({ page }) => {
		// Arrange
		await page.goto('/simple');

		// Action
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Assertion
		await expect((await page.getByRole('row').all()).length).toBe(CHUNK_SIZE);
	});

	test(`row count after scrolling is expected to be greater than ${CHUNK_SIZE}`, async ({
		page
	}) => {
		// Arrange
		await page.goto('/simple');

		// Action
		await new Promise((resolve) => setTimeout(resolve, 300));
		await scroll(page, 1);

		// Assertion
		await expect((await page.getByRole('row').all()).length).toBeGreaterThan(20);
		console.log((await page.getByRole('row').all()).length);
	});

	test(`row count after scrolling tow times is expected to be greater than ${
		CHUNK_SIZE * 2
	}`, async ({ page }) => {
		// Arrange
		await page.goto('/simple');

		// Action
		await new Promise((resolve) => setTimeout(resolve, 300));
		for (let i = 0; i < 2; i++) {
			await scroll(page, i + 1);
		}

		// Assertion
		await expect((await page.getByRole('row').all()).length).toBeGreaterThan(CHUNK_SIZE * 2);
		console.log((await page.getByRole('row').all()).length);
	});
});
