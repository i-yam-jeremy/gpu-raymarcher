(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
if (!('Rayle' in window)) {
	window.Rayle = {};
}


Rayle.GraphicsEngine = (() => {

	/*

	Contains all user-modifiable data (such as, 3D models, 2D objects, etc.) and user-callable methods
	Does NOT contain any internal data that should not be modified by the user nor internal methods that should never be called by the user

	*/
	class GraphicsEngine {

		/*

		Creates an instance of the graphics engine
		@param parentElement - DOMElement - the parent element of this graphics engine's DOMElements

		*/		
		constructor(parentElement) {
			var internalGraphicsEngine = new InternalGraphicsEngine(this, parentElement);		
			Object.defineProperty(this, 'running', {
				get: () => {
					return internalGraphicsEngine.isRunning();
				},
				set: (shouldRun) => {
					if (shouldRun && !internalGraphicsEngine.isRunning()) {
						internalGraphicsEngine.start();
					}
					else if (!shouldRun && internalGraphicsEngine.isRunning()) {
						
					}
				}
			});
		}

		/* @return - boolean - true iff the graphics engine is running, false otherwise */
		isRunning() {
			return this.running;
		}

		/* Starts the graphics engine. */
		start() {
			this.running = true;
		}

		/* Stops the graphics engine */
		stop() {
			this.running = false;
		}

	}


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

			this.ctx.clearRect(0, 0, 100000, 100000); // FIXME add width and height as fields and change them on resize

			this.ctx.fillStyle = 'red';
			this.ctx.fillRect(20, 20, 100, 100);

			this.ctx.fillStyle = 'black';
			this.ctx.fillText(Math.round(this.getFPS()).toString(), 100, 100);
			//TODO
		}

		/*

		Renders one frame of the 3D renderer

		*/
		render3D() {
			//TODO
		}

	}

	return {
		GraphicsEngine
	};

})();

},{}]},{},[1]);
