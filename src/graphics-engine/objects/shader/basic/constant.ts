import {ShaderNode, ShaderNodeData} from "../shader-node";
import {GLSLFunction, GLSLFunctionType} from "../../../util/glsl";

/*
 * A shader node that evaluates to a constant value
 */
export class ConstantNode extends ShaderNode {

	/* the data representing the constant value */
	private data: number|number[];

	/*
	 * Creates a constant node with the given value
	 *
	 * @param data - the value of the constant
	 */
	constructor(data: number|number[]) {
		super();
		if (data instanceof Array && (<number[]>data).length < 2 || (<number[]>data).length > 4) {
			throw 'Error: Constant vector must have dimension between 2 and 4 inclusive';
		}
		this.data = data;
	}

	/*
	 * Converts this constant node into GLSL code
	 *
	 * @return - a function that evaluates to the constant value of this node
	 *
	 */
	public compile(): GLSLFunction {
		var dataType: string;
		var literalString: string;
		if (typeof this.data == 'number') {
			dataType = 'float';
			literalString = "float(" + (<number>this.data).toString() + ")";
		}
		else if (this.data instanceof Array) {
			dataType = {2: 'vec2', 3: 'vec3', 4: 'vec4'}[this.data.length];
			literalString = dataType + "(" + (<number[]>this.data).join(", ") + ")";
		}
		return new GLSLFunction(GLSLFunctionType.SHADER, dataType, {}, "return " + literalString + ";");
	}

}
