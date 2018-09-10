import {GLSLFunction} from "../../util/glsl";
import {SDFNode} from "./sdf-node";
import {SDFNodeLoader} from "./sdf-node-loader";

/*
 * A signed-distance function that can be converted to GLSL code
 */
export class SDF {

	/* the root SDF node */
	private node: SDFNode;

	/*
	 * Creates an SDF using the given SDF as the root node
	 *
	 * @param node - the root node of the SDF
	 */
	constructor(node: SDFNode) {
		this.node = node;
	}

	/*
	 * Converts a JSON string to an SDF
	 *
	 * @param jsonString - the JSON string containing the node-based SDF data
	 */
	public static fromJSON(jsonString: string) : SDF {
		return new SDF(SDFNodeLoader.fromJSON(jsonString));
	}

	/*
	 * Converts this SDF to GLSL code
	 *
	 * @return - the SDF function
	 */
	public compile(): GLSLFunction {
		return this.node.compile();
	}

}
