<script>
	import { tick, onMount } from 'svelte';

	/**
	 * @template {{id?:string}} V
	 */

	/**
	 * @type {<V>(lastValue:V|undefined)=>V[]}
	 */
	export let previousChunk = undefined;

	/**
	 * @type {<V>(lastValue:V|undefined)=>V[]}
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
	 * @type {(event:MouseEvent)=>void}
	 */
	export let onScrollCallback = undefined;

	/**
	 * @type {'x'|'y'} axis
	 */
	export let axis = 'y';

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

	$: isY = axis === '' || axis === 'y';

	function getScrollSize() {
		if (!container) return 0;
		return isY ? container.scrollHeight : container.scrollWidth;
	}

	function getClientSize() {
		if (!container) return 0;
		return isY ? container.clientHeight : container.clientWidth;
	}

	function getScrollPosition() {
		if (!container) return 0;
		return isY ? container.scrollTop : container.scrollLeft;
	}

	function getTriggerRange() {
		if (!container) return 0;
		return getClientSize() * triggerRangeRatio;
	}

	function scrollTo(scrollPosition) {
		if (!container) return;
		if (isY) {
			container.scrollTo(0, scrollPosition);
		} else {
			container.scrollTo(scrollPosition, 0);
		}
	}

	async function loadPrevious() {
		if (!previousChunk) return;
		if (!container) return;
		const beforeScrollSize = getScrollSize();
		const beforeScrollPosition = getScrollPosition();
		const prev = previousChunk(list.length === 0 ? undefined : list[0]);
		if (prev.length === 0) return;
		list = [...prev, ...list];
		await tick();
		const scrollValue = getScrollSize() - beforeScrollSize + beforeScrollPosition;
		scrollTo(scrollValue);
	}

	async function loadNext() {
		if (!nextChunk) return;
		if (!container) return;
		const beforeScrollPosition = getScrollPosition();
		const next = nextChunk(list.length === 0 ? undefined : list[list.length - 1]);
		if (next.length === 0) return;
		list = [...list, ...next];
		await tick();
		scrollTo(beforeScrollPosition);
	}

	/**
	 * @param {boolean} isKeepTop
	 */
	async function downSize(isKeepTop) {
		if (!container) return;
		if (bufferSize < 0) return;
		// previousChunk と nextChunk のどちらかがない場合は戻ることができないので downSize しない
		if (!previousChunk || !nextChunk) return;
		// for memory saving
		const beforeScrollPosition = getScrollPosition();
		const beforeScrollSize = getScrollSize();
		if (isKeepTop) {
			list = list.slice(0, bufferSize);
			await tick();
			scrollTo(beforeScrollPosition);
		} else {
			const sub = Math.max(0, list.length - bufferSize);
			list = list.slice(sub, sub + bufferSize);
			await tick();
			scrollTo(beforeScrollPosition - (beforeScrollSize - getScrollSize()));
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
				while (loadCount === 0 || getScrollSize() <= getClientSize()) {
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
			if (!!previousChunk && getScrollPosition() <= getTriggerRange()) {
				await loadPrevious();
				await downSize(true);
			} else if (
				!!nextChunk &&
				getScrollPosition() >= getScrollSize() - getClientSize() - getTriggerRange()
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
	style:overflow={isY ? 'hidden scroll' : 'scroll hidden'}
	style:display={isY ? 'block' : 'flex'}
	bind:this={container}
	on:scroll={async (event) => {
		await load();
		if (onScrollCallback) onScrollCallback(event);
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
