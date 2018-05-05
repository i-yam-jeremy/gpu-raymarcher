import {Model} from "../objects";
import {FileBundle} from "../../file-bundle";

abstract class GLSLVec {

	protected data: number[];

	constructor(data: number[]) {
		this.data = data;
	}

}

export class GLSLVec3 extends GLSLVec {

	constructor(data: number[]) {
		if (data.length == 3) {
			super(data);
		}
		else {
			throw 'Array must have 3 elements';
		}
	}

	public toString(): string {
		return 'vec3(' + this.data.join(', ') + ')';
	}

}

/*
 * A GLSL function
 */
export class GLSLFunction {

	/* the return type */
	readonly returnType: string;
	/*
	 * the parameters of this function with their types included
	 * 
	 * example: ["vec3 p", "float a", "int b"]
	 */
	readonly params: string[];
	/*
	 * the source / body of this function
	 */
	readonly source: string;

	/*
	 * Creates a GLSLFunction
	 *
	 * @param returnType - the return type
	 * @param params - the params with their types included
	 * @param source - the source / body of the function
	 *
	 */
	constructor(returnType: string, params: string[], source: string) {
		this.returnType = returnType;
		this.params = params;
		this.source = source;
	}

	/*
	 * Converts this function to GLSL source using the given name as the function name
	 *
	 * @param name - the name of the function
	 *
	 * @return - GLSL source
	 */
	public compile(name: string): string {
		return this.returnType + " " + name + "(" + this.params.join(", ") + ") {\n" + this.source + "\n}\n";
	}

}

/*
 * A type for collections of GLSL functions
 * function name -> function
 */
export type GLSLFunctionSet = { [funcname: string] : GLSLFunction};

/*
 * GLSL vertex shader source
 */
export const VERTEX_SHADER_SOURCE = `

attribute vec2 pos;

void main() {
	gl_Position = vec4(pos, 0, 1);
}

`;

/*
 * The template for the fragment shader source. It contains syntactic sugar and
 * parameters that will be replaced.
 */
const FRAGMENT_SHADER_SOURCE_TEMPLATE = FileBundle.asString('graphics-engine/util/frag.glsl');

/*
 * The default transpiler parameters
 */
const DEFAULT_PARAMS = {
	"max_marching_steps": 64,
	"epsilon": 0.01
};

/*
 * Extends GLSL by adding syntactic sugar.
 *
 * @param source - the source to transpile to GLSL
 * @return - the GLSL equivalent of the given source
 */
function transpileSyntacticSugar(source: string): string {
	// Currently does not add any features to GLSL
	return source;
}

/*
 * Transpiles the fragment shader source by adding in the given params and turning
 * syntactic sugar into GLSL
 *
 * @param params - the parameters to replace
 */
function transpileFragmentShaderSource(params: { [ name: string ] : any }): string {
	var source = FRAGMENT_SHADER_SOURCE_TEMPLATE;
	var paramsWithDefaults = (<any>Object).assign({}, DEFAULT_PARAMS);
	paramsWithDefaults = (<any>Object).assign(paramsWithDefaults, params);
	for (let key in paramsWithDefaults) {
		source = source.replace("%%" + key + "%%", "" + paramsWithDefaults[key]); // "" + params[key] is to convert the parameter values to strings if they are not already 
	}
	/* 
	 * This is done after the replacement of params so if parameters
	 * have syntactic sugar than can be transpiled as well
	 */
	source = transpileSyntacticSugar(source);
	return source;
}

function getModelSDFFunctionName(id: number): string {
	return "sdf_" + id;
}


function generateSceneSDFGLSLBranchingCode(modelCount: number) {
	var nearestLargerPowerOfTwoModelCount = Math.pow(2, Math.ceil(Math.log(modelCount)/Math.LN2));
	function generateBranches(startId: number, endId: number): string {
		if (startId+1 == endId) {
			return "if (id == " + startId + ") { return Distance(" + startId + ", " + getModelSDFFunctionName(startId) + "(p)); }\n";
		}
		else {
			var midpoint = (startId + endId) / 2;
			return "if (id < " + midpoint + ") {\n" + generateBranches(startId, midpoint) + "}\n" +
				"else {\n" + generateBranches(midpoint, endId) + "}\n";
		}
	}
	if (modelCount == 0) {
		return "";
	}
	else {
		return generateBranches(0, nearestLargerPowerOfTwoModelCount);
	}
}

/*
 * Compiles a set of GLSL functions using the specified model ID
 *
 * @param fSet - the set of GLSL functions
 * @param modelId - the ID of the model that these functions are related to
 *
 * @return - the GLSL source
 */
function compileFunctionSet(fSet: GLSLFunctionSet, modelId: number): string {
	return Object.keys(fSet).map((fname) => {
		return fSet[fname].compile(fname + "_" + modelId);
	}).join("\n");
}

/*
 * Generates the GLSL fragment shader source from the given models
 *
 * @param models - the models to incorporate into the shader source
 * @return the shader source
 */
export function generateFragmentShaderSource(models: Model[]): string {
	var modelSource = "";
	models.forEach((model, id) => {
		modelSource += compileFunctionSet(model.compile(), id) + "\n";
	});
	return transpileFragmentShaderSource({
		"model_source": modelSource,
		"scene_sdf_branching_code": generateSceneSDFGLSLBranchingCode(models.length)
	});
}
