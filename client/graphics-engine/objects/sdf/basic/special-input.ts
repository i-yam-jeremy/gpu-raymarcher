import {SDFNode, SDFNodeData} from "../sdf-node";
import {GLSLFunction, GLSLFunctionType} from "../../../util/glsl";

/*
 * The types of the special inputs
 *
 * input name -> type
 */
const SPECIAL_NAME_TYPES = {
	"p": "vec3",
	"u_time": "float"
};

/*
 * A shader node for getting the value of special inputs (such as normal, light_dir, etc.)
 */
export class SpecialInput extends SDFNode {

	private name: string;

	/*
	 * Creates a special input node with the given input name
	 *
	 * @param name - the name of the special input
	 */
	constructor(name: string) {
		super();
		if (!(name in SPECIAL_NAME_TYPES)) {
			throw 'Invalid special input name';
		}
		this.name = name;
	}

	/*
	 * Creates a special input node from the given node data
	 *
	 * @param nodeData - the node data
	 *
	 * Node Data Format:
	 *
	 * {
	 * 	"type": "special-input",
	 * 	"name": <string>
	 * }
	 *
	 * @return - a special input node
	 */
	public static create(nodeData: SDFNodeData): SpecialInput {
		return new SpecialInput(nodeData.name);
	}

	/*
	 * Converts this node to GLSL code
	 *
	 * @return - a GLSL function that returns the value of the special input
	 *
	 */
	public compile(): GLSLFunction {
		return new GLSLFunction(GLSLFunctionType.SDF, SPECIAL_NAME_TYPES[this.name], {}, 'return ' + this.name + ';');
	}

}
