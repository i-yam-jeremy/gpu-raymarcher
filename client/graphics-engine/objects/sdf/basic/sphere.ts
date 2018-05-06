import {SDFNode, SDFNodeData} from "../sdf-node";
import {GLSLFunction, GLSLFunctionType} from "../../../util/glsl";

/*
 * An SDF node for a sphere
 */
export class Sphere extends SDFNode {

	/* the radius of the sphere */
	private radius: SDFNode;

	/*
	 * Creates a sphere node with the given radius
	 *
	 * @param radius - the radius of the sphere
	 */
	constructor(radius: SDFNode) {
		super();
		this.radius = radius;
	}

	/*
	 * Creates a sphere node from the given node data
	 *
	 * @param nodeData - the node data
	 *
	 * Node Data Format:
	 *
	 * {
	 * 	"type": "sphere",
	 * 	"radius": <number>
	 * }
	 */
	public static create(nodeData: SDFNodeData): Sphere {
		return new Sphere(nodeData.radius);
	}

	/*
	 * Converts this sphere node to GLSL code
	 *
	 * @return - the SDF function 
	 */
	public compile(): GLSLFunction {
		return new GLSLFunction(GLSLFunctionType.SDF,
			'float', 
			{
				"radius": this.radius.compile()
			}, 
			'return length(p) - float($$radius$$);'
		);
	}

}
