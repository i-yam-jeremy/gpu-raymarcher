import {SDFNode, SDFNodeData} from "../sdf-node";
import {GLSLFunction, GLSLFunctionType} from "../../../util/glsl";

/*
 * A SDf node with custom GLSL code as the source
 */
export class Custom extends SDFNode {

	/* the GLSL source of this node */
	private source: string;
	/* the return type of this node */
	private returnType: string;
	/* the depedencies / inputs of this node */
	private dependencies: { [name: string] : SDFNode };

	/*
	 * Creates a custom node with the given source, return type, and depedencies
	 *
	 * @param source - the GLSL source
	 * @param returnType - the return type
	 * @param dependencies - the dependencies / inputs
	 */
	constructor(source: string, returnType: string, dependencies: { [name: string] : SDFNode }) {
		super();
		this.source = source;
		this.returnType = returnType;
		this.dependencies = dependencies;
	}

	/*
	 * Creates a custom node from the given node data
	 *
	 * @param nodeData - the node data
	 *
	 * Node Data Format:
	 *
	 * {
	 * 	"type": "custom",
	 * 	"depdencies": { [name] : SDFNodeData }, // maps names to SDFNodeData that will be converted to SDFNodes
	 * 	"source": <string>,
	 * 	"return-type": <string>
	 * }
	 *
	 * @param - the custom node created
	 */
	public static create(nodeData: SDFNodeData): Custom {
		return new Custom(nodeData.source, nodeData['return-type'], nodeData.dependencies);
	}

	/*
	 * Compile this custom node to GLSL source
	 *
	 * @return - a GLSL function with the source of this custom node
	 */
	public compile(): GLSLFunction {
		var compiledDependencies = {};
		for (let name in this.dependencies) {
			compiledDependencies[name] = this.dependencies[name].compile();
		}
		return new GLSLFunction(GLSLFunctionType.SDF, this.returnType, compiledDependencies, this.source);
	}
}
