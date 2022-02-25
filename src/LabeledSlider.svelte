<script lang="ts">
	import {Label} from '@smui/common';
	import Slider from '@smui/slider';

	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number;
	export let label: string;

	export let valueMap: (number) => string | undefined = undefined;
</script>

<div class="space-between">
	<Label for="{label}">{label}</Label>
	{#if valueMap}
		<div style="font-weight: 500">{valueMap(value)}</div>
	{:else}
		<div style="font-weight: 500">{value}</div>
	{/if}
</div>
<Slider bind:value id="{label}" {min} {max} {step} discrete tickMarks />

<style>
	.space-between{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>