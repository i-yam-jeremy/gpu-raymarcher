import {GLSLFunctionSet} from "../util/glsl";
import {SDF} from "./sdf";
import {Shader} from "./shader";

/*
 * A 3D Model
 * (not to be confused with a RenderableObject, which is an instance of a Model with transformations and other data applied)
 */
export class Model {

	/* the SDF for this model */
	private sdf: SDF;
	/* the shader for this model */
	private shader: Shader;

	/*
	 * Creates a Model based on the given SDF and shader
	 *
	 * @param sdf - the SDF
	 * @param shader - the shader
	 */
	constructor(sdf: SDF, shader: Shader) {
		this.sdf = sdf;
		this.shader = shader;
	}

	/*
	 * Converts this model to GLSL code
	 *
	 * @return - the set of functions needed by this model
	 */
	public compile(): GLSLFunctionSet {
		return (<any>Object).assign({}, this.sdf.compile(), this.shader.compile());
	}

}
