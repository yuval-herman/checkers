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

		this.selectedMoves = [];
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

	checkPieceColorAt(pos) {
		return this.boardArr[pos.x * BOARD_SIZE + pos.y]
			? this.boardArr[pos.x * BOARD_SIZE + pos.y].color
			: undefined;
	}

	onClick(event) {
		this.renderer.cleanCells();
		const cell = event.currentTarget;
		const pos = new Vector(cell.parentNode.rowIndex, cell.cellIndex);

		const move = this.selectedMoves.find((e) => pos.isEqual(e));
		if (move) {
			this.movePiece(this.selectedPos, move);
			this.turnOf = !this.turnOf;
			this.selectedPos = undefined;
			this.selectedMoves = [];
		} else if (this.checkPieceColorAt(pos) === this.turnOf) {
			this.selectedPos = pos;
			this.selectedMoves = this.getPieceAt(pos).getMoves(pos, this);
			this.renderer.paintCells(this.selectedMoves, "valid-move");
		}
		this.checkWin();
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

	checkWin() {
		let whites = 0;
		let blacks = 0;
		this.boardArr.forEach((e) => {
			if (!e) return;
			e.color ? whites++ : blacks++;
		});

		if (blacks === 0) {
			this.showBanner("white");
		} else if (whites === 0) {
			this.showBanner("black");
		}
	}

	showBanner(playerName) {
		const banner = document.getElementById("win-ovelay");
		banner.style.display = "inherit";
		banner.lastElementChild.textContent = playerName + " Won!!";
	}
}
