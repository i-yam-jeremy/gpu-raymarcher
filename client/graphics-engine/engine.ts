import {GraphicsEngineDOM} from "./util/dom";
import {Ticker} from "./util/ticker";
import {GLManager} from "./util/gl";
import {UI} from "./2d";
import {Scene} from "./3d";

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
	/* the 2D UI currently bound to this graphics engine instance */
	private ui: UI;

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
	 * Starts using (rendering and ticking) the given scene or 2D UI
	 * (overwrites the current scene or 2D UI if there is one bound)
	 */
	public bind(obj: Scene | UI): void {
		if (obj instanceof Scene) {
			this.scene = (<Scene>obj);
		}
		else if (obj instanceof UI) {
			this.ui = (<UI>obj);
		}
	}

	/*
	 * @return the scene currently in use
	 */
	public getScene(): Scene {
		return this.scene;
	}

	/*
	 * @return the 2D UI currently in use
	 */
	public getUI(): UI {
		return this.ui;
	}

	/*
	 * Called every graphics engine tick
	 */
	private tick(deltaTime: number): void {
		if (this.ui != undefined) {
			this.ui.tick(deltaTime);
		}
		if (this.scene != undefined) {
			this.scene.tick(deltaTime);
		}
	}

	/*
	 * Called every frame to render the scene (both 2d and 3d)
	 */
	private render(): void {
		this.dom.canvas2d.setAttribute('width', window.getComputedStyle(this.dom.canvas2d, null).getPropertyValue('width')); // FIXME find a more efficient solution to resizing game canvases
		this.dom.canvas2d.setAttribute('height', window.getComputedStyle(this.dom.canvas2d, null).getPropertyValue('height'));
		this.dom.canvas3d.setAttribute('width', window.getComputedStyle(this.dom.canvas3d, null).getPropertyValue('width'));
		this.dom.canvas3d.setAttribute('height', window.getComputedStyle(this.dom.canvas3d, null).getPropertyValue('height'));

		GLManager.render(this.dom.gl, this.scene, this.ui);

	}

}
