<script lang="ts">
	import Slider from '@smui/slider';
	import Board from "./Board.svelte";
	import Game from "./Game";

	export let name: string;

	let menu = true;

	let value = 6;

	let game = new Game();
</script>

<main>
	<header>
		<h1>Connect <b>n</b></h1>
		<img src="menu.png" alt="Settings" width="32" height="32" on:click={() => menu = !menu}>
	</header>
	<div class="container">
		<div class="menu">
			<Slider
				bind:value
				min={0}
				max={10}
				step={1}
				discrete
				tickMarks
				input$aria-label="Tick mark slider"
			/>
		
			<button on:click={() => menu = false}>Play</button>
			
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