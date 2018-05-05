import {SDFNode, SDFNodeData} from "../sdf-node";
import {GLSLFunctionSet, GLSLFunction} from "../../../util/glsl";

/*
 * An SDF node for a sphere
 */
export class Sphere extends SDFNode {

	/* the radius of the sphere */
	private radius: number;

	/*
	 * Creates a sphere node with the given radius
	 *
	 * @param radius - the radius of the sphere
	 */
	constructor(radius: number) {
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
	 * @return - the set of functions defined by this node
	 */
	public compile(): GLSLFunctionSet {
		return {
			'sdf': new GLSLFunction('float', ['vec3 p'], 'return length(p) - float(' + this.radius + ');')
		};
	}

}
