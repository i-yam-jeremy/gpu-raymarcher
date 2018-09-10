import {GraphicsEngineDOM} from "./util/dom";
import {Ticker} from "./util/ticker";
import {Scene} from "./scene";

/*
 * The main class for handling the graphics engine
 */
export class GraphicsEngine {
	
	/* contains all the DOM elements needed by this graphics engine */
	private dom: GraphicsEngineDOM;
	/* used for frame and tick/update timing */
	private ticker: Ticker;
	/* the scene currently bound to this graphics engine instance */
	private scene: Scene;

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
	 * Starts using (rendering and ticking) the given scene
	 * (overwrites the current scene if there is one bound)
	 *
	 * @param scene - the scene to be bound
	 */
	public bind(scene: Scene): void {
		scene.init(this.dom.gl);
		this.scene = scene;
	}

	/*
	 * @return the scene currently in use
	 */
	public getScene(): Scene {
		return this.scene;
	}

	/*
	 * Called every graphics engine tick
	 */
	private tick(deltaTime: number): void {
		if (this.scene != undefined) {
			this.scene.tick(deltaTime);
		}
	}

	/*
	 * Called every frame to render the scene (both 2d and 3d)
	 */
	private render(): void {
		this.dom.canvas.setAttribute('width', window.getComputedStyle(this.dom.canvas, null).getPropertyValue('width')); // FIXME find a more efficient solution to resizing game canvases
		this.dom.canvas.setAttribute('height', window.getComputedStyle(this.dom.canvas, null).getPropertyValue('height'));
		if (this.scene != undefined) {
			this.scene.render();
		}	
	}

}
