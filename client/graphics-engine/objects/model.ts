import {GLSLFunctionSet} from "../util/glsl";
import {SDF} from "./sdf";
import {Shader} from "./shader";

export class Model {

	private sdf: SDF;
	private shader: Shader;

	//TODO
	constructor(sdf: SDF, shader: Shader) {
		this.sdf = sdf;
		this.shader = shader;
	}
	
	public compile(): GLSLFunctionSet {
		return (<any>Object).assign({}, this.sdf.compile(), this.shader.compile());
	}

}
