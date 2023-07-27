<script>
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Dynamic Scroll Examples</title>
	<meta name="description" content="Dynamic scroll Examples" />
</svelte:head>

<div class="top">
	<nav>
		<a href={`${base}/`}>Home</a>
		<a href={`${base}/simple`}>Simple</a>
		<a href={`${base}/datetime`}>Datetime</a>
		<span />
		<a href={`${base}/storybook-static`} target="_blank"
			><img src={`${base}/storybook.svg`} title="Storybook Tests" alt="Storybook Tests" /></a
		>
		<a href="https://github.com/redfe/svelte-dynamic-scroll" target="_blank"
			><img src={`${base}/github-mark.svg`} title="GitHub Repo" alt="GitHub Repo" /></a
		>
	</nav>
	<main>
		<slot />
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
	}
	:global(:has(> .top)) {
		padding: 0;
		margin: 0;
		display: flex !important;
		justify-content: center;
	}
	.top {
		width: 100%;
		max-width: 500px;
	}
	nav {
		height: 30px;
		display: flex;
		column-gap: 10px;
		margin-top: 10px;
		padding: 0 20px;
		box-sizing: border-box;
	}
	nav *:nth-child(4) {
		flex-grow: 1;
		text-align: right;
	}
	main {
		width: 100%;
		height: calc(100vh - 70px);
		padding: 20px;
		box-sizing: border-box;
	}
	img {
		width: 20px;
		height: 20px;
	}
</style>
