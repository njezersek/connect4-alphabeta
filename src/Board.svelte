<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import AlphaBeta from "./AlphaBeta";
	import { roundRectPath } from "./canvasUtils";
	import Game from "./Game";
	export let game: Game;


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

	let movesHistory: number[] = [];
	let playerMoves = [3,2,3,3,2,6,5,5,6,6,6,0,0,0,1,5,4];

	let droppingToken = {x: -1, y: -1, vx: 0, vy: 0, tx: 0, ty: 0, dropping: false, size: 1, player: game.turn, hide: true};

	onMount(() => {
		ctx = c.getContext("2d");	
		resize();
		tick(1);
	});


	function onmouseleave(e: MouseEvent){
		selectedColumn = -1;
	}

	function onmousemove(e: MouseEvent){
		selectedColumn = Math.floor((e.offsetX*pixelRatio - offsetX) / size);
		if(selectedColumn < 0 || selectedColumn >= Game.width) selectedColumn = -1;
		if(e.offsetY*pixelRatio < offsetY || e.offsetY*pixelRatio > Game.height*size + offsetY) selectedColumn = -1;

		if(!droppingToken.dropping){
			if(selectedColumn < 0) droppingToken.hide = true;
			else droppingToken.hide = false;
		} 

	}

	function onclick(e: MouseEvent){
		drop(selectedColumn);
	}

	function drop(column: number){
		movesHistory = [...movesHistory, column];


		if(column < 0) return;
		if(droppingToken.dropping) return;
		let moves = game.getMoves()
		droppingToken = {x: column, y: -1, vx: 0, vy: 0, tx: 0, ty: 0, dropping: true, size: 1, player: game.turn, hide: false};
		for(let m of moves){
			if(m.x == column){
				droppingToken.tx = m.x;
				droppingToken.ty = m.y;
				return;
			}
		}
	}

	function update(dt: number){

		let playerToken = false;

		if(droppingToken.dropping){		
			droppingToken.vy += 0.00003 * dt;
			droppingToken.y += droppingToken.vy * dt;
			
			if(droppingToken.y >= droppingToken.ty){
				droppingToken.y = droppingToken.ty;
				game.makeMove({x: droppingToken.tx, y: droppingToken.ty});
				
				if(droppingToken.player == -1) playerToken = true;
				
				droppingToken.dropping = false;
				droppingToken.y = -1;
				droppingToken.size = -0.5;
				droppingToken.player = game.turn;
			}
		}
		else if(!droppingToken.hide){
			droppingToken.x += (selectedColumn - droppingToken.x) * 0.01 * dt;
			droppingToken.size += 0.1;
			if(droppingToken.size >= 1)droppingToken.size = 1;
		}
		else{
			droppingToken.size -= 0.1;
			if(droppingToken.size < 0)droppingToken.size = 0;
		}

		if(playerToken){
			setTimeout(() => makeMove(), 1);
		}
	}
	
	function render(){
		size = 0;
		frame = 0.15;
		if(c.width / (Game.width+frame*2) < c.height/ (Game.height+1+frame*2)){
			size = Math.round(c.width / (Game.width+frame*2));
		}
		else{
			size = Math.round(c.height / (Game.height+1+frame*2));
		}
		padding = Math.round(size / 8);
		offsetX = Math.round((c.width - Game.width * size) / 2);
		offsetY = Math.round((c.height - (Game.height+1) * size) / 2);

		ctx.clearRect(0, 0, c.width, c.height);

		// frame
		roundRectPath(ctx, offsetX - size*frame + padding/2, offsetY - size*frame + padding/2 + size, size*Game.width + (size*frame-padding/2)*2, size*Game.height + (size*frame-padding/2)*2, size/8);
		ctx.fillStyle = "#24a"
		ctx.fill();
		ctx.lineWidth = padding/3;
		ctx.strokeStyle = '#139';
		ctx.stroke();
		ctx.clearRect(offsetX, offsetY+size, size*Game.width, size*Game.height)

		// dropping token
		if(droppingToken.x >= 0){
			ctx.beginPath();
			ctx.arc(offsetX + Math.round(droppingToken.x*size+size/2), offsetY + Math.round(droppingToken.y*size+size/2) + size, Math.max(0, droppingToken.size) * Math.round(size/2-padding/2), 0, 2 * Math.PI, false);
			ctx.fillStyle = droppingToken.player == 1 ? '#f00' : "#ff0";
			ctx.fill();
		}

		ctx.fillStyle = "#24a";
		ctx.fillRect(offsetX, offsetY - size*frame + padding/2 + size, Game.width*size, size*frame);
		roundRectPath(ctx, offsetX - size*frame + padding/2, offsetY - size*frame + padding/2 + size, size*Game.width + (size*frame-padding/2)*2, size*Game.height + (size*frame-padding/2)*2, size/8);
		ctx.lineWidth = padding/3;
		ctx.strokeStyle = '#139';
		ctx.stroke();

		// grid and tokens
		for(var x=0; x<Game.width; x++){
			for(var y=0; y<Game.height; y++){
				// grid
				ctx.fillStyle = "#24a";
				ctx.beginPath();
				ctx.arc(offsetX + Math.round(x*size+size/2), offsetY + Math.round(y*size+size/2) + size, Math.round(size/2-padding/2), 0, 2 * Math.PI, false);
				ctx.rect(offsetX + Math.ceil(x*size+size), offsetY + Math.floor(y*size) + size, Math.floor(-size), Math.ceil(size));
				ctx.fill();
		
				// token
				ctx.beginPath();
				ctx.arc(offsetX + Math.round(x*size+size/2), offsetY + Math.round(y*size+size/2) + size, Math.round(size/2-padding/2), 0, 2 * Math.PI, false);
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
			ctx.fillRect(offsetX + selectedColumn*size, offsetY - size*frame + padding/2 + size, size, size * Game.height + size*frame*2 - padding);

			// ctx.beginPath();
			// ctx.arc(offsetX + Math.round(selectedColumn*size+size/2), offsetY + Math.round(-size+size/2) + size, Math.round(size/2-padding/2), 0, 2 * Math.PI, false);
			// ctx.fillStyle = game.turn ? '#f00' : "#ff0";
			// ctx.fill();
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
		pixelRatio = window.devicePixelRatio;
		c.width = rect.width * pixelRatio;
		c.height = rect.height * pixelRatio;
		render();
	}

	async function makeMove(){
		let ai = new AlphaBeta(game);
		let decision = ai.decide(7, -Infinity, Infinity);
		console.log(decision);
		setTimeout(() => drop(decision.move.x), 1);
	}
</script>
<button on:click={() => makeMove()}>Move</button>
<button on:click={() => console.log("eval", game.eval())}>Eval</button>
<div>{movesHistory.join(", ")}</div>
<div class="container" bind:this={container}>
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
