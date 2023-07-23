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
	}
	main {
		height: calc(100vh - 40px);
	}
</style>
