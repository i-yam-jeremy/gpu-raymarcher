const InternalGraphicsEngine = require('../internal/engine').InternalGraphicsEngine;
const Object2D = require('./object2D').Object2D;
const Object3D = require('./object3D').Object3D;

var internalGraphicsEngines = {};
var graphicsEngineKey = 1;

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
		this.key = graphicsEngineKey++;
		internalGraphicsEngines[this.key] = new InternalGraphicsEngine(this, parentElement);		
	}

	/* @return - boolean - true iff the graphics engine is running, false otherwise */
	isRunning() {
		return internalGraphicsEngines[this.key].isRunning();
	}

	/* Starts the graphics engine. */
	start() {
		internalGraphicsEngines[this.key].start();
	}

	/* Stops the graphics engine */
	stop() {
		internalGraphicsEngines[this.key].stop();
	}

	/* 
	
	Adds the given object to the engine
	@param obj - (Object2D | Object3D) - the object to add to the engine

	 */
	add(obj) {
		if (obj) {
			if (obj instanceof Object2D) {
				internalGraphicsEngines[this.key].add2D(obj);
			}
			else if (obj instanceof Object3D) {
				internalGraphicsEngines[this.key].add3D(obj);
			}
			else {
				throw {
					message: "Unknown object type",
					obj: obj
				};
			}
		}
	}

	/*

	Removes the given object from the engine
	@param obj - (Object2D | Object3D) - the object to remove from the engine

	*/
	remove(obj) {
		if (obj) {
			if (obj instanceof Object2D) {
				internalGraphicsEngines[this.key].remove2D(obj);
			}
			else if (obj instanceof Object3D) {
				internalGraphicsEngines[this.key].remove3D(obj);
			}
			else {
				throw {
					message: "Unknown object type",
					obj: obj
				};
			}
		}
	}

}

module.exports.GraphicsEngine = GraphicsEngine;
