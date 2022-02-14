<script lang="ts">
	import { onDestroy, onMount } from "svelte";
import AlphaBeta from "./AlphaBeta";
	import { roundRectPath } from "./canvasUtils";
	import Game from "./Game";
	export let game: Game;

	interface DroppingToken {
		x: number;
		y: number;
		vx: number;
		vy: number;
		tx: number;
		ty: number;
		player: -1 | 1;
		markForRemoval: boolean;
	}

	let c: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let container: HTMLDivElement;
	let pixelRatio = 1;
	let size = 1;
	let frame = 0.15;
	let offsetX = 0;
	let offsetY = 0;
	let padding = 0;

	let selectedColumn = -1;

	let droppingTokens: DroppingToken[] = [];

	onMount(() => {
		ctx = c.getContext("2d");	
		resize();
		tick(1);
	});

	function onmouseleave(e: MouseEvent){
		selectedColumn = -1;
	}

	function onmousemove(e: MouseEvent){
		selectedColumn = Math.floor((e.offsetX - size*frame) / size);
		if(selectedColumn < 0 || selectedColumn >= Game.width) selectedColumn = -1;
		if(e.offsetY < offsetY || e.offsetY > Game.height*size + offsetY) selectedColumn = -1;
	}

	function onclick(e: MouseEvent){
		drop(selectedColumn);
	}

	function drop(column: number){
		if(column < 0) return;
		if(droppingTokens.length > 0) return;
		let moves = game.getMoves()
		let droppingToken: DroppingToken = {x: column, y: -1, vx: 0, vy: 0, tx: 0, ty: 0, markForRemoval: false, player: game.turn};
		for(let m of moves){
			if(m.x == column){
				droppingToken.tx = m.x;
				droppingToken.ty = m.y;
			}
		}
		droppingTokens.push(droppingToken);
	}

	function update(dt: number){
		let playerToken = false;

		for(let droppingToken of droppingTokens){
			droppingToken.vy += 0.00003 * dt;
			droppingToken.y += droppingToken.vy * dt;
			
			if(droppingToken.y >= droppingToken.ty){
				droppingToken.y = droppingToken.ty;
				game.makeMove({x: droppingToken.tx, y: droppingToken.ty});

				if(droppingToken.player == 1) playerToken = true;

				droppingToken.markForRemoval = true;
			}
		}

		droppingTokens = droppingTokens.filter(t => !t.markForRemoval);

		if(playerToken){
			setTimeout(() => makeMove(), 1);
		}
	}
	
	function render(){
		size = 0;
		frame = 0.15;
		if(c.width / (Game.width+frame*2) < c.height/ (Game.height+frame*2)){
			size = Math.round(c.width / (Game.width+frame*2));
		}
		else{
			size = Math.round(c.height / (Game.height+frame*2));
		}
		padding = Math.round(size / 8);
		offsetX = Math.round((c.width - (Game.width * size)) / 2);
		offsetY = Math.round((c.height - (Game.height * size)) / 2);

		ctx.clearRect(0, 0, c.width, c.height);

		// frame
		roundRectPath(ctx, offsetX - size*frame + padding/2, offsetY - size*frame + padding/2, size*Game.width + (size*frame-padding/2)*2, size*Game.height + (size*frame-padding/2)*2, size/8);
		ctx.fillStyle = "#24a"
		ctx.fill();
		ctx.lineWidth = padding/3;
		ctx.strokeStyle = '#139';
		ctx.stroke();
		ctx.clearRect(offsetX, offsetY, size*Game.width, size*Game.height)

		// dropping token
		for(let droppingToken of droppingTokens){
			ctx.beginPath();
			ctx.arc(offsetX + Math.round(droppingToken.x*size+size/2), offsetY + Math.round(droppingToken.y*size+size/2), Math.round(size/2-padding/2), 0, 2 * Math.PI, false);
			ctx.fillStyle = droppingToken.player == 1 ? '#f00' : "#ff0";
			ctx.fill();
		}

		ctx.fillStyle = "#24a";
		ctx.fillRect(offsetX, offsetY - size*frame + padding/2, Game.width*size, size*frame);
		roundRectPath(ctx, offsetX - size*frame + padding/2, offsetY - size*frame + padding/2, size*Game.width + (size*frame-padding/2)*2, size*Game.height + (size*frame-padding/2)*2, size/8);
		ctx.lineWidth = padding/3;
		ctx.strokeStyle = '#139';
		ctx.stroke();

		// grid and tokens
		for(var x=0; x<Game.width; x++){
			for(var y=0; y<Game.height; y++){
				// grid
				ctx.fillStyle = "#24a";
				ctx.beginPath();
				ctx.arc(offsetX + Math.round(x*size+size/2), offsetY + Math.round(y*size+size/2), Math.round(size/2-padding/2), 0, 2 * Math.PI, false);
				ctx.rect(offsetX + Math.ceil(x*size+size), offsetY + Math.floor(y*size), Math.floor(-size), Math.ceil(size));
				ctx.fill();
		
				// token
				ctx.beginPath();
				ctx.arc(offsetX + Math.round(x*size+size/2), offsetY + Math.round(y*size+size/2), Math.round(size/2-padding/2), 0, 2 * Math.PI, false);
				if(game.getCell(x,y) != 0){
					ctx.fillStyle = game.getCell(x,y) == 1 ? '#f00' : '#ff0';
					ctx.fill();
				}

				ctx.lineWidth = padding/3;
				ctx.strokeStyle = '#139';
				ctx.stroke();
			}
		}

		// highlight
		if(selectedColumn >= 0){
			ctx.fillStyle = "rgba(0,0,0,0.1)";
			ctx.fillRect(offsetX + selectedColumn*size, offsetY - size*frame + padding/2, size, size * Game.height + size*frame*2 - padding);
		}
	}

	let lastTick = 0;

	function tick(t: number){
		let dt = t - lastTick;
		lastTick = t;
		update(dt);
		render();
		requestAnimationFrame(tick);
	}
	
	function resize(){
		let rect = container.getBoundingClientRect();
		c.width = rect.width;
		c.height = rect.height;
		pixelRatio = window.devicePixelRatio;
		render();
	}

	function makeMove(){
		let ai = new AlphaBeta(game);
		let decision = ai.decide(8, -Infinity, Infinity);
		setTimeout(() => drop(decision.move.x), 1);
	}
</script>

<div class="container" bind:this={container}>
	<div><button on:click={makeMove}>make move</button></div>
	<canvas bind:this={c} on:click={onclick} on:mousemove={onmousemove} on:mouseleave={onmouseleave}/>
</div>

<svelte:window on:resize|passive={resize}/>
<style>
	.container{
		height: 100%;
		position: relative;
	}

	canvas{
		width: 100%;
		height: 100%;
		display: block;
		position: absolute;
	}
</style>
