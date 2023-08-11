// See https://storybook.js.org/docs/react/writing-tests/interaction-testing
//     https://storybook.js.org/docs/react/writing-tests/test-runner
import { within, fireEvent } from '@storybook/testing-library';
import DynamicScrollTest from './DynamicScrollTest.svelte';
import { expect } from '@storybook/jest';

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
export default {
	component: DynamicScrollTest,
	tags: ['autodocs'],
	argTypes: {},
	args: {
		previousChunk: undefined,
		nextChunk: undefined,
		bufferSize: undefined,
		triggerRangeRatio: undefined,
		maxRetryCountOnPreLoad: undefined,
		onScrollCallback: undefined,
		axis: undefined
	}
};

const INTERVAL = 100;
const SCROLL_COUNT = 3;

const wait = (millisec) => new Promise((resolve) => setTimeout(resolve, millisec));

const scrollY = async (scrollable, scrollTop) => {
	await fireEvent.scroll(scrollable, { target: { scrollTop: scrollTop } });
	await wait(INTERVAL);
};

const scrollX = async (scrollable, scrollLeft) => {
	await fireEvent.scroll(scrollable, { target: { scrollLeft: scrollLeft } });
	await wait(INTERVAL);
};

function playAxisY(verifier) {
	return async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const scrollable = canvas.getByRole('listbox');
		const firstScrollHeight = scrollable.scrollHeight;
		//console.log('firstScrollHeight', firstScrollHeight);
		for (let i = 0; i < SCROLL_COUNT; i++) {
			//console.log('item count', scrollable.querySelectorAll('li').length);
			await scrollY(scrollable, 0);
		}
		for (let i = 0; i < SCROLL_COUNT; i++) {
			//console.log('item count', scrollable.querySelectorAll('li').length);
			await scrollY(scrollable, scrollable.scrollHeight);
		}
		verifier(scrollable, firstScrollHeight);
	};
}

function playAxisX(verifier) {
	return async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const scrollable = canvas.getByRole('listbox');
		const firstScrollWidth = scrollable.scrollWidth;
		//console.log('firstScrollWidth', firstScrollWidth);
		for (let i = 0; i < SCROLL_COUNT; i++) {
			//console.log('item count', scrollable.querySelectorAll('li').length);
			await scrollX(scrollable, 0);
		}
		for (let i = 0; i < SCROLL_COUNT; i++) {
			//console.log('item count', scrollable.querySelectorAll('li').length);
			await scrollX(scrollable, scrollable.scrollWidth);
		}
		verifier(scrollable, firstScrollWidth);
	};
}

function expectNumber(expected, actual) {
	expect(Math.floor(expected)).toBe(Math.floor(actual));
}

export const AxisY_PreviousChunk = {
	args: {
		previousChunk: (lastValue) => {
			const _last = lastValue ?? 1;
			const ret = [...Array(10).keys()].map((i) => _last - (i + 1)).reverse();
			return ret;
		}
	},
	play: playAxisY((scrollable) =>
		expectNumber(scrollable.scrollTop, scrollable.scrollHeight - scrollable.clientHeight)
	)
};

export const AxisY_NextChunk = {
	args: {
		nextChunk: (lastValue) => {
			const _last = lastValue ?? -1;
			const ret = [...Array(10).keys()].map((i) => _last + (i + 1));
			return ret;
		}
	},
	play: playAxisY((scrollable, firstScrollHeight) =>
		expectNumber(scrollable.scrollTop, firstScrollHeight * SCROLL_COUNT - scrollable.clientHeight)
	)
};

export const AxisY_BothChunks = {
	args: {
		...AxisY_PreviousChunk.args,
		...AxisY_NextChunk.args
	},
	play: playAxisY((scrollable, firstScrollHeight) =>
		expectNumber(
			scrollable.scrollTop,
			firstScrollHeight * SCROLL_COUNT * 2 - scrollable.clientHeight
		)
	)
};

export const AxisY_BufferSize_Work_With_BothChunks = {
	args: {
		...AxisY_BothChunks.args,
		bufferSize: 20
	},
	play: playAxisY((scrollable, firstScrollHeight) =>
		expectNumber(scrollable.scrollTop, firstScrollHeight - scrollable.clientHeight)
	)
};

