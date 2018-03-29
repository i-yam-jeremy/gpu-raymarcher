import {GraphicsEngineDOM} from "./util/dom";
import {FPSTracker} from "./util/fps-tracker";

export class GraphicsEngine {

	private dom: GraphicsEngineDOM;
	private fpsTracker: FPSTracker;

	constructor(parentElement: HTMLElement) {
		this.dom = new GraphicsEngineDOM(parentElement);
		this.fpsTracker = new FPSTracker();
	}

	public start() {
		//TODO
	}

	private render() {

		//TODO lookup Fun Fun Function guide on correct game loops
	}

}
