import Game, { Move } from "./Game";

type Result = {move?: Move, value: number};

export default class AlphaBeta{

	max_depth = 4;

	constructor(private game: Game){

	}

	decide(depth: number, alpha: number, beta: number) : Result{
		if(depth <= 0){
			let value = this.game.eval().value;
			return {move: undefined, value};
		}

		let moves = this.game.getMoves();
		let turn = this.game.turn;
		let value = -Infinity * turn;
		let best_move = undefined;

		for(let move of moves){
			if(alpha >= beta){
				return {move: best_move, value};
			}

			this.game.makeMove(move);

			let v = this.decide(depth - 1, alpha, beta).value;
			if((turn == 1 && v > value) || (turn == -1 && v < value)){
				value = v
				best_move = move;
			}
			if(turn == 1){
				if(v > alpha){
					alpha = v;
				}
			}
			if(turn == -1){
				if(v < beta){
					beta = v;
				}
			}
			
			this.game.undoMove(move);
		}

		return {move: best_move, value};

	}
}