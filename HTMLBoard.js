const BOARD_SIZE = 8;

/**
 * This class primarily holds the HTML table.
 * It also provides bare minimum functions to manipulate pieces on the table.
 */
class HTMLBoard {
	constructor() {
		this.HTMLtable;
		this.makeTable(); // Makes the HTML table
	}

	getCell(pos) {
		return this.HTMLtable.rows[pos.x].cells[pos.y];
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

	modifyCells(func) {
		for (const row of this.HTMLtable.rows) {
			for (const cell of row.cells) {
				func(cell);
			}
		}
	}
}