export const AxisY_BufferSize_NotWork_With_previousChunk = {
	args: {
		...AxisY_PreviousChunk.args,
		bufferSize: 20
	},
	play: AxisY_PreviousChunk.play
};

export const AxisY_BufferSize_NotWork_With_nextChunk = {
	args: {
		...AxisY_NextChunk.args,
		bufferSize: 20
	},
	play: AxisY_NextChunk.play
};

export const AxisY_TriggerRangeRatio = {
	args: {
		...AxisY_BothChunks.args,
		triggerRangeRatio: 0.2
	},
	play: AxisY_BothChunks.play
};

export const AxisY_MaxRetryCountOnPreLoad = {
	args: {
		previousChunk: (lastValue) =>
			AxisY_PreviousChunk.args.previousChunk(lastValue).reverse().slice(0, 1).reverse(),
		nextChunk: (lastValue) => AxisY_NextChunk.args.nextChunk(lastValue).slice(0, 1),
		maxRetryCountOnPreLoad: 1
	}
};

export const AxisY_OnScrollCallback = {
	args: {
		...AxisY_BothChunks.args,
		onScrollCallback: (e) => {
			let count = parseInt(e.target.dataset['callCount'] ?? '0');
			e.target.dataset['callCount'] = count + 1;
			console.log('onScrollCallback', e.target.dataset['callCount']);
		}
	},
	play: playAxisY((scrollable) =>
		expectNumber(scrollable.dataset['callCount'], `${SCROLL_COUNT * 2 * 2 - 1}`)
	)
};

export const AxisX_PreviousChunk = {
	args: {
		...AxisY_PreviousChunk.args,
		axis: 'x'
	},
	play: playAxisX((scrollable) =>
		expectNumber(scrollable.scrollLeft, scrollable.scrollWidth - scrollable.clientWidth)
	)
};

export const AxisX_NextChunk = {
	args: {
		...AxisY_NextChunk.args,
		axis: 'x'
	},
	play: playAxisX((scrollable, firstScrollWidth) =>
		expectNumber(scrollable.scrollLeft, firstScrollWidth * SCROLL_COUNT - scrollable.clientWidth)
	)
};

export const AxisX_BothChunks = {
	args: {
		...AxisY_BothChunks.args,
		axis: 'x'
	},
	play: playAxisX((scrollable, firstScrollWidth) =>
		expectNumber(
			scrollable.scrollLeft,
			firstScrollWidth * SCROLL_COUNT * 2 - scrollable.clientWidth
		)
	)
};

export const AxisX_BufferSize_Work_With_BothChunks = {
	args: {
		...AxisY_BufferSize_Work_With_BothChunks.args,
		axis: 'x'
	},
	play: playAxisX((scrollable, firstScrollWidth) =>
		expectNumber(scrollable.scrollLeft, firstScrollWidth - scrollable.clientWidth)
	)
};

export const AxisX_BufferSize_NotWork_With_previousChunk = {
	args: {
		...AxisY_BufferSize_NotWork_With_previousChunk.args,
		axis: 'x'
	},
	play: AxisX_PreviousChunk.play
};

export const AxisX_BufferSize_NotWork_With_nextChunk = {
	args: {
		...AxisY_BufferSize_NotWork_With_nextChunk.args,
		axis: 'x'
	},
	play: AxisX_NextChunk.play
};

export const AxisX_TriggerRangeRatio = {
	args: {
		...AxisX_BothChunks.args,
		triggerRangeRatio: 0.2,
		axis: 'x'
	},
	play: AxisX_BothChunks.play
};

export const AxisX_MaxRetryCountOnPreLoad = {
	args: {
		...AxisY_MaxRetryCountOnPreLoad.args,
		axis: 'x'
	}
};

export const AxisX_OnScrollCallback = {
	args: {
		...AxisY_OnScrollCallback.args,
		axis: 'x'
	},
	play: playAxisX((scrollable) =>
		expectNumber(scrollable.dataset['callCount'], `${SCROLL_COUNT * 2 * 2 - 1}`)
	)
};
