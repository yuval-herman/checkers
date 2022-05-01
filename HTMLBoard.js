const BOARD_SIZE = 8;

class HTMLBoard {
	constructor() {
		this.makeTable(); // Makes the HTML table
	}
	getCell(pos) {
		return this.HTMLtable.rows[pos.x].cells[pos.y];
	}

	makePieceElement(imgPath) {
		const img = document.createElement("img");
		img.src = imgPath;
		img.className = "piece";
		return img;
	}

	positionsToHtmlElements(positions) {
		const cells = [];
		positions.forEach((pos) => {
			cells.push(this.getCell(pos));
		});
		return cells;
	}

	makeTable() {
		this.HTMLtable = document.createElement("table");
		this.HTMLtable.className = "board";

		for (let i = 0; i < BOARD_SIZE; i++) {
			const row = document.createElement("tr");

			for (let j = 0; j < BOARD_SIZE; j++) {
				const td = document.createElement("td");

				row.appendChild(td);
			}

			this.HTMLtable.appendChild(row);
		}
	}

	// append the table to another DOM element
	appendToElement(element) {
		element.appendChild(this.HTMLtable);
	}

	movePiece(fromPos, toPos) {
		this.getCell(toPos).innerHTML = "";
		this.getCell(toPos).appendChild(this.getCell(fromPos).firstChild);
	}
}