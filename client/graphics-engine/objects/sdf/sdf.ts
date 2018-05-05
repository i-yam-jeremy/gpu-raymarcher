import {GLSLFunctionSet} from "../../util/glsl";
import {SDFNode} from "./sdf-node";
import {SDFNodeLoader} from "./sdf-node-loader";

export class SDF {

	private node: SDFNode;

	constructor(node: SDFNode) {
		this.node = node;
	}

	public static fromJSON(jsonString: string) : SDF {
		return new SDF(SDFNodeLoader.fromJSON(jsonString));
	}

	public compile(): GLSLFunctionSet {
		return this.node.compile();
	}

}
