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

export const AxisY_PreviousChunk = {
	args: {
		previousChunk: (lastValue) => {
			const _last = lastValue ?? 1;
			const ret = [...Array(10).keys()].map((i) => _last - (i + 1)).reverse();
			return ret;
		}
	}
};

export const AxisY_NextChunk = {
	args: {
		nextChunk: (lastValue) => {
			const _last = lastValue ?? -1;
			const ret = [...Array(10).keys()].map((i) => _last + (i + 1));
			return ret;
		}
	}
};

export const AxisY_BothChunks = {
	args: {
		...AxisY_PreviousChunk.args,
		...AxisY_NextChunk.args
	}
};

export const AxisY_BufferSize_Work_With_BothChunks = {
	args: {
		...AxisY_PreviousChunk.args,
		...AxisY_NextChunk.args,
		bufferSize: 40
	}
};

export const AxisY_BufferSize_NotWork_With_previousChunk = {
	args: {
		...AxisY_PreviousChunk.args,
		bufferSize: 40
	}
};

export const AxisY_BufferSize_NotWork_With_nextChunk = {
	args: {
		...AxisY_NextChunk.args,
		bufferSize: 40
	}
};

export const AxisY_TriggerRangeRatio = {
	args: {
		...AxisY_PreviousChunk.args,
		...AxisY_NextChunk.args,
		bufferSize: 40,
		triggerRangeRatio: 0.3
	}
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
	}
};

export const AxisX_PreviousChunk = {
	args: {
		...AxisY_PreviousChunk.args,
		axis: 'x'
	}
};

export const AxisX_NextChunk = {
	args: {
		...AxisY_NextChunk.args,
		axis: 'x'
	}
};

export const AxisX_BothChunks = {
	args: {
		...AxisY_BothChunks.args,
		axis: 'x'
	}
};

export const AxisX_BufferSize_Work_With_BothChunks = {
	args: {
		...AxisY_BufferSize_Work_With_BothChunks.args,
		axis: 'x'
	}
};

export const AxisX_BufferSize_NotWork_With_previousChunk = {
	args: {
		...AxisY_BufferSize_NotWork_With_previousChunk.args,
		axis: 'x'
	}
};

export const AxisX_BufferSize_NotWork_With_nextChunk = {
	args: {
		...AxisY_BufferSize_NotWork_With_nextChunk.args,
		axis: 'x'
	}
};

export const AxisX_TriggerRangeRatio = {
	args: {
		...AxisY_TriggerRangeRatio.args,
		axis: 'x'
	}
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
	}
};
