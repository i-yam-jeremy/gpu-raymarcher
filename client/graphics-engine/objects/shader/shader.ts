import {GLSLFunctionSet} from "../../util/glsl";
import {ShaderNode} from "./shader-node";
import {ShaderNodeLoader} from "./shader-node-loader";

export class Shader {

	private node: ShaderNode;

	constructor(node: ShaderNode) {
		this.node = node;
	}

	public static fromJSON(jsonString: string) : Shader {
		return new Shader(ShaderNodeLoader.fromJSON(jsonString));
	}

	public compile(): GLSLFunctionSet {
		return this.node.compile();
	}

}
