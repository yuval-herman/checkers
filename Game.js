const BLACK = "blacks";
const WHITE = "whites";

class Game {
	constructor(renderer, htmlTable) {
		this.renderer = renderer;
		this.htmlTable = htmlTable;
		this.boardArr = [];
		this.onClick = this.onClick.bind(this);
		this.htmlTable.modifyCells((cell) =>
			cell.addEventListener("click", this.onClick)
		);
		this.initGame();

		this.selected = {};
		this.resetSelected();
		this.turnOf = true;
	}

	initGame() {
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

		this.renderer.redrawCells(this.boardArr);
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
		const move = this.selected.moves.find((e) => pos.isEqual(e));

		this.renderer.cleanCells();
		this.renderer.paintCells([pos], "highlight");

		if (move) {
			this.movePiece(this.selected.pos, move);
			this.turnOf = !this.turnOf;
			this.resetSelected();
		} else if (this.checkPieceColorAt(pos) === this.turnOf) {
			this.selected.pos = pos;
			this.selected.moves = this.getPieceAt(pos).getMoves(pos, this);
			this.renderer.paintCells(this.selected.moves, "valid-move");
		} else if (this.getPieceAt(pos)) {
			this.renderer.cleanCells();
			this.renderer.paintCells([pos], "not-your-turn");
		}

		this.autoEat();

		this.checkWin();
	}

	autoEat() {
		const eatMove = this.canPlayerEat(this.turnOf);
		if (!eatMove) return;
		this.movePiece(eatMove[0], eatMove[1]);
		this.turnOf = !this.turnOf;
		this.resetSelected();
		this.renderer.cleanCells();
		this.autoEat();
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
		this.boardArr[to.x * BOARD_SIZE + to.y] =
			this.boardArr[from.x * BOARD_SIZE + from.y];
		this.boardArr[from.x * BOARD_SIZE + from.y] = undefined;
		this.renderer.movePiece(from, to);

		if (to.eating) {
			this.removePiece(to.eating);
		}
	}

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

	canPlayerEat(color) {
		for (let i = 0; i < this.boardArr.length; i++) {
			const piece = this.boardArr[i];
			if (piece && piece.color === color) {
				const moves = piece.getMoves(this.indexToPosition(i), this);
				for (const move of moves) {
					if (move.eating) {
						return [this.indexToPosition(i), move];
					}
				}
			}
		}
		return false;
	}

	checkWin() {
		if (!this.canPlayerMove(!this.turnOf)) {
			const winner = this.turnOf ? WHITE : BLACK;
			const losser = !this.turnOf ? WHITE : BLACK;
			this.showBanner(
				winner + " Won!!\n" + losser + " can't make a move..."
			);
			return;
		} else if (!this.canPlayerMove(this.turnOf)) {
			const winner = !this.turnOf ? WHITE : BLACK;
			const losser = this.turnOf ? WHITE : BLACK;
			this.showBanner(
				winner + " Won!!\n" + losser + " can't make a move..."
			);
			return;
		}

		let whites = 0;
		let blacks = 0;
		this.boardArr.forEach((e) => {
			if (!e) return;
			e.color ? whites++ : blacks++;
		});

		if (blacks === 0) {
			this.showBanner(WHITE + " Won!!" + BLACK + " run out of pieces...");
		} else if (whites === 0) {
			this.showBanner(BLACK + " Won!!" + WHITE + " run out of pieces...");
		}
	}

	showBanner(str) {
		const banner = document.getElementById("win-ovelay");
		banner.style.display = "inherit";
		banner.lastElementChild.textContent = str;
	}
}
