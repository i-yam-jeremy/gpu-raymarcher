/* The canvas type */
enum CanvasType {
	TYPE_2D,
	TYPE_3D
}

/*
 * Creates a canvas element
 *
 * @param parentElement - the parent element of the canvas element created
 * @param canvasType - the type of canvas
 * @return the canvas created
 */
function createCanvas(parentElement: HTMLElement, canvasType: CanvasType): HTMLCanvasElement {
	var canvas = document.createElement('canvas');
	switch (canvasType) {
		case CanvasType.TYPE_2D:
			canvas.setAttribute('class', 'rayle-canvas rayle-canvas2D');
			break;
		case CanvasType.TYPE_3D:
			canvas.setAttribute('class', 'rayle-canvas rayle-canvas3D');
			break;
	}

	parentElement.appendChild(canvas);

	return canvas;
}

/*
 * A container that initializes all DOM elements needed by the graphics engine
 */
export class GraphicsEngineDOM {

	/* canvas2d - the canvas used for 2d rendering */
	readonly canvas2d: HTMLCanvasElement;
	/* canvas3d - the canvas used for 3d rendering */
	readonly canvas3d: HTMLCanvasElement;
	/* ctx - the 2d context for drawing */
	readonly ctx: CanvasRenderingContext2D;
	/* gl - the WebGL context for 3d rendering */
	readonly gl: WebGLRenderingContext;

	/*
	 * @param parentElement - the element to contain the graphics engine (all DOM elements created will be children, grand-children, etc. of this element)
	 */
	constructor(parentElement: HTMLElement) {
		this.canvas2d = createCanvas(parentElement, CanvasType.TYPE_2D);
		this.canvas3d = createCanvas(parentElement, CanvasType.TYPE_3D);
		this.ctx = this.canvas2d.getContext('2d');
		this.gl = this.canvas3d.getContext('webgl') || this.canvas3d.getContext('experimental-webgl');
	}

}
