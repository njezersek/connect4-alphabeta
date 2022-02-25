<script lang="ts">
	import {Label} from '@smui/common';
	import Slider from '@smui/slider';

	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number;
	export let label: string;
</script>

<div class="space-between">
	<Label for="{label}">{label}</Label>
	<div style="font-weight: 500">{value}</div>
</div>
<Slider bind:value id="{label}" {min} {max} {step} discrete tickMarks />

<style>
	.space-between{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>