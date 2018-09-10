import {SDFNode, SDFNodeData} from "../sdf-node";
import {GLSLFunction, GLSLFunctionType} from "../../../util/glsl";

/*
 * An SDF node for distorting an SDF using a simple method
 */
export class SimpleDistortion extends SDFNode {

	/* the distance to the surface of the base object without distortion */
	private distance: SDFNode;
	/* the current point in the raymarching */
	private point: SDFNode;
	/* the magnitude of the distortion */
	private magnitude: SDFNode;
	/* the frequency of the distortion */
	private freq: SDFNode;

	/*
	 * Creates a distortion node
	 *
	 * @param distance - distance to the surface of the base object without distortion 
	 * @param point - the current point in the raymarching (the point used to calculate the distance)
	 * @param magnitude - the magnitude of the distortion
	 * @param freq - the frequency of the distortion
	 */
	constructor(distance: SDFNode, point: SDFNode, magnitude: SDFNode, freq: SDFNode) {
		super();
		this.distance = distance;
		this.point = point;
		this.magnitude = magnitude;
		this.freq = freq;
	}

	/*
	 * Creates a distortion node from the given node data
	 *
	 * @param nodeData - the node data
	 *
	 * Node Data Format:
	 *
	 * {
	 * 	"type": "simple-distortion",
	 * 	"distance": <number>,
	 * 	"p": <vec3>,
	 * 	"mangitude": <non-negative number>,
	 * 	"freq": <positive number>
	 * }
	 */
	public static create(nodeData: SDFNodeData): SimpleDistortion {
		return new SimpleDistortion(nodeData.distance, nodeData.p, nodeData.magnitude, nodeData.freq);
	}

	/*
	 * Converts this distortion node to GLSL code
	 *
	 * @return - the SDF function 
	 */
	public compile(): GLSLFunction {
		return new GLSLFunction(GLSLFunctionType.SDF,
			'float', 
			{
				"distance": this.distance.compile(),
				"p": this.point.compile(),
				"magnitude": this.magnitude.compile(),
				"freq": this.freq.compile()
			}, 
			'return $$distance$$ + $$magnitude$$*sin($$freq$$*$$p$$.x)*sin($$freq$$*$$p$$.y)*sin($$freq$$*$$p$$.z);'
		);
	}

}
