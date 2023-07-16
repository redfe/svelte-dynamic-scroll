import { expect, test } from '@playwright/test';

// 10 件ぐらいだと nextChunk が複数かい発動してしまうのである程度増やしておく
const CHUNK_SIZE = 20;

const VIEWPORT_SIZE = {
	width: 200,
	height: 400
};

async function wait(millisec) {
	await new Promise((resolve) => setTimeout(resolve, millisec));
}

/**
 * @param {import('@playwright/test').Page} page
 */
async function scroll(page) {
	const elementHandle = await page.$('ul');
	const { height, scrollHeight } = await elementHandle.evaluate((element) => {
		return { height: element.clientHeight, scrollHeight: element.scrollHeight };
	});
	console.log('height scrollHeight', height, scrollHeight);
	await page.mouse.move(VIEWPORT_SIZE.width / 2, VIEWPORT_SIZE.height / 2);
	await page.mouse.wheel(0, scrollHeight - height * 0.95);
	await wait(500);
}

test.describe('simple page', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize(VIEWPORT_SIZE);
	});

	test(`row count after initial mount is expected to be greater than 1`, async ({ page }) => {
		// Arrange
		await page.goto('/simple');

		// Action
		await wait(500);

		// Assertion
		const length = (await page.getByRole('row').all()).length;
		console.log('length', length);
		await expect(length).toBeGreaterThan(1);
	});

	test(`row count after scrolling is expected to be greater than ${CHUNK_SIZE}`, async ({
		page
	}) => {
		// Arrange
		await page.goto('/simple');

		// Action
		await wait(500);
		await scroll(page);

		// Assertion
		const length = (await page.getByRole('row').all()).length;
		console.log('length', length);
		await expect(length).toBeGreaterThan(20);
	});

	test(`row count after scrolling tow times is expected to be greater than ${
		CHUNK_SIZE * 2
	}`, async ({ page }) => {
		// Arrange
		await page.goto('/simple');

		// Action
		await wait(500);
		for (let i = 0; i < 2; i++) {
			await scroll(page);
		}

		// Assertion
		const length = (await page.getByRole('row').all()).length;
		console.log('length', length);
		await expect(length).toBeGreaterThan(CHUNK_SIZE * 2);
	});
});
