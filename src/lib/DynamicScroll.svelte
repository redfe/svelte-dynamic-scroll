<script>
	import { tick, onMount } from 'svelte';

	/**
	 * @template {{id?:string}} V
	 */

	/**
	 * @param {V|undefined} lastValue
	 * @returns {V[]}
	 */
	export let previousChunk = undefined;

	/**
	 * @param {V|undefined} lastValue
	 * @returns {V[]}
	 */
	export let nextChunk = undefined;

	// スマホだと描画に難あり
	/**
	 * @type {number}
	 */
	export let bufferSize = -1;

	/**
	 * @type {number}
	 */
	export let triggerRangeRatio = 0.1;

	/**
	 * @type {number}
	 */
	export let maxRetryCountOnPreLoad = 20;

	/**
	 * @param {MouseEvent} event
	 * @returns {void}
	 */
	export let onScrollCallback = undefined;

	/**
	 * @type {V[]}
	 */
	let list = [];

	/**
	 * @type {HTMLDivElement}
	 */
	let container;

	/**
	 * @type {boolean}
	 */
	let loading = false;

	function getTriggerRange() {
		return !container ? 0 : container.clientHeight * triggerRangeRatio;
	}

	async function loadPrevious() {
		if (!previousChunk) return;
		if (!container) return;
		const beforeScrollHeight = container.scrollHeight;
		const beforeScrollTop = container.scrollTop;
		const prev = previousChunk(list.length === 0 ? null : list[0]);
		if (prev.length === 0) return;
		list = [...prev, ...list];
		await tick();
		container.scrollTo(0, container.scrollHeight - beforeScrollHeight + beforeScrollTop);
	}

	async function loadNext() {
		if (!nextChunk) return;
		if (!container) return;
		const beforeScrollTop = container.scrollTop;
		const next = nextChunk(list.length === 0 ? null : list[list.length - 1]);
		if (next.length === 0) return;
		list = [...list, ...next];
		await tick();
		container.scrollTo(0, beforeScrollTop);
	}

	/**
	 * @param {boolean} isKeepTop
	 */
	async function downSize(isKeepTop) {
		if (!container) return;
		if (bufferSize < 0) return;
		// for memory saving
		const beforeScrollTop = container.scrollTop;
		const beforeScrollHeight = container.scrollHeight;
		let _isKeepTop = (isKeepTop && !!nextChunk) || (!isKeepTop && !previousChunk);
		if (_isKeepTop) {
			list = list.slice(0, bufferSize);
			await tick();
			container.scrollTo(0, beforeScrollTop);
		} else {
			list = list.slice(list.length - bufferSize, bufferSize);
			await tick();
			container.scrollTo(0, container.scrollHeight - beforeScrollHeight + beforeScrollTop);
		}
	}

	async function preLoad() {
		if (!container) return;
		if (loading) return;
		loading = true;
		try {
			const loadInternal = async (loadFunc) => {
				// 画面いっぱいに表示するまでロードする
				let loadCount = 0;
				while (loadCount === 0 || container.scrollHeight <= container.clientHeight) {
					loadCount++;
					await loadFunc();
					if (list.length === 0) return;
					await tick();
					if (maxRetryCountOnPreLoad < loadCount) {
						break;
					}
				}
			};
			await loadInternal(loadNext);
			await tick();
			await loadInternal(loadPrevious);
			await tick();
			await downSize(true);
		} finally {
			loading = false;
		}
	}

	async function load() {
		if (!container) return;
		if (loading) return;
		loading = true;
		try {
			if (!!previousChunk && container.scrollTop <= getTriggerRange()) {
				await loadPrevious();
				await downSize(true);
			} else if (
				!!nextChunk &&
				container.scrollTop >= container.scrollHeight - container.clientHeight - getTriggerRange()
			) {
				await loadNext();
				await downSize(false);
			}
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		await preLoad();
	});
</script>

<ul
	class="container"
	bind:this={container}
	on:scroll={async (event) => {
		await load();
		if (!!onScrollCallback) onScrollCallback(event);
	}}
>
	{#each list as value, index (value.id ?? value)}
		<li><slot prop={{ index, value }} /></li>
	{/each}
</ul>

<style>
	.container {
		width: 100%;
		height: 100%;
		overflow-y: scroll;
		box-sizing: border-box;
	}
	ul {
		padding: 0;
		margin: 0;
	}
	li {
		list-style: none;
	}
</style>
