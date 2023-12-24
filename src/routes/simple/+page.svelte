<script>
	import { DynamicScroll } from '$lib/index.js';

	const MAX = 500;
	const chunkSize = 20;
	const initialValue = 0;

	/**
	 * @param {number[]} array
	 * @returns {number}
	 */
	const getEndOfArray = (array) => array[array.length - 1];

	/**
	 * @param {number=} lastValue
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

	// scrollPosition が効くことを確認するため、初期値を設定しておく
	const firstChunk = nextChunk(undefined);
	const secondChunk = nextChunk(firstChunk[firstChunk.length - 1]);
	let list = [...firstChunk, ...secondChunk];
	let scrollPosition = 150;
</script>

<p>scrollPosition:{scrollPosition}</p>
<div class="app">
	<DynamicScroll {nextChunk} bind:scrollPosition bind:list let:value>
		<div role="row" class="row">{value}</div>
		{#if value === MAX}<div class="end">end</div>{/if}
	</DynamicScroll>
</div>

<style>
	.app {
		max-height: 700px;
		height: calc(100% - 50px);
		width: 100%;
		overflow-y: hidden;
		border: solid 1px;
		box-sizing: border-box;
		border-radius: 10px;
	}
	p {
		text-align: center;
		height: 30px;
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
