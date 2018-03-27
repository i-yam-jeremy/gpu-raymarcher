/*

The 3D part of the internal engine
Handles the actually 3D rendering

*/
class GraphicsEngine3D {

	/*

	@param parentInternalEngine - InternalGraphicsEngine - the parent internal engine (the full internal engine, 2D and 3D)
	@param externalEngine - GraphicsEngine - the external engine

	*/
	constructor(parentInternalEngine, externalEngine) {
		this.parentInternalEngine = parentInternalEngine;
		this.externalEngine = externalEngine;
	}

	/*

	Renders one frame of 3D

	*/
	render(gl) {
		//TODO
	}

}


module.exports.GraphicsEngine3D = GraphicsEngine3D;
