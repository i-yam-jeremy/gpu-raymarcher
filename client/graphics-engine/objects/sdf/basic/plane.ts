import {SDFNode, SDFNodeData} from "../sdf-node";
import {GLSLFunction, GLSLFunctionType} from "../../../util/glsl";

/*
 * An SDF node for a plane
 */
export class Plane extends SDFNode {

	/* the normal of the plane */
	private normal: SDFNode;
	/* the point to calculate the distance from the surface to (the point is in localized model coordinate space) */
	private p: SDFNode;

	/*
	 * Creates a plane node with the given normal
	 *
	 * @param normal - the normal of the plane
	 * @param p - the point to calculate the distance from the surface to (the point is in localized model coordinate space)
	 */
	constructor(normal: SDFNode, p: SDFNode) {
		super();
		this.normal = normal;
		this.p = p;
	}

	/*
	 * Creates a plane node from the given node data
	 *
	 * @param nodeData - the node data
	 *
	 * Node Data Format:
	 *
	 * {
	 * 	"type": "plane",
	 * 	"normal": <vec3> // must be normalized
	 * 	"p": <vec3> // the point to calculate the distance from the surface to (point is in local model coordinate space)
	 * }
	 */
	public static create(nodeData: SDFNodeData): Plane {
		return new Plane(nodeData.normal, nodeData.p);
	}

	/*
	 * Converts this plane node to GLSL code
	 *
	 * @return - the SDF function 
	 */
	public compile(): GLSLFunction {
		return new GLSLFunction(GLSLFunctionType.SDF,
			'float', 
			{
				"p": this.p.compile(),
				"normal": this.normal.compile()
			}, 
			'return dot($$p$$, $$normal$$.xyz);'
		);
	}

}
