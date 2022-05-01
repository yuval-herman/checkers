class Piece {
	constructor(color, imgPath) {
		this.color = color; // Color is boolean, dark is false white is true.
		this.imgPath = imgPath;
	}

	getMoves(pos, game) {
		const moves = [];
		let testMove;
		const direction = this.color ? -1 : 1;

		moves.push(pos.add(new Vector(direction, direction)));
		moves.push(pos.add(new Vector(1 * direction, -1 * direction)));

		if (game.checkPieceColorAt(moves[0]) === !this.color) {
			testMove = moves[0].add(direction);
			testMove.eating = moves[0];
			if (game.getPieceAt(testMove) === undefined) {
				moves.push(testMove);
			}
		}
		if (game.checkPieceColorAt(moves[1]) === !this.color) {
			testMove = moves[1].add(new Vector(1 * direction, -1 * direction));
			testMove.eating = moves[1];
			if (game.getPieceAt(testMove) === undefined) {
				moves.push(testMove);
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
