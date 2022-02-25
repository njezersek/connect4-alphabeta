import type Game from "./Game";
import type { Move } from "./Game";

type Result = {move?: Move, value: number};

export default class AlphaBeta{
	constructor(private game: Game, public depth: number){

	}

	private decideRecursion(depth: number, alpha: number, beta: number) : Result{
		let moves = this.game.getMoves();
		if(moves.length == 0) return {move: undefined, value: 0};

		let turn = this.game.turn;
		let best_move = moves[0];

		for(let move of moves){

			this.game.makeMove(move);
			let e = this.game.eval();
			let v = 0;

			if(depth <= 0 || Math.abs(e) == Infinity){ // LEAF NODE: value is equal to the board evaluation
				v = e;
			}
			else{ // BRANCH NODE: value is computed recursivly
				v = this.decideRecursion(depth - 1, alpha, beta).value;
			}
			this.game.undoMove(move);
			
			// update alpha, beta
			if(turn == 1){
				if(v > alpha){
					alpha = v;
					best_move = move;
				}
			}
			if(turn == -1){
				if(v < beta){
					beta = v;
					best_move = move;
				}
			}

			if(alpha >= beta){
				break;
			}

			
		}

		return {move: best_move, value: turn == 1 ? alpha : beta};

	}

	decide(){
		return this.decideRecursion(this.depth, -Infinity, Infinity);
	}

	
}