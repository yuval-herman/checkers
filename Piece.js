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
		if (this.king) {
			return this.getKingMoves(pos, game);
		}
		const moves = [];
		let testMove;
		const direction = this.color ? -1 : 1;

		moves.push(this.getLeft(direction, pos));
		moves.push(this.getRight(direction, pos));

		return this.filterMoves(moves, game);
	}

	getEatMoves(pos, game, backwards) {
		if (this.king) {
			return this.getKingEatMoves(pos, game);
		}
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

	turnToKing() {
		this.king = true;
		this.imgPath = this.imgPath.replace("Piece", "King");
	}

	getKingMoves(pos, game) {
		const moves = [];
		for (let i = -1; i < 2; i += 2) {
			moves.push(...this.castRay(new Vector(i, -1), pos, game));
			moves.push(...this.castRay(new Vector(i, 1), pos, game));
		}
		return this.filterMoves(moves, game);
	}

	getKingEatMoves(pos, game) {
		const moves = [];
		for (let i = -1; i < 2; i += 2) {
			for (let j = -1; j < 2; j += 2) {
				const addVec = new Vector(i, j);
				const testMoves = this.castRay(addVec, pos, game);
				const testMove = testMoves[testMoves.length - 1];
				if (
					game.getPieceAt(testMove) &&
					game.getPieceAt(testMove).color !== this.color
				) {
					const eatMove = testMove.add(addVec);
					eatMove.eating = testMove;
					if (game.getPieceAt(eatMove) === undefined) moves.push(eatMove);
				}
			}
		}
		return this.filterMoves(moves, game);
	}

	castRay(dir, pos, game) {
		let nextPos = pos;
		const positions = [nextPos];
		for (let i = 0; i < BOARD_SIZE; i++) {
			nextPos = positions[i].add(dir);
			positions.push(nextPos);
			if (game.getPieceAt(nextPos)) break;
		}
		return positions;
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
