<script lang="ts">
	import Slider from '@smui/slider';
	import SegmentedButton, {Segment} from '@smui/segmented-button';
	import {Label} from '@smui/common';
import LabeledSlider from './LabeledSlider.svelte';

	export let player: string;
	export let player_depth: number;
	export let title = "Player";
	export let color = "red";

	let choices = ["Human", "Computer"];

	function valueMap(n){
		if(n == 0){
			return "Monkey"
		}
		else if(n <= 2){
			return "Very easy"
		}
		else if(n <= 4){
			return "Easy"
		}
		else if(n <= 6){
			return "Medium"
		}
		else if(n <= 8){
			return "Hard"
		}
		else{
			return "Very hard"
		}
	}
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
	<div style="padding-top: 10px"></div>
	{#if player === "Computer"}
		<LabeledSlider label="Difficulty (depth)" bind:value={player_depth} min={0} max={10} step={1} valueMap={valueMap}/>
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
		background-color: #e22d2d;
		border: 3px solid #f76d6d;
	}

	.token.yellow{
		background-color: #fffb00;
		border: 3px solid #ffe819;
	}
</style>