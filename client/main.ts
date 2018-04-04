import {GraphicsEngine, UI, Object2d} from "./graphics-engine";

declare var document;


class Test extends Object2d {

	constructor() {
		super(0, 0);
	}

	public tick(deltaTime: number): void {
		this.x += 10*deltaTime;
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = "red";
		ctx.fillRect(0, 0, 100, 100);
	}

}

document.addEventListener("DOMContentLoaded", () => {
	var graphics = new GraphicsEngine(document.body);

	var ui = new UI();
	ui.add(new Test());
	graphics.bind(ui);
	
	graphics.start();
});
