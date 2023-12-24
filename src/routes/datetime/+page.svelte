<script>
	import { DynamicScroll } from '$lib/index.js';
	import { fade } from 'svelte/transition';
	import { types, formatDate, parseDate, isOverPrevious, isOverNext } from './dateUtils.js';

	const chunkSize = 20;
	const triggerRangeRatio = 0.3;

	/**
	 * @typedef {import('./types.d.ts').DateValue} DateValue
	 */

	let selected = types[6];
	let list = [createValue(new Date(2020, 0, 1))];
	let initialDatetime = selected.startOf(list[0].datetime);

	/**
	 * @type {HTMLDivElement}
	 */
	let timelineElement;

	/**
	 * @returns {HTMLDivElement | undefined}
	 */
	function selectTopRowElement() {
		if (!timelineElement) return undefined;
		return /** @type HTMLDivElement */ (
			document.elementFromPoint(
				// border 分を考慮しての 2px 足す。
				timelineElement.offsetLeft + 2,
				// できるだけ日時が見えているものを優先したいので 50px 足す。
				timelineElement.offsetTop + 50
			)
		);
	}

	/**
	 * @returns {void}
	 */
	function changeInitialDatetime() {
		const topRowElement = selectTopRowElement();
		if (topRowElement) {
			list = undefined;
			scrollPosition = undefined;
			initialDatetime = selected.startOf(parseDate(topRowElement.dataset?.datetime));
		}
	}

	/**
	 * @param {Date} datetime
	 * @returns {DateValue}
	 */
	function createValue(datetime) {
		return { id: selected.format(datetime), datetime: datetime };
	}

	/**
	 * @returns {Promise<void>}
	 */
	async function dummyWait() {
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	/**
	 * @param {DateValue=} lastValue
	 * @returns {Promise<DateValue[]>}
	 */
	async function previousChunk(lastValue) {
		await dummyWait();
		let _last = lastValue ?? createValue(selected.increment(initialDatetime, 1));
		if (isOverPrevious(_last.datetime)) return !lastValue ? [_last] : [];
		let array = [];
		for (let i = 0; i < chunkSize; i++) {
			const newDatetime = selected.increment(_last.datetime, -(i + 1));
			if (isOverPrevious(newDatetime)) {
				return array.reverse();
			}
			array.push(createValue(newDatetime));
		}
		return array.reverse();
	}

	/**
	 * @param {DateValue=} lastValue
	 * @returns {Promise<DateValue[]>}
	 */
	async function nextChunk(lastValue) {
		await dummyWait();
		let _last = lastValue ?? createValue(selected.increment(initialDatetime, -1));
		if (isOverNext(_last.datetime)) return !lastValue ? [_last] : [];
		let array = [];
		for (let i = 0; i < chunkSize; i++) {
			const newDatetime = selected.increment(_last.datetime, i + 1);
			if (isOverNext(newDatetime)) {
				return array;
			}
			array.push(createValue(newDatetime));
		}
		return array;
	}

	/**
	 * @param {MouseEvent} event
	 * @param {DateValue} value
	 * @returns {void}
	 */
	function changeTypeOnClick(event, value) {
		const i = types.indexOf(selected);
		const next = event.shiftKey ? i - 1 : i + 1;
		if (next < 0 || next > types.length - 1) return;
		selected = types[next];
		initialDatetime = selected.startOf(value.datetime);
	}

	let scrollPosition;
</script>

<p>scrollPosition:{scrollPosition}</p>
<div class="app">
	<header>
		<select bind:value={selected} on:change={changeInitialDatetime}>
			{#each types as type (type.label)}
				<option value={type}>{type.label}</option>
			{/each}
		</select>
	</header>
	<div class="timeline" bind:this={timelineElement}>
		{#key initialDatetime}
			<DynamicScroll
				{previousChunk}
				{nextChunk}
				{triggerRangeRatio}
				bufferSize={100}
				let:index
				let:value
				bind:list
				bind:scrollPosition
			>
				{@const _value = /** @type DateValue */ (value)}
				<div class="loading" slot="loading">loading...</div>
				<div
					class="row"
					class:now={_value.datetime <= new Date() &&
						new Date() < selected.increment(_value.datetime, 1)}
					data-datetime={formatDate(_value.datetime)}
					transition:fade={{ duration: 500 }}
				>
					<div
						role="button"
						tabindex={index}
						class="row-title"
						on:click={(e) => changeTypeOnClick(e, _value)}
						on:keydown={() => {}}
					>
						{selected.format(_value.datetime)}
					</div>
				</div>
			</DynamicScroll>
		{/key}
	</div>
	<div class="end" />
</div>

<style>
	.app {
		height: calc(100% - 50px);
		width: 100%;
		border: solid 1px;
		border-radius: 10px;
		overflow-y: hidden;
		--header-height: 60px;
	}
	p {
		text-align: center;
		height: 30px;
	}
	header {
		background-color: silver;
		display: flex;
		justify-content: center;
		padding: 10px;
		height: var(--header-height);
		box-sizing: border-box;
	}
	select {
		margin: 0;
	}
	.timeline {
		height: calc(100% - var(--header-height));
	}
	.row {
		border: none;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		height: 100px;
		width: 100%;
		overflow: hidden;
		padding: 20px;
		box-sizing: border-box;
	}
	.row-title {
		cursor: pointer;
		user-select: none;
		display: block;
		text-align: center;
	}
	.row-title:hover {
		border-bottom: 1px solid rgba(0, 0, 0, 0.5);
	}
	.now {
		background-color: rgb(247, 243, 43) !important;
	}
	.loading {
		text-align: center;
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>
