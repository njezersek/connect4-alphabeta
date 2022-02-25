export type Cell = -1 | 0 | 1;
export type Move = {x: number, y: number}

export default class Game{
	data: Cell[][];
	turn: 1 | -1;
	ended = false;
	winningTokens: Move[] = [];
	static symbols = {"1": "X", "0": " ", "-1": "O"} as const;
	constructor(public width, public height, public connect_n){
		this.turn = 1;
		this.data = new Array(this.height);
		for(let i = 0; i<this.data.length; i++){
			this.data[i] = new Array(this.width).fill(0);
		}
	}

	eval(){
		//povej ali je kdo zmagal
		const n = this.connect_n; //koliko znakov mora biti v vrsti
		let value = 0;
		const directions = [
			{x: 1, y: 0}, // vodoravno
			{x: 0, y: 1}, // navpicno
			{x: 1, y: 1}, // posevno dol
			{x: -1, y: 1}, // posevno gor
		];
		for(let dir of directions){
			for(let j=0-Math.min(dir.y, 0)*(n-1); j<this.height - Math.max(dir.y,0)*(n-1); j++){
				for(let i=0-Math.min(dir.x,0)*(n-1); i<this.width - Math.max(dir.x,0)*(n-1); i++){
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
					if(lineMax == this.connect_n)return Infinity;
					if(lineMin == this.connect_n)return -Infinity;
				}
			}
		}
		return value; //izenačeno
	}

	getCell(x: number, y: number){
		if(x >= 0 && x < this.width && y >= 0 && y < this.height){
			return this.data[y][x];
		}
	}

	getMoves(){
		//vrni vse možne poteze, ki so trenutno na voljo
		let moves: Move[] = [];
		for(let i=0; i<this.width; i++){
		  for(let j=this.height-1; j>=0; j--){
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
		).join("\n"+("-".repeat(this.width*4-3))+"\n");
	
		console.log(text);
	}

	isEmpty(){
		for(let i=0; i<this.width; i++){
			for(let j=0; j<this.height; j++){
				if(this.data[j][i] != 0){
					return false;
				}
			}
		}
		return true;
	}

	isEnded(){
		// find winning connection
		const directions = [
			{x: 1, y: 0}, // vodoravno
			{x: 0, y: 1}, // navpicno
			{x: 1, y: 1}, // posevno dol
			{x: -1, y: 1}, // posevno gor
		];
		for(let dir of directions){
			for(let j=0-Math.min(dir.y, 0)*(this.connect_n-1); j<this.height - Math.max(dir.y,0)*(this.connect_n-1); j++){
				for(let i=0-Math.min(dir.x,0)*(this.connect_n-1); i<this.width - Math.max(dir.x,0)*(this.connect_n-1); i++){
					// prestej koliko znakov je v vrsti
					let lineMax = 0;
					let lineMin = 0;
					let line: Move[] = [];
					for(let k=0; k<this.connect_n; k++){
						let cell = this.getCell(i+dir.x*k, j+dir.y*k);
						line.push({x: i+dir.x*k, y: j+dir.y*k});
						if(cell == 1)lineMax++;
						if(cell == -1)lineMin++;
					}

					if(lineMax == this.connect_n || lineMin == this.connect_n){
						this.ended = true;
						this.winningTokens = line;
						return true;
					}
				}
			}
		}

		return false;
	}

	copy(){
		let game = new Game(this.width, this.height, this.connect_n);

		for(let i=0; i<this.width; i++){
			for(let j=0; j<this.height; j++){
				game.data[j][i] = this.data[j][i];
			}
		}

		game.turn = this.turn;
		game.data = this.data;

		return game;
	}
}