/**
 * This class contains the movement logic.
 * It is unaware of it's location and works with information it is given at runtime.
 */
class Piece {
	constructor(color, imgPath) {
		this.color = color; // Color is boolean, dark is false white is true.
		this.imgPath = imgPath;
	}

	getLeft(dir, pos) {
		return pos.add(new Vector(1 * dir, -1 * dir));
	}

	getRight(dir, pos) {
		return pos.add(new Vector(dir, dir));
	}

	getMoves(pos, game) {
		const moves = [];
		let testMove;
		const direction = this.color ? -1 : 1;

		moves.push(this.getLeft(direction, pos));
		moves.push(this.getRight(direction, pos));

		return this.filterMoves(moves, game);
	}

	getEatMoves(pos, game, backwards) {
		const moves = [];
		const frontPieces = [];
		let testMove;
		let direction = this.color ? -1 : 1;
		if (backwards) direction *= -1;

		frontPieces.push(this.getLeft(direction, pos));
		frontPieces.push(this.getRight(direction, pos));

		for (let i = 0; i < 2; i++) {
			if (game.checkPieceColorAt(frontPieces[i]) === !this.color) {
				testMove = (i === 0 ? this.getLeft : this.getRight)(
					direction,
					frontPieces[i]
				);
				testMove.eating = frontPieces[i];
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
