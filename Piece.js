class Piece {
	constructor(color, imgPath) {
		this.color = color; // Color is boolean, dark is false white is true.
		this.imgPath = imgPath;
	}

	getMoves(pos, game) {
		return this.filterMoves(
			this.color
				? [pos.add(new Vector(1, 1)), pos.add(new Vector(1, -1))]
				: [pos.add(new Vector(-1, -1)), pos.add(new Vector(-1, 1))],
			game
		);
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
