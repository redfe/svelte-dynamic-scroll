<script>
	import { tick, onMount } from 'svelte';

	/**
	 * @typedef {any} Value
	 */

	/**
	 * @type {(lastValue:Value | undefined)=>Value[]}
	 */
	export let previousChunk = undefined;

	/**
	 * @type {(lastValue:Value | undefined)=>Value[]}
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
	 * @type {(event:UIEvent)=>void}
	 */
	export let onScrollCallback = undefined;

	/**
	 * @type {'x'|'y'} axis
	 */
	export let axis = 'y';

	/**
	 * @type {Value[]}
	 */
	let list = [];

	/**
	 * @type {HTMLUlListElement}
	 */
	let container;

	/**
	 * @type {boolean}
	 */
	let loading = false;

	/**
	 * @type {boolean}
	 */
	let isPrevious = false;

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
		const prev = await previousChunk(list.length === 0 ? undefined : list[0]);
		if (prev.length === 0) return;
		list = [...prev, ...list];
		await tick();
		const scrollValue = getScrollSize() - beforeScrollSize - beforeScrollPosition;
		scrollTo(scrollValue);
	}

	async function loadNext() {
		if (!nextChunk) return;
		if (!container) return;
		const next = await nextChunk(list.length === 0 ? undefined : list[list.length - 1]);
		if (next.length === 0) return;
		list = [...list, ...next];
		await tick();
	}

	/**
	 * @param {boolean} isKeepPrevious
	 */
	async function downSize(isKeepPrevious) {
		if (!container) return;
		if (bufferSize < 0) return;
		if (list.length <= bufferSize) return;
		// previousChunk と nextChunk のどちらかがない場合は戻ることができないので downSize しない
		if (!previousChunk || !nextChunk) return;
		// for memory saving
		const beforeScrollPosition = getScrollPosition();
		const beforeScrollSize = getScrollSize();
		if (isKeepPrevious) {
			list = list.slice(0, bufferSize);
			await tick();
			scrollTo(beforeScrollPosition);
		} else {
			const sub = Math.max(0, list.length - bufferSize);
			list = list.slice(sub);
			await tick();
			scrollTo(beforeScrollPosition - (beforeScrollSize - getScrollSize()));
		}
	}

	async function handleOnScroll(event) {
		await load();
		if (onScrollCallback) await onScrollCallback(event);
	}

	function addScrollEventListener() {
		if (!container) return;
		container.addEventListener('scroll', handleOnScroll);
	}

	function removeScrollEventListener() {
		if (!container) return;
		container.removeEventListener('scroll', handleOnScroll);
	}

	async function executeLoad(loadFunc) {
		loading = true;
		removeScrollEventListener();
		try {
			await loadFunc();
		} finally {
			loading = false;
			addScrollEventListener();
		}
	}

	async function load() {
		if (!container) return;
		if (loading) return;
		if (!!previousChunk && getScrollPosition() <= getTriggerRange()) {
			isPrevious = true;
			await executeLoad(async () => {
				await loadPrevious();
				await downSize(true);
			});
		} else if (
			!!nextChunk &&
			getScrollPosition() >= getScrollSize() - getClientSize() - getTriggerRange()
		) {
			isPrevious = false;
			await executeLoad(async () => {
				await loadNext();
				await downSize(false);
			});
		}
	}

	async function executePreLoad(loadFunc) {
		// 画面いっぱいに表示するまでロードする
		let loadCount = 0;
		while (loadCount === 0 || getScrollSize() <= getClientSize()) {
			loadCount++;
			await loadFunc();
			await tick();
			if (list.length === 0) return;
			if (maxRetryCountOnPreLoad < loadCount) {
				break;
			}
		}
	}

	async function preLoad() {
		if (!container) return;
		await executePreLoad(loadNext);
		await tick();
		await executePreLoad(loadPrevious);
		await tick();
		await downSize(true);
	}

	onMount(async () => {
		await preLoad();
		addScrollEventListener();
	});
</script>

<ul
	class="container"
	style:overflow={isY ? 'hidden scroll' : 'scroll hidden'}
	style:display={isY ? 'block' : 'flex'}
	role="listbox"
	bind:this={container}
>
	{#if loading && isPrevious}<li><slot name="loading" /></li>{/if}
	{#each list as value, index (value.id ?? value)}
		<li><slot {index} {value} /></li>
	{/each}
	{#if loading && !isPrevious}<li><slot name="loading" /></li>{/if}
</ul>

<style>
	.container {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		/* for mobile phone */
		overscroll-behavior: none;
	}
	ul {
		padding: 0;
		margin: 0;
	}
	li {
		list-style: none;
	}
</style>
