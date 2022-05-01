/**
 * A class to hold a 2d position in the board.
 *
 * The advantage in using a class instead of a 2-cell array
 * is it is more mistake-proof and easy to debug, this will allways show errors
 * and won't fail silently.
 */
class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(vec) {
		return new Vector(this.x + vec.x, this.y + vec.y);
	}
}

const htmlBoard = new HTMLBoard();
htmlBoard.appendToElement(document.getElementsByTagName("body")[0]);

const boardArr = [[]];

for (let i = 0; i < 3; i++) {
	for (let j = 0; j < BOARD_SIZE; j++) {
		boardArr[0].push(new Piece(false, ""));
	}
	boardArr.push([]);
}

for (let i = 3; i < 5; i++) {
	const element = [i];
	boardArr.push([]);
}

for (let i = 5; i < 8; i++) {
	for (let j = 0; j < BOARD_SIZE; j++) {
		boardArr[i].push(new Piece(true, ""));
	}
	boardArr.push([]);
}

htmlBoard.placeInCells(boardArr);
