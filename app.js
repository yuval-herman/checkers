/**
 * A class to hold a 2d position in the board.
 *
 * The advantage in using a class instead of a 2-cell array
 * is it is more mistake-proof and easy to debug, this will always show errors
 * and won't fail silently.
 */
class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	isEqual(vec) {
		return vec.x === this.x && vec.y === this.y;
	}

	add(vec) {
		return new Vector(this.x + vec.x, this.y + vec.y);
	}
}

const htmlBoard = new HTMLBoard();
const renderer = new Renderer(htmlBoard);
const game = new Game(renderer, htmlBoard);
document.getElementsByTagName("body")[0].appendChild(htmlBoard.HTMLtable)
