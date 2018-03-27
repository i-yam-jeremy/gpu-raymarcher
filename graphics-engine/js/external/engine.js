const InternalGraphicsEngine = require('../internal/engine').InternalGraphicsEngine;

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

module.exports.GraphicsEngine = GraphicsEngine;
