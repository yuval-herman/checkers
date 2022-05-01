class Piece {
	constructor(color, imgPath) {
		this.color = color; // Color is boolean, dark is false white is true.
		this.imgPath = imgPath;
	}

	getMoves(pos, game) {
		const moves = [];
		const direction = this.color ? 1 : -1;

		moves.push(pos.add(new Vector(direction, direction)));
		moves.push(pos.add(new Vector(1 * direction, -1 * direction)));

		for (const move of moves) {
			if (game.getPieceAt(move) !== undefined) {
				const testMove = move.add(direction);
				console.log(testMove);
				if (game.getPieceAt(testMove) === undefined) {
					moves.push(testMove);
				}
			}
		}

		return this.filterMoves(moves, game);
	}

	filterMoves(moves, game) {
		return moves.filter((e) => {
			return !this.isOutOfBounds(e) && game.getPieceAt(e) === undefined;
		});
	}

	isOutOfBounds(pos) {
		return (
			pos.x >= BOARD_SIZE || pos.y >= BOARD_SIZE || pos.x < 0 || pos.y < 0
		);
	}
}
