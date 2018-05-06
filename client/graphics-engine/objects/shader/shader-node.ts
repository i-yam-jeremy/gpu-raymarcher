import {GLSLFunction} from "../../util/glsl";

/* stores the data needed to create a shader node */
export type ShaderNodeData = { [key: string] : any };

/*
 * A node in the node-based shader function structure
 *
 * Node-based means that instead of defining the entire model shader as one function,
 * nodes can be created, modified, and joined and then the resulting node structure
 * can be compiled into GLSL code.
 *
 */
export abstract class ShaderNode {

	/*
	 * All ShaderNode subclasses need a function for loading them from ShaderNodeData so
	 * they must have a create method
	 */
	//public static abstract create(nodeData: ShaderNodeData): ShaderNode;

	/*
	 * Converts this shader node to GLSL code
	 *
	 * @return - this shader function
	 */
	public abstract compile(): GLSLFunction;

}
