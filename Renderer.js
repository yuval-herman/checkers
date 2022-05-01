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
		for (const row of this.board.HTMLtable.rows) {
			for (const cell of row.cells) {
				const element = elementArray.pop();
				if (!element) {
					continue;
				}
				cell.appendChild(this.renderPiece(element));
			}
		}
	}
}
