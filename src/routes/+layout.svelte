<svelte:head>
	<title>Dynamic Scroll Examples</title>
	<meta name="description" content="Dynamic scroll Examples" />
</svelte:head>

<div class="top">
	<nav>
		<a href="/">Home</a>
		<a href="/simple">Simple</a>
		<a href="/datetime">Datetime</a>
	</nav>
	<main>
		<slot />
	</main>
</div>

<style>
	:global(:has(> .top)) {
		padding: 0;
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
		height: calc(100vh - 50px);
	}
</style>
