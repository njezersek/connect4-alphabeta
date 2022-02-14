export type Cell = -1 | 0 | 1;
export type Move = {x: number, y: number}

export default class Game{
	data: Cell[][];
	turn: 1 | -1;
	static width = 7 as const;
	static height = 6 as const;
	static connect_n = 4 as const;
	static symbols = {"1": "X", "0": " ", "-1": "O"} as const;
	constructor(){
		this.turn = 1;
		this.data = new Array(Game.height);
		for(let i = 0; i<this.data.length; i++){
			this.data[i] = new Array(Game.width).fill(0);
		}
	}

	eval(){
		//povej ali je kdo zmagal
		const n = Game.connect_n; //koliko znakov mora biti v vrsti
		let value = 0;
		let win = 0;
		const directions = [
			{x: 1, y: 0}, // vodoravno
			{x: 0, y: 1}, // navpicno
			{x: 1, y: 1}, // posevno dol
			{x: -1, y: 1}, // posevno gor
		];
		for(let dir of directions){
			for(let j=0-Math.min(dir.y, 0)*(n-1); j<Game.height - Math.max(dir.y,0)*(n-1); j++){
				for(let i=0-Math.min(dir.x,0)*(n-1); i<Game.width - Math.max(dir.x,0)*(n-1); i++){
					// prestej koliko znakov je v vrsti
					let lineMax = 0;
					let lineMin = 0;
					let linePossible = true;

					for(let k=0; k<n; k++){
						let cell = this.getCell(i+dir.x*k, j+dir.y*k);
						if(cell == 1)lineMax++;
						if(cell == -1)lineMin++;
						if(cell === undefined){
							linePossible = false;
						}
					}

					if(linePossible){
						if(lineMax == 0) value -= 100**lineMin;
						if(lineMin == 0) value += 100**lineMax;
					}
					if(lineMax == 4)win = 1;
					if(lineMin == 4)win = -1;
				}
			}
		}
		return {value, win}; //izenačeno
	}

	getCell(x: number, y: number){
		if(x >= 0 && x < Game.width && y >= 0 && y < Game.height){
			return this.data[y][x];
		}
	}

	getMoves(){
		//vrni vse možne poteze, ki so trenutno na voljo
		let moves: Move[] = [];
		for(let i=0; i<Game.width; i++){
		  for(let j=Game.height-1; j>=0; j--){
			if(this.data[j][i] == 0){
			  moves.push({x: i, y: j});
			  break;
			}
		  }
		}
		return moves;
	}

	makeMove(move: Move){
		this.data[move.y][move.x] = this.turn;
		this.turn *= -1;

		return this;
	}

	undoMove(move: Move){
		this.data[move.y][move.x] = 0;
		this.turn *= -1;

		return this;
	}

	renderToConsole(){
		let text = this.data.map(
		  row => row.map(c => Game.symbols[c]).join(" | ")
		).join("\n"+("-".repeat(Game.width*4-3))+"\n");
	
		console.log(text);
	}

	copy(){
		let game = new Game();

		for(let i=0; i<Game.width; i++){
			for(let j=0; j<Game.height; j++){
				game.data[j][i] = this.data[j][i];
			}
		}

		game.turn = this.turn;
		game.data = this.data;

		return game;
	}
}