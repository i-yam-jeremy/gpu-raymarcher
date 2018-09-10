import {ShaderNode, ShaderNodeData} from "../shader-node";
import {GLSLFunction, GLSLFunctionType} from "../../../util/glsl";

/*
 * Shader for Phong reflectance
 * Shading has a ambient, diffuse, and specular component
 */
export class Phong extends ShaderNode {

	/* the amount of ambient reflectance */
	private ambientAmount: ShaderNode;
	/* the color of ambient reflectance */
	private ambientColor: ShaderNode;
	/* the amount of diffuse reflectance */
	private diffuseAmount: ShaderNode;
	/* the color of diffuse reflectance */
	private diffuseColor: ShaderNode;
	/* the specular power */
	private specularPower: ShaderNode;
	/* the surface normal of the model at the point to be shaded */
	private normal: ShaderNode;
	/* the direction pointing towards the light from the point to be shaded */
	private lightDir: ShaderNode;
	/* the view direction from the camera to the point on the object surface to be shaded */
	private viewDir: ShaderNode;

	/*
	 * Creates a Lambert shader with the specified fields
	 *
	 * @param ambientAmount - the amount of ambient reflectance
	 * @param ambientColor - the color of ambient reflectance
	 * @param diffuseAmount - the color of diffuse reflectance
	 * @param diffuseColor - the color of diffuse reflectance
	 * @param normal - the surface normal of the model at the point to be shaded
	 * @param lightDir - the incoming light direction
	 * @param viewDir - the view direction from the camera
	 */
	constructor(ambientAmount: ShaderNode, ambientColor: ShaderNode, diffuseAmount: ShaderNode, diffuseColor: ShaderNode, specularPower: ShaderNode, normal: ShaderNode, lightDir: ShaderNode, viewDir: ShaderNode) {
		super();
		this.ambientAmount = ambientAmount;
		this.ambientColor = ambientColor;
		this.diffuseAmount = diffuseAmount;
		this.diffuseColor = diffuseColor;
		this.specularPower = specularPower;
		this.normal = normal;
		this.lightDir = lightDir;
		this.viewDir = viewDir;
	}

	/*
	 * Creates a Phong shader from the specified node data
	 *
	 * @param nodeData - the node data
	 *
	 * Node Data Format:
	 * {
	 * 	"type": "phong",
	 * 	"ambient": {
	 *		"amount": <number>,
	 *		"color": <vec3>
	 * 	},
	 * 	"diffuse": {
	 *		"amount": <number>,
	 *		"color": <vec3>
	 * 	},
	 * 	"specular": <number>,
	 * 	"normal": <vec3>,
	 * 	"light-dir": <vec3>,
	 * 	"view-dir": <vec3>
	 * }
	 *
	 * @return - a Phong shader
	 */
	public static create(nodeData: ShaderNodeData): Phong {
		return new Phong(
			nodeData.ambient.amount,
			nodeData.ambient.color,
			nodeData.diffuse.amount,
			nodeData.diffuse.color,
			nodeData.specular,
			nodeData.normal,
			nodeData['light-dir'],
			nodeData['view-dir']
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
				"specular": this.specularPower.compile(),
				"normal": this.normal.compile(),
				"light_dir": this.lightDir.compile(),
				"view_dir": this.viewDir.compile()
			},
		`
				vec3 ambient = $$ambient_amount$$*$$ambient_color$$;
				vec3 diffuse = $$diffuse_amount$$*$$diffuse_color$$*max(0.0, dot($$normal$$, -$$light_dir$$));
				vec3 specular = dot($$normal$$, $$light_dir$$) < 0.0 ?
					/*TODO $$light_color*/vec3(1)*pow(
						max(0.0, dot(reflect(-$$light_dir$$, $$normal$$), $$view_dir$$)),
						$$specular$$
					):
					vec3(0);
				return ambient + diffuse + specular;
		`);
	}

}
