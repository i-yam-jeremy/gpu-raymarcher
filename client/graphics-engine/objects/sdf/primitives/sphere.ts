import {SDFNode, SDFNodeData} from "../sdf-node";
import {GLSLFunctionSet, GLSLFunction} from "../../../util/glsl";

export class Sphere extends SDFNode {

	private radius: number;

	constructor(radius: number) {
		super();
		this.radius = radius;
	}

	public static create(nodeData: SDFNodeData): Sphere {
		return new Sphere(nodeData.radius);
	}

	public compile(): GLSLFunctionSet {
		return {
			'sdf': new GLSLFunction('float', ['vec3 p'], 'return length(p) - float(' + this.radius + ');')
		};
	}

}
