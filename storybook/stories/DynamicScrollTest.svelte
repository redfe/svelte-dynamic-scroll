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
			{#if isY}
				<div class="row">
					{value}({index})
				</div>
			{:else}
				<div class="row" style:width={'35px'} style:overflow-x={'hidden'}>
					{value}<br />({index})
				</div>
			{/if}
		</DynamicScroll>
	</div>
</div>

<style>
	.row {
		padding: 10px;
	}
</style>
