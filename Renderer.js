class Renderer {
	constructor(board) {
		this.board = board;
	}

	renderPiece(piece) {
		const img = document.createElement("img");
		img.src = piece.imgPath;
		img.className = "piece";
		return img;
	}

	redrawCells(elementArray) {
		let index = 0;
		for (const row of this.board.HTMLtable.rows) {
			for (const cell of row.cells) {
				const element = elementArray[index];
				index++;
				if (!element) {
					continue;
				}
				cell.appendChild(this.renderPiece(element));
			}
		}
	}
}
