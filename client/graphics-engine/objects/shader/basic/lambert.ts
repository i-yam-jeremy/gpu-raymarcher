import {ShaderNode, ShaderNodeData} from "../shader-node";
import {GLSLFunction, GLSLFunctionType} from "../../../util/glsl";

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
	/* the surface normal of the model at the point to be shaded */
	private normal: ShaderNode;
	/* the direction of incoming light towards the point to be shaded */
	private lightDir: ShaderNode;

	/*
	 * Creates a Lambert shader with the specified fields
	 *
	 * @param ambientAmount - the amount of ambient reflectance
	 * @param ambientColor - the color of ambient reflectance
	 * @param diffuseAmount - the color of diffuse reflectance
	 * @param diffuseColor - the color of diffuse reflectance
	 * @param normal - the surface normal of the model at the point to be shaded
	 * @param light_dir - the incoming light direction
	 *
	 */
	constructor(ambientAmount: ShaderNode, ambientColor: ShaderNode, diffuseAmount: ShaderNode, diffuseColor: ShaderNode, normal: ShaderNode, lightDir: ShaderNode) {
		super();
		this.ambientAmount = ambientAmount;
		this.ambientColor = ambientColor;
		this.diffuseAmount = diffuseAmount;
		this.diffuseColor = diffuseColor;
		this.normal = normal;
		this.lightDir = lightDir;
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
	 * 	},
	 * 	"normal": <vec3>,
	 * 	"light_dir": <vec3>
	 * }
	 *
	 * @return - a Lambert shader
	 */
	public static create(nodeData: ShaderNodeData): Lambert {
		return new Lambert(
			nodeData.ambient.amount,
			nodeData.ambient.color,
			nodeData.diffuse.amount,
			nodeData.diffuse.color,
			nodeData.normal,
			nodeData.light_dir
		);
	}

	/*
	 * Converts this shader into GLSL code
	 *
	 * @return - the GLSLFunctionSet specifying the shade function for this shader
	 */
	public compile(): GLSLFunction {
		return new GLSLFunction(GLSLFunctionType.SHADER,
			'vec3', 
			{
				"ambient_amount": this.ambientAmount.compile(),
				"ambient_color": this.ambientColor.compile(),
				"diffuse_amount": this.diffuseAmount.compile(),
				"diffuse_color": this.diffuseColor.compile(),
				"normal": this.normal.compile(),
				"light_dir": this.lightDir.compile()
			},
		`
				float ambient_amount = float($$ambient_amount$$);
				vec3 ambient_color = $$ambient_color$$;
				float diffuse_amount = float($$diffuse_amount$$);
				vec3 diffuse_color = $$diffuse_color$$;
				return ambient_amount*ambient_color + diffuse_amount*diffuse_color*dot($$normal$$, $$light_dir$$);
		`);
	}

}
