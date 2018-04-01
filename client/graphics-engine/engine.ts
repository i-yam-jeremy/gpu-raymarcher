import {GraphicsEngineDOM} from "./util/dom";
import {Ticker} from "./util/ticker";

/*
 * The main class for handling the graphics engine
 */
export class GraphicsEngine {
	
	/* dom - contains all the DOM elements needed by this graphics engine */
	private dom: GraphicsEngineDOM;
	/* ticker - used for frame and tick/update timing */
	private ticker: Ticker;

	/*
	 * @param parentElement - the parent element of this graphics engine
	 */
	constructor(parentElement: HTMLElement) {
		this.dom = new GraphicsEngineDOM(parentElement);
		this.ticker = new Ticker((deltaTime) => this.tick(deltaTime), () => this.render());
	}

	/* starts the graphics engine */
	public start(): void {
		this.ticker.start();
	}

	/* stops the graphics engine */
	public stop(): void {
		this.ticker.stop();
	}

	/*
	 * @return whether or not the graphics engine is currently running
	 */
	public isRunning(): boolean {
		return this.ticker.isRunning();
	}

	/*
	 * Called every graphics engine tick
	 */
	private tick(deltaTime: number): void {
		//TODO
	}

	/*
	 * Called every frame to render the scene (both 2d and 3d)
	 */
	private render(): void {
		//TODO
		this.dom.canvas2d.setAttribute('width', window.getComputedStyle(this.dom.canvas2d, null).getPropertyValue('width')); // FIXME find a more efficient solution to resizing game canvases
		this.dom.canvas2d.setAttribute('height', window.getComputedStyle(this.dom.canvas2d, null).getPropertyValue('height'));
		this.dom.canvas3d.setAttribute('width', window.getComputedStyle(this.dom.canvas3d, null).getPropertyValue('width'));
		this.dom.canvas3d.setAttribute('height', window.getComputedStyle(this.dom.canvas3d, null).getPropertyValue('height'));

		this.dom.ctx.clearRect(0, 0, 1000, 1000);
		this.dom.ctx.fillText(Math.round(this.ticker.getFPS()).toString(), 100, 100);
	}

}
