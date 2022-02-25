<script lang="ts">
	import Slider from '@smui/slider';
	import SegmentedButton, {Segment} from '@smui/segmented-button';
	import {Label} from '@smui/common';

	export let player: string;
	export let player_depth: number;
	export let title = "Player";
	export let color = "red";

	let choices = ["Human", "Computer"];
</script>

<div class="player-select red">
	<div class="title-bar">
		<h2>{title}</h2>
		<div class="token {color}"></div>
	</div>
	<SegmentedButton segments={choices} let:segment singleSelect bind:selected={player} style="display: flex">
		<Segment {segment} style="width: 100%; justify-content: center">
			<Label>{segment}</Label>
		</Segment>
	</SegmentedButton>
	{#if player === "Computer"}
		<Label for="depth" style="margin-top: 10px; display: block">Difficulty (depth)</Label>
		<Slider bind:value={player_depth} id="depth" min={0} max={10} step={1} discrete tickMarks />
	{/if}
</div>

<style>
	h2{
		font-weight: 500;
	}

	.player-select{
		min-height: 187px;
		margin-bottom: 20px;
	}

	.title-bar{
		display: flex;
		justify-content: space-between;
		column-gap: 20px;
		align-items: center;
	}

	.token{
		width: 30px;
		height: 30px;
		border-radius: 20px;
	}

	.token.red{
		background-color: #e22d3c;
		border: 3px solid #f76d6d;
	}

	.token.yellow{
		background-color: #ffdd1d;
		border: 3px solid #ffe819;
	}
</style>