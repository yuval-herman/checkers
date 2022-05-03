const BLACK = "blacks";
const WHITE = "whites";

/**
 * This class is the game manager.
 * It controls everything in the backend and uses other components to update the UI
 */
class Game {
	constructor(renderer, htmlTable) {
		this.renderer = renderer;
		this.htmlTable = htmlTable;
		this.onClick = this.onClick.bind(this); // makes sure onClick is always called in this context
		this.htmlTable.modifyCells((cell) =>
			cell.addEventListener("click", this.onClick)
		);
		this.initGame();
	}

	/**
	 * This function initializes the board and game variables.
	 * It is made in a way so that it can be called mid-game to reset everything.
	 */
	initGame() {
		this.boardArr = []; // holds all piece positions as well as empty cells
		this.selected = {};
		this.resetSelected();
		this.turnOf = true;

		// boardArr is a 1d array, as such alternating pieces and empty spaces is a bit more difficult.
		// I use the alternate variable in order to achieve this.
		let alternate = true;
		for (let i = 0; i < BOARD_SIZE * 3; i++) {
			if (i % 8 !== 0) {
				alternate = !alternate;
			}
			if (alternate) {
				this.boardArr.push(new Piece(false, "pieces/darkPiece.svg"));
			} else {
				this.boardArr.push(undefined);
			}
		}

		for (let i = BOARD_SIZE * 3; i < BOARD_SIZE * 5; i++) {
			this.boardArr.push(undefined);
		}

		for (let i = BOARD_SIZE * 5; i < BOARD_SIZE * 8; i++) {
			if (i % 8 !== 0) {
				alternate = !alternate;
			}
			if (alternate) {
				this.boardArr.push(new Piece(true, "pieces/lightPiece.svg"));
			} else {
				this.boardArr.push(undefined);
			}
		}

		this.renderer.cleanCells(); // This is for colors not for images
		this.renderer.drawCells(this.boardArr);
	}

	getPieceAt(pos) {
		return this.boardArr[pos.x * BOARD_SIZE + pos.y];
	}

	indexToPosition(index) {
		return new Vector(Math.floor(index / 8), index % 8);
	}

	checkPieceColorAt(pos) {
		return this.boardArr[pos.x * BOARD_SIZE + pos.y]
			? this.boardArr[pos.x * BOARD_SIZE + pos.y].color
			: undefined;
	}

	onClick(event) {
		const cell = event.currentTarget;
		const pos = new Vector(cell.parentNode.rowIndex, cell.cellIndex);
		// get all pieces of player that can eat
		const eatPieces = this.getPlayerEatPieces(this.turnOf);
		// check if clicked position is in previously click piece moves
		const move = this.selected.moves.find((e) => pos.isEqual(e));

		this.renderer.cleanCells();
		this.renderer.paintCells([pos], "highlight");

		if (move) {
			this.movePiece(this.selected.pos, move);
			this.turnOf = !this.getPieceAt(move).color;
			if (move.eating) {
				const nextEatMoves = this.getPieceAt(move).getEatMoves(move, this);
				if (nextEatMoves) {
					this.playerPieceClick(move, nextEatMoves)
				}
			}
		} else if (this.checkPieceColorAt(pos) === this.turnOf) {
			// player clicked his own piece
			this.playerPieceClick(
				pos,
				!eatPieces.length
					? this.getPieceAt(pos).getMoves(pos, this)
					: this.getPieceAt(pos).getEatMoves(pos, this)
			);
		} else if (this.getPieceAt(pos)) {
			// player clicked a piece, but not his own
			this.renderer.cleanCells();
			this.renderer.paintCells([pos], "not-your-turn");
		}

		this.renderer.paintCells(this.getPlayerEatPieces(this.turnOf), "can-eat");
		this.checkWin();
	}

	playerPieceClick(pos, moves) {
		this.selected.pos = pos;
		this.selected.moves = moves;
		this.renderer.paintCells(this.selected.moves, "valid-move");
	}

	resetSelected() {
		this.selected.pos = undefined;
		this.selected.moves = [];
	}

	removePiece(pos) {
		this.boardArr[pos.x * BOARD_SIZE + pos.y] = undefined;
		this.renderer.removePiece(pos);
	}

	movePiece(from, to) {
		this.resetSelected();

		this.boardArr[to.x * BOARD_SIZE + to.y] =
			this.boardArr[from.x * BOARD_SIZE + from.y];
		this.boardArr[from.x * BOARD_SIZE + from.y] = undefined;
		this.renderer.movePiece(from, to);

		if (to.eating) {
			this.removePiece(to.eating);
		}
	}

	// Goes over all pieces and check pieces of player for possible moves
	canPlayerMove(color) {
		for (let i = 0; i < this.boardArr.length; i++) {
			const piece = this.boardArr[i];
			if (
				piece &&
				piece.color === color &&
				piece.getMoves(this.indexToPosition(i), this).length
			) {
				return true;
			}
		}
		return false;
	}

	// Check all pieces of player for eating moves and returns them in an array
	getPlayerEatPieces(color) {
		const canEatPieces = [];
		for (let i = 0; i < this.boardArr.length; i++) {
			const piece = this.boardArr[i];
			if (piece && piece.color === color) {
				const moves = piece.getEatMoves(this.indexToPosition(i), this);
				for (const move of moves) {
					canEatPieces.push(this.indexToPosition(i));
					continue;
				}
			}
		}
		return canEatPieces;
	}

	// Check for win in two ways:
	// 1. By eating all enemy pieces.
	// 2. By making enemy unable to move.
	checkWin() {
		let whites = 0;
		let blacks = 0;
		this.boardArr.forEach((e) => {
			if (!e) return;
			e.color ? whites++ : blacks++;
		});

		if (blacks === 0) {
			this.showBanner(WHITE + " Won!!" + BLACK + " run out of pieces...");
			return;
		} else if (whites === 0) {
			this.showBanner(BLACK + " Won!!" + WHITE + " run out of pieces...");
			return;
		}

		if (!this.canPlayerMove(!this.turnOf)) {
			const winner = this.turnOf ? WHITE : BLACK;
			const looser = !this.turnOf ? WHITE : BLACK;
			this.showBanner(
				winner + " Won!!\n" + looser + " can't make a move..."
			);
			return;
		} else if (!this.canPlayerMove(this.turnOf)) {
			const winner = !this.turnOf ? WHITE : BLACK;
			const looser = this.turnOf ? WHITE : BLACK;
			this.showBanner(
				winner + " Won!!\n" + looser + " can't make a move..."
			);
			return;
		}
	}

	showBanner(str) {
		const banner = document.getElementById("win-overlay");
		banner.style.display = "inherit";
		banner.lastElementChild.textContent = str;
	}
}
