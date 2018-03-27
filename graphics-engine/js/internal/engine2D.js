/*

The 2D part of the internal engine
Handles the actually 2D rendering

*/
class GraphicsEngine2D {

	/*

	@param parentInternalEngine - InternalGraphicsEngine - the parent internal engine (the full internal engine, 2D and 3D)
	@param externalEngine - GraphicsEngine - the external engine

	*/
	constructor(parentInternalEngine, externalEngine) {
		this.parentInternalEngine = parentInternalEngine;
		this.externalEngine = externalEngine;
	}

	/*

	Renders one frame of 2D

	*/
	render(ctx) {
		ctx.clearRect(0, 0, 100000, 100000); // FIXME find a better way of getting height and width
		
		ctx.fillText(Math.round(this.parentInternalEngine.getFPS()).toString(), 100, 100);
	}

}




module.exports.GraphicsEngine2D = GraphicsEngine2D;
