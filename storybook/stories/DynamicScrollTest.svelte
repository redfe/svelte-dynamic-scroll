<script>
	import DynamicScroll from '../../src/lib/DynamicScroll.svelte';
	$: axis = $$props.axis ?? 'y';
	$: isY = axis === 'y' || axis === '';
</script>

<div class="app">
	<div
		class="container"
		style:height={isY ? '300px' : undefined}
		style:width={isY ? '100px' : '300px'}
	>
		<DynamicScroll {...$$props} let:value let:index>
			<div class="row">{value}({index})</div>
		</DynamicScroll>
	</div>
</div>

<style>
	.row {
		padding: 10px;
	}
</style>
