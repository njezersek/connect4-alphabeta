<script lang="ts">
	import Slider from '@smui/slider';
	import Button from '@smui/button';
	import SegmentedButton, {Segment} from '@smui/segmented-button';
	import PlayerSelect from './PlayerSelect.svelte';
	import {Label} from '@smui/common';
	import Board from "./Board.svelte";
	import Game from "./Game";
	import LabeledSlider from './LabeledSlider.svelte';

	let menu = true;

	let width = 7;
	let height = 6;
	let connect = 4;

	let player1 = 'Human';
	let player2 = 'Computer';
	let player1_depth = 6;
	let player2_depth = 6;

	let onstart: () => void;

	let game: Game;
	$: game = new Game(width, height, connect);

	function newGame(){
		menu = false;
		game = new Game(width, height, connect);
		onstart();
	}
</script>

<main>
	<header>
		<h1>Connect <b>{connect}</b></h1>
		<img src="menu.png" alt="Settings" width="32" height="32" on:click={() => {if(menu && game.isEmpty()){onstart()}; menu = !menu}}>
	</header>
	<div class="container">
		<div class="menu {menu && "show"}">
			<div class="columns">
				<div class="column">
					<PlayerSelect title="Player 1" color="red" bind:player={player1} bind:player_depth={player1_depth}/>
				</div>
				<div class="column">
					<PlayerSelect title="Player 2" color="yellow" bind:player={player2} bind:player_depth={player2_depth} />
				</div>
			</div>
			<div class="space-between">
				<h2>Board size</h2>
				{#if width != 7 || height != 6 || connect != 4}
					<Button on:click={() => {width = 7; height = 6; connect = 4}}>reset</Button>
				{/if}
			</div>
			<div class="columns">
				<div class="column">
					<LabeledSlider label="Width:" bind:value={width} min={4} max={20} step={1}/>
				</div>
				<div class="column">
					<LabeledSlider label="Height:" bind:value={height} min={4} max={20} step={1}/>
				</div>
				<div class="column">
					<LabeledSlider label="Connect to win:" bind:value={connect} min={3} max={6} step={1}/>
				</div>
			</div>
			
			<div class="play-container">
				<Button on:click={newGame} variant="raised" style="padding: 24px 50px; font-size: 20px">Play</Button>
			</div>

		</div>

		   

		<div class="board" style="top: {menu ? 100 : 0}%">
			<Board {game} {player1} {player2} {player1_depth} {player2_depth} {newGame} bind:onstart></Board>
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

	h1 {
		color: #333;
		font-weight: 500;
	}
	h2{
		font-weight: 500;
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
		opacity: 0;
		transition: opacity 0.3s;
	}

	.menu.show {
		opacity: 1;
	}

	.columns {
		display: flex;
		width: 100%;
		justify-content: space-between;
		column-gap: 40px;
	}

	@media only screen and (max-width: 600px) {
		.columns  {
			flex-direction: column;
		}
	}

	.columns .column {
		width: 100%;
	}

	.play-container{
		text-align: center;
		margin-top: 50px;
	}

	.space-between{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.board {
		height: 100%;
		position: relative;
		transition-property: top;
		transition-duration: 0.3s;
		background-color: #fff;
	}
</style>