<script>
	import DynamicScroll from '../../src/lib/DynamicScroll.svelte';
	$: isY = ($$props.axis ?? 'y') === 'y';
</script>

<div class="app">
	<div
		class="container"
		style:height={isY ? '300px' : undefined}
		style:width={isY ? '100px' : '300px'}
	>
		<DynamicScroll {...$$props} let:prop={{ value }}>
			<div class="row">{value}</div>
		</DynamicScroll>
	</div>
</div>

<style>
	.row {
		padding: 10px;
	}
</style>
