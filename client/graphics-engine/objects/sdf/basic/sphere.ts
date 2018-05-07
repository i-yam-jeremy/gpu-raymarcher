import {SDFNode, SDFNodeData} from "../sdf-node";
import {GLSLFunction, GLSLFunctionType} from "../../../util/glsl";

/*
 * An SDF node for a sphere
 */
export class Sphere extends SDFNode {

	/* the radius of the sphere */
	private radius: SDFNode;
	/* the point to calculate the distance from the surface to (the point is in localized model coordinate space) */
	private p: SDFNode;

	/*
	 * Creates a sphere node with the given radius
	 *
	 * @param radius - the radius of the sphere
	 * @param p - the point to calculate the distance from the surface to (the point is in localized model coordinate space)
	 */
	constructor(radius: SDFNode, p: SDFNode) {
		super();
		this.radius = radius;
		this.p = p;
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
	 * 	"radius": <number>,
	 * 	"p": <vec3> // the point to calculate the distance from the surface to (point is in local model coordinate space)
	 * }
	 */
	public static create(nodeData: SDFNodeData): Sphere {
		return new Sphere(nodeData.radius, nodeData.p);
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
				"p": this.p.compile(),
				"radius": this.radius.compile()
			}, 
			'return length($$p$$) - float($$radius$$);'
		);
	}

}
