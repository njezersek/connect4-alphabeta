import type Game from "./Game";
import type { Move } from "./Game";

type Result = {move?: Move, value: number};

export default class AlphaBeta{

	max_depth = 4;

	constructor(private game: Game){

	}

	decide(depth: number, alpha: number, beta: number) : Result{
		let moves = this.game.getMoves();
		let turn = this.game.turn;
		let value = -Infinity * turn;
		let best_move = undefined;

		if(alpha >= beta){
			return {move: best_move, value: Infinity * turn};
		}
		let summary = "";
		for(let move of moves){

			this.game.makeMove(move);
			let e = this.game.eval();
			let v = 0;

			if(depth <= 0 || Math.abs(e) == Infinity){ // LEAF NODE: value is equal to the board evaluation
				v = e;
			}
			else{ // BRANCH NODE: value is computed recursivly
				v = this.decide(depth - 1, alpha, beta).value;
			}
			
			if((turn == 1 && v >= value) || (turn == -1 && v <= value)){
				value = v
				best_move = move;
			}
			// update alpha, beta
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

			if(depth == 7)summary += " " + v;
			
			this.game.undoMove(move);
		}

		if(depth == 7)console.log(summary);
		return {move: best_move, value};

	}
}