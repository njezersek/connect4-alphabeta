<script lang="ts">
	import Slider from '@smui/slider';
	import Button from '@smui/button';
	import SegmentedButton, {Segment} from '@smui/segmented-button';
	import {Label} from '@smui/common';
	import Board from "./Board.svelte";
	import Game from "./Game";

	export let name: string;

	let menu = false;

	let depth = 6;
	let width = 7;
	let height = 6;

	let choices = ['Morning', 'Afternoon', 'Evening', 'Night'];
	let selected = 'Morning';

	let game = new Game();

	game.eval();
</script>

<main>
	<header>
		<h1>Connect <b>n</b></h1>
		<img src="menu.png" alt="Settings" width="32" height="32" on:click={() => menu = !menu}>
	</header>
	<div class="container">
		<div class="menu">
			<Label for="depth">Depth</Label>
			<Slider bind:value={depth} id="depth" min={0} max={10} step={1} discrete tickMarks />
			<div class="columns">
				<div class="column">
					<Label for="width">Width</Label>
					<Slider bind:value={depth} id="width" min={3} max={20} step={1} discrete tickMarks />
				</div>
				<div class="column">
					<Label for="height">Height</Label>
					<Slider bind:value={depth} id="height" min={3} max={20} step={1} discrete tickMarks />
				</div>
			</div>
		
			<Button on:click={() => menu = false} variant="raised">Play</Button>
			
			<SegmentedButton segments={choices} let:segment singleSelect bind:selected>
				<Segment {segment}>
					<Label>{segment}</Label>
				</Segment>
			</SegmentedButton>
		</div>

		   

		<div class="board" style="top: {menu ? 100 : 0}%">
			<Board {game}></Board>
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		max-width: 1000px;
		margin: 0 auto;
		height: 100%;
		overflow: hidden;
	}

	header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30px;
	}

	.container{
		height: 100%;
		position: relative;
	}

	.menu{
		position: absolute;
		width: 100%;
		padding: 30px;
		box-sizing: border-box;
	}

	.columns {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	.columns .column {
		width: 100%;
	}

	.board {
		height: 100%;
		position: relative;
		transition-property: top;
		transition-duration: 0.3s;
		background-color: #fff;
	}

	h1 {
		color: #333;
		font-weight: 500;
	}
</style>