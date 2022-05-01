class Game {
	constructor(renderer, htmlTable) {
		this.renderer = renderer;
		this.htmlTable = htmlTable;
        this.htmlTable.modifyCells((cell) => cell.addEventListener("click", this.onClick))
	}
	onClick(event) {
        console.log(event, this);
    }
}
