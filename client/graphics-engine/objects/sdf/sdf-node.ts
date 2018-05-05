import {GLSLFunctionSet, GLSLFunction} from "../../util/glsl";

/* stores the data needed to create an SDF node */
export type SDFNodeData = { [key: string] : any };

/*
 * A node in the node-based SDF function structure
 *
 * Node-based means that instead of defining the entire SDF as one function,
 * nodes can be created, modified, and joined and then the resulting node structure
 * can be compiled into GLSL code.
 *
 * For example, a union node could be used to combine two sphere nodes, resulting in
 * two spheres in one SDF.
 */
export abstract class SDFNode {

	/*
	 * All SDFNode subclasses need a function for loading them from SDFNodeData so
	 * they must have a create method
	 */
	//public static abstract create(nodeData: SDFNodeData): SDFNode;
	
	/*
	 * Converts this SDF node to GLSL code
	 *
	 * @return - the set of functions needed by this SDF node
	 */
	public abstract compile(): GLSLFunctionSet;

}
