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
		width: 500px;
	}
	nav {
		height: 30px;
		display: flex;
		column-gap: 10px;
		margin-top: 10px;
	}
	nav a:last-child {
		flex-grow: 1;
		text-align: right;
	}
	main {
		height: calc(100vh - 50px);
	}
	img {
		width: 20px;
		height: 20px;
	}
</style>
