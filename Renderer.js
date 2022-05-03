/**
 * A class used to connect between the UI and the backend.
 */
class Renderer {
	constructor(board) {
		this.board = board;
		this.paintedCells = [];
	}

	renderPiece(piece) {
		const img = document.createElement("img");
		img.src = piece.imgPath;
		img.className = "piece";
		return img;
	}

	// Loops through the table and draws pieces.
	// It also deletes previously drawn images.
	drawCells(elementArray) {
		let index = 0;
		for (const row of this.board.HTMLtable.rows) {
			for (const cell of row.cells) {
				const element = elementArray[index];
				index++;
				cell.innerHTML = "";
				if (!element) continue;
				cell.appendChild(this.renderPiece(element));
			}
		}
	}

	movePiece(from, to) {
		this.board.getCell(to).appendChild(this.board.getCell(from).lastChild);
	}

	removePiece(pos) {
		this.board.getCell(pos).innerHTML = "";
	}

	paintCells(positions, cssClass) {
		this.board.positionsToHtmlElements(positions).forEach((element) => {
			element.classList.add(cssClass);
			this.paintedCells.push(element);
		});
	}

	// remove cell paint
	cleanCells() {
		for (const cell of this.paintedCells) {
			cell.className = "";
		}
	}
}
