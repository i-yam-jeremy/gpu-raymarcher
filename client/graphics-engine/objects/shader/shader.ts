import {GLSLFunction} from "../../util/glsl";
import {ShaderNode} from "./shader-node";
import {ShaderNodeLoader} from "./shader-node-loader";

/*
 * A shader for a specific model.
 * (Note: not to be confused with a GLSL vertex or fragment shader,
 * 	this shades a specific model and computes the color of the object
 * 	based on lighting, position, etc.)
 */
export class Shader {

	/*
	 * the root node of the node-based structure of this shader function
	 */
	private node: ShaderNode;

	/*
	 * Creates a shader with the given node as the root node
	 *
	 * @param - the root node
	 */
	constructor(node: ShaderNode) {
		this.node = node;
	}

	/*
	 * Converts the given JSON string into a shader object
	 *
	 * @param jsonString - the JSON string specifying the shader data
	 */
	public static fromJSON(jsonString: string) : Shader {
		return new Shader(ShaderNodeLoader.fromJSON(jsonString));
	}

	/*
	 * Converts this shader into GLSL code
	 *
	 * @return - this shader function
	 */
	public compile(): GLSLFunction {
		return this.node.compile();
	}

}
