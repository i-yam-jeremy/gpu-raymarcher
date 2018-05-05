import {ShaderNode, ShaderNodeData} from "../shader-node";
import {GLSLFunctionSet, GLSLFunction, GLSLVec3} from "../../../util/glsl";

export class Lambert extends ShaderNode {

	private ambientAmount: number;
	private ambientColor: GLSLVec3;
	private diffuseAmount: number;
	private diffuseColor: GLSLVec3;

	constructor(ambientAmount: number, ambientColor: GLSLVec3, diffuseAmount: number, diffuseColor: GLSLVec3) {
		super();
		this.ambientAmount = ambientAmount;
		this.ambientColor = ambientColor;
		this.diffuseAmount = diffuseAmount;
		this.diffuseColor = diffuseColor;
	}

	public static create(nodeData: ShaderNodeData): Lambert {
		return new Lambert(
			nodeData.ambient.amount,
			new GLSLVec3(nodeData.ambient.color),
			nodeData.diffuse.amount,
			new GLSLVec3(nodeData.diffuse.color)
		);
	}

	public compile(): GLSLFunctionSet {
		return {
			'shade': new GLSLFunction('vec3', ['vec3 p', 'vec3 normal', 'vec3 lightDir'], `
				float ambient_amount = float(` + this.ambientAmount + `);
				vec3 ambient_color = ` + this.ambientColor.toString() + `;
				float diffuse_amount = float(` + this.diffuseAmount + `);
				vec3 diffuse_color = ` + this.diffuseColor.toString() + `;
				return ambient_amount*ambient_color + diffuse_amount*diffuse_color*dot(normal, lightDir);
			`)
		};
	}

}
