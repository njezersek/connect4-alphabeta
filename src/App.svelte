<script lang="ts">
	import Board from "./Board.svelte";
	import Game from "./Game";

	export let name: string;

	let game = new Game();
</script>

<main>
	<h1>Connect 4</h1>
	<Board {game}></Board>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		max-width: 1000px;
		margin: 0 auto;
		height: 100%;
	}

	div {
		background-color: aquamarine;
		height: 100%;
	}

	h1 {
		
	}
</style>