import {ShaderNode, ShaderNodeData} from "../shader-node";
import {GLSLFunctionSet, GLSLFunction, GLSLVec3} from "../../../util/glsl";

/*
 * Shader for Lambertian reflectance
 * Shading has a ambient and diffuse component
 */
export class Lambert extends ShaderNode {

	/* the amount of ambient reflectance */
	private ambientAmount: ShaderNode;
	/* the color of ambient reflectance */
	private ambientColor: ShaderNode;
	/* the amount of diffuse reflectance */
	private diffuseAmount: ShaderNode;
	/* the color of diffuse reflectance */
	private diffuseColor: ShaderNode;

	/*
	 * Creates a Lambert shader with the specified fields
	 *
	 * @param ambientAmount - the amount of ambient reflectance
	 * @param ambientColor - the color of ambient reflectance
	 * @param diffuseAmount - the color of diffuse reflectance
	 * @param diffuseColor - the color of diffuse reflectance
	 *
	 */
	constructor(ambientAmount: ShaderNode, ambientColor: ShaderNode, diffuseAmount: ShaderNode, diffuseColor: ShaderNode) {
		super();
		this.ambientAmount = ambientAmount;
		this.ambientColor = ambientColor;
		this.diffuseAmount = diffuseAmount;
		this.diffuseColor = diffuseColor;
	}

	/*
	 * Creates a Lambert shader from the specified node data
	 *
	 * @param nodeData - the node data
	 *
	 * Node Data Format:
	 * {
	 * 	"type": "lambert",
	 * 	"ambient": {
	 *		"amount": <number>,
	 *		"color": <vec3>
	 * 	},
	 * 	"diffuse": {
	 *		"amount": <number>,
	 *		"color": <vec3>
	 * 	}
	 * }
	 *
	 * @return - a Lambert shader
	 */
	public static create(nodeData: ShaderNodeData): Lambert {
		return new Lambert(
			nodeData.ambient.amount,
			new GLSLVec3(nodeData.ambient.color),
			nodeData.diffuse.amount,
			new GLSLVec3(nodeData.diffuse.color)
		);
	}

	/*
	 * Converts this shader into GLSL code
	 *
	 * @return - the GLSLFunctionSet specifying the shade function for this shader
	 */
	public compile(): GLSLFunctionSet {
		var definedFunctions =
			{
				'shade': new GLSLFunction('vec3', ['vec3 p', 'vec3 normal', 'vec3 light_dir'], `
					float ambient_amount = float(` + this.ambientAmount.toInlineGLSL() + `);
					vec3 ambient_color = ` + this.ambientColor.toInlineGLSL() + `;
					float diffuse_amount = float(` + this.diffuseAmount.toInlineGLSL() + `);
					vec3 diffuse_color = ` + this.diffuseColor.toInlineGLSL() + `;
					return ambient_amount*ambient_color + diffuse_amount*diffuse_color*dot(normal, light_dir);
				`)
			};
		return (<any>Object).assign({}, definedFunctions, this.ambientAmount.compile(), this.ambientColor.compile(),
								  this.diffuseAmount.compile(), this.diffuseColor.compile());
	}

	//TODO some system where each call to compile exports only 1 function, and a list of named dependencies as children (maybe make depedencies a field in GLSLFunction)
	// then the exported function will have all the data it needs (and can name it's internal function as subnames of it's name, for example, if a function was called node_1 and it had 2 children they'd be named node_1_0 and node_1_1 so there are no naming conflicts. Then there is only one function returned and it only returns one value which is correct. Get rid of GLSLFunctionSet

	/*
	 *
	 */
	public toInlineGLSL(): string {
		
	}
}
