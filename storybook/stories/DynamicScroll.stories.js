// See https://storybook.js.org/docs/react/writing-tests/interaction-testing
//     https://storybook.js.org/docs/react/writing-tests/test-runner
import { within, fireEvent } from '@storybook/testing-library';
import DynamicScrollTest from './DynamicScrollTest.svelte';

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

const wait = (millisec) => new Promise((resolve) => setTimeout(resolve, millisec));

const scrollY = async (scrollable, scrollTop) => {
	await fireEvent.scroll(scrollable, { target: { scrollTop: scrollTop } });
	await wait(INTERVAL);
};

const scrollX = async (scrollable, scrollLeft) => {
	await fireEvent.scroll(scrollable, { target: { scrollLeft: scrollLeft } });
	await wait(INTERVAL);
};

const playAxisY = async ({ canvasElement }) => {
	const canvas = within(canvasElement);
	const scrollable = canvas.getByRole('listbox');
	for (let i = 0; i < 5; i++) {
		await scrollY(scrollable, 0);
	}
	for (let i = 0; i < 5; i++) {
		await scrollY(scrollable, scrollable.scrollHeight);
	}
};

const playAxisX = async ({ canvasElement }) => {
	const canvas = within(canvasElement);
	const scrollable = canvas.getByRole('listbox');
	for (let i = 0; i < 5; i++) {
		await scrollX(scrollable, 0);
	}
	for (let i = 0; i < 5; i++) {
		await scrollX(scrollable, scrollable.scrollWidth);
	}
};

export const AxisY_PreviousChunk = {
	args: {
		previousChunk: (lastValue) => {
			const _last = lastValue ?? 1;
			const ret = [...Array(10).keys()].map((i) => _last - (i + 1)).reverse();
			return ret;
		}
	},
	play: playAxisY
};

export const AxisY_NextChunk = {
	args: {
		nextChunk: (lastValue) => {
			const _last = lastValue ?? -1;
			const ret = [...Array(10).keys()].map((i) => _last + (i + 1));
			return ret;
		}
	},
	play: playAxisY
};

export const AxisY_BothChunks = {
	args: {
		...AxisY_PreviousChunk.args,
		...AxisY_NextChunk.args
	},
	play: playAxisY
};

export const AxisY_BufferSize_Work_With_BothChunks = {
	args: {
		...AxisY_PreviousChunk.args,
		...AxisY_NextChunk.args,
		bufferSize: 40
	},
	play: playAxisY
};

export const AxisY_BufferSize_NotWork_With_previousChunk = {
	args: {
		...AxisY_PreviousChunk.args,
		bufferSize: 40
	},
	play: playAxisY
};

export const AxisY_BufferSize_NotWork_With_nextChunk = {
	args: {
		...AxisY_NextChunk.args,
		bufferSize: 40
	},
	play: playAxisY
};

export const AxisY_TriggerRangeRatio = {
	args: {
		...AxisY_PreviousChunk.args,
		...AxisY_NextChunk.args,
		bufferSize: 40,
		triggerRangeRatio: 0.3
	},
	play: playAxisY
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
		...AxisY_PreviousChunk.args,
		...AxisY_NextChunk.args,
		onScrollCallback: (e) => {
			console.log(e);
		}
	},
	play: playAxisY
};

export const AxisX_PreviousChunk = {
	args: {
		...AxisY_PreviousChunk.args,
		axis: 'x'
	},
	play: playAxisX
};

export const AxisX_NextChunk = {
	args: {
		...AxisY_NextChunk.args,
		axis: 'x'
	},
	play: playAxisX
};

export const AxisX_BothChunks = {
	args: {
		...AxisY_BothChunks.args,
		axis: 'x'
	},
	play: playAxisX
};

export const AxisX_BufferSize_Work_With_BothChunks = {
	args: {
		...AxisY_BufferSize_Work_With_BothChunks.args,
		axis: 'x'
	},
	play: playAxisX
};

export const AxisX_BufferSize_NotWork_With_previousChunk = {
	args: {
		...AxisY_BufferSize_NotWork_With_previousChunk.args,
		axis: 'x'
	},
	play: playAxisX
};

export const AxisX_BufferSize_NotWork_With_nextChunk = {
	args: {
		...AxisY_BufferSize_NotWork_With_nextChunk.args,
		axis: 'x'
	},
	play: playAxisX
};

export const AxisX_TriggerRangeRatio = {
	args: {
		...AxisY_TriggerRangeRatio.args,
		axis: 'x'
	},
	play: playAxisX
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
	play: playAxisX
};
