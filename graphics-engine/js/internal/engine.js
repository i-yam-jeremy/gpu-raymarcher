const GraphicsEngine2D = require('./engine2D').GraphicsEngine2D;
const GraphicsEngine3D = require('./engine3D').GraphicsEngine3D;

/*

Does the actual work of rendering and contains all internal data and methods that are not needed by the user

*/
class InternalGraphicsEngine {

	constructor(externalEngine, parentElement) {
		this.externalEngine = externalEngine;
		this.initDOM(parentElement);	
		this.running = false;
		this.fpsData = {
			fps: 60, // placeholder value until fps is calculated
			lastFPSUpdate: undefined,
			framesSinceLastFPSUpdate: 0,
			updateInterval: 1000
		};
		this.engine2D = new GraphicsEngine2D(this, externalEngine);
		this.engine3D = new GraphicsEngine3D(this, externalEngine);
	}

	/*

	Initializes the DOMElements needed and inserts them into the DOM
	@param parentElement - DOMElement - all DOMElements inserted will be children (or grandchildren, great-grandchildren, etc.) of this DOMElement

	*/
	initDOM(parentElement) {	
		this.dom = {};
		this.dom.parentElement = parentElement;
		this.dom.canvas2D = document.createElement('canvas');
		this.dom.canvas2D.setAttribute('class', 'rayle-canvas rayle-canvas2D');
		parentElement.appendChild(this.dom.canvas2D);
		this.dom.canvas3D = document.createElement('canvas');
		this.dom.canvas3D.setAttribute('class', 'rayle-canvas rayle-canvas3D');
		parentElement.appendChild(this.dom.canvas3D);
	}

	/*

	@return - float - the current FPS (smoothed/averaged over an interval)

	*/
	getFPS() {
		return this.fpsData.fps;
	}

	/*

	Updates the calculated FPS

	*/
	updateFPS() {
		const now = Date.now();
		if (!this.fpsData.lastFPSUpdate) {
			this.fpsData.framesSinceLastFPSUpdate = 0;
			this.fpsData.lastFPSUpdate = now;	
		}
		else if (this.fpsData.lastFPSUpdate &&
			now - this.fpsData.lastFPSUpdate > this.fpsData.updateInterval) {
			const secondsSinceLastFPSUpdate = (now - this.fpsData.lastFPSUpdate) / 1000;
			this.fpsData.fps = this.fpsData.framesSinceLastFPSUpdate / secondsSinceLastFPSUpdate;
			this.fpsData.framesSinceLastFPSUpdate = 0;
			this.fpsData.lastFPSUpdate = now;
		}

		this.fpsData.framesSinceLastFPSUpdate++;
	}

	/*

	@return - boolean - true iff the graphics engine is running, false otherwise

	*/
	isRunning() {
		return this.running;
	}

	/*

	Starts the graphics engine. Starts the render loop.

	*/
	start() {
		this.running = true;
		this.ctx = this.dom.canvas2D.getContext('2d');
		this.gl = this.dom.canvas3D.getContext('webgl') || this.dom.canvas3D.getContext('experimental-webgl');
		if (this.gl) {
			this.renderLoop();
		}
		else {
			alert("Please update your browser to support webgl"); // TODO make this a more user friendly error message once other stuff is implemented
		}
	}

	/*

	Stops the graphics engine. Stops the render loop.

	*/
	stop() {
		this.running = false;
	}

	/*

	Runs the render loop

	*/
	renderLoop() {

		if (this.running) {

			this.updateFPS();
			this.render();

			window.requestAnimationFrame(() => {
				this.renderLoop();
			});
		}
	}

	/*

	Renders one frame of both the 2D and 3D renderers

	*/
	render() {

		this.dom.canvas2D.setAttribute('width', window.getComputedStyle(this.dom.canvas2D, null).getPropertyValue('width')); // FIXME find a more efficient solution to resizing game canvases
		this.dom.canvas2D.setAttribute('height', window.getComputedStyle(this.dom.canvas2D, null).getPropertyValue('height'));
		this.dom.canvas3D.setAttribute('width', window.getComputedStyle(this.dom.canvas3D, null).getPropertyValue('width'));
		this.dom.canvas3D.setAttribute('height', window.getComputedStyle(this.dom.canvas3D, null).getPropertyValue('height'));

		this.render2D();
		this.render3D();
	}

	/*

	Renders one frame of the 2D renderer

	*/
	render2D() {
		this.engine2D.render(this.ctx);
	}

	/*

	Renders one frame of the 3D renderer

	*/
	render3D() {
		this.engine3D.render(this.gl);
	}

}

module.exports.InternalGraphicsEngine = InternalGraphicsEngine;
