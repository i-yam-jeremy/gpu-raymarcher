/*
 * Creates a canvas element
 *
 * @param parentElement - the parent element of the canvas element created
 * @param canvasType - the type of canvas
 * @return the canvas created
 */
function createCanvas(parentElement: HTMLElement): HTMLCanvasElement {
	var canvas = document.createElement('canvas');
	canvas.setAttribute('class', 'rayle-canvas');
	
	parentElement.appendChild(canvas);

	return canvas;
}

/*
 * A container that initializes all DOM elements needed by the graphics engine
 */
export class GraphicsEngineDOM {

	/* canvas - the canvas used for rendering */
	readonly canvas: HTMLCanvasElement;
	/* gl - the WebGL context for 3d rendering */
	readonly gl: WebGL2RenderingContext;

	/*
	 * @param parentElement - the element to contain the graphics engine (all DOM elements created will be children, grand-children, etc. of this element)
	 */
	constructor(parentElement: HTMLElement) {
		this.canvas = createCanvas(parentElement);
		this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('experimental-webgl2');
	}

}
