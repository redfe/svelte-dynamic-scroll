<script>
	import { DynamicScroll } from '$lib/index';

	const MAX = 500;
	const chunkSize = 20;
	const initialValue = 0;

	/**
	 * @type {function(number[]): number}
	 */
	const getEndOfArray = (array) => array[array.length - 1];

	/**
	 * @param {number|undefined} lastValue
	 * @returns {number[]}
	 */
	function nextChunk(lastValue) {
		const _last = lastValue ?? initialValue - 1;
		if (MAX <= _last) return [];
		let array = [];
		for (let i = 0; i < chunkSize; i++) {
			array.push(_last + (i + 1));
			if (MAX <= getEndOfArray(array)) return array;
		}
		return array;
	}
</script>

<div class="app">
	<DynamicScroll {nextChunk} let:prop={{ value }}>
		<div role="row" class="row">{value}</div>
		{#if value === MAX}<div class="end">end</div>{/if}
	</DynamicScroll>
</div>

<style>
	.app {
		height: 100%;
		width: 100%;
		overflow-y: hidden;
		border: solid 1px;
		box-sizing: border-box;
		border-radius: 10px;
	}
	.row {
		border: none;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		height: 40px;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		text-align: center;
	}
	.end {
		width: 100%;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>
