import {Model} from "../objects";
import {FileBundle} from "../../file-bundle";

/*
 * Contains data for GLSL vectors
 */
abstract class GLSLVec {

	/* the data stored in this vector */
	protected data: number[];

	/*
	 * Creates a GLSL vector with the specified data
	 * 
	 * @param data - the data
	 */
	constructor(data: number[]) {
		this.data = data;
	}

}

/*
 * A 3D GLSL vector
 * Equivalent to vec3
 */
export class GLSLVec3 extends GLSLVec {

	/*
	 * Creates a 3D GLSL vector with the specified data
	 *
	 * @param data - the data (must be of length 3)
	 */
	constructor(data: number[]) {
		if (data.length == 3) {
			super(data);
		}
		else {
			throw 'Array must have 3 elements';
		}
	}

	/*
	 * Converts this vector into a GLSL constant expression
	 * representing the same data
	 */
	public toGLSLString(): string {
		return 'vec3(' + this.data.join(', ') + ')';
	}

}

/*
 * A GLSL function
 */
export class GLSLFunction {

	/* the type of this function */
	readonly fType: GLSLFunctionType;
	/* the return type */
	readonly returnType: string;
	/*
	 * The dependencies/inputs to this GLSL function
	 */
	readonly dependencies: { [name: string] : GLSLFunction};
	/*
	 * the source / body of this function
	 */
	readonly source: string;

	/*
	 * Creates a GLSLFunction
	 *
	 * @param fType - the type of this function
	 * @param returnType - the return type
	 * @param params - the params with their types included
	 * @param source - the source / body of the function
	 *
	 */
	constructor(fType: GLSLFunctionType, returnType: string, dependencies: { [name: string] : GLSLFunction }, source: string) {
		this.fType = fType;
		this.returnType = returnType;
		this.dependencies = dependencies;
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
		const dependencySource = Object.keys(this.dependencies).map(dependencyName => {
			return this.dependencies[dependencyName].compile(name + "_" + dependencyName);
		}).join("\n");
		var paramString = (this.fType == GLSLFunctionType.SHADER) ? "(vec3 p, vec3 normal, vec3 light_dir)" : "(vec3 p)";
		var callDependencyArgsString = (this.fType == GLSLFunctionType.SHADER) ? "(p, normal, light_dir)" : "(p)";
		var functionSource = this.returnType + " " + name + paramString + " {\n" + this.source + "\n}\n";
		Object.keys(this.dependencies).forEach(dependencyName => {
			functionSource = functionSource.replace(new RegExp("\\$\\$" + dependencyName + "\\$\\$", "g"), name + "_" + dependencyName + callDependencyArgsString); // FIXME (this is a bug if the dependency name has any special regex characters because it will match other things too (if restricted to alphanumeric and underscore it should be fine)
		});
		return dependencySource + "\n" + functionSource;
	}

}

/*
 * The type of a GLSLFunction
 */
export enum GLSLFunctionType { SDF, SHADER };

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

/*
 * Returns the model specific function name given the generic base name for the function
 *
 * @param baseName - the generic name of the function
 * @param modelId - the ID of the model
 *
 * @return - the name of the model specific function
 */
function getModelFunctionName(baseName: string, modelId: number) {
	return baseName + "_" + modelId;
}

/*
 * Generates the branching GLSL code for calling the model specific SDF function
 * based on the ID.
 *
 * @param modelCount - the number of models (and therefore the number of model specific SDF functions)
 *
 * @return - the GLSL code for branching and calling a specific SDF when given the model ID
 */
function generateSceneSDFGLSLBranchingCode(modelCount: number) {
	var nearestLargerPowerOfTwoModelCount = Math.pow(2, Math.ceil(Math.log(modelCount)/Math.LN2));
	function generateBranches(startId: number, endId: number): string {
		if (startId+1 == endId) {
			return "if (modelId == " + startId + ") { return " + getModelFunctionName('sdf', startId) + "(p); }\n";
		}
		else {
			var midpoint = (startId + endId) / 2;
			return "if (modelId < " + midpoint + ") {\n" + generateBranches(startId, midpoint) + "}\n" +
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
 * Generates the branching GLSL code for calling the model specific shader function
 * based on the ID.
 *
 * @param modelCount - the number of models (and therefore the number of model specific shader functions)
 *
 * @return - the GLSL code for branching and calling a specific model shader when given the model ID
 */
function generateModelShaderGLSLBranchingCode(modelCount: number) {
	var nearestLargerPowerOfTwoModelCount = Math.pow(2, Math.ceil(Math.log(modelCount)/Math.LN2));
	function generateBranches(startId: number, endId: number): string {
		if (startId+1 == endId) {
			return "if (modelId == " + startId + ") { return " + getModelFunctionName('shade', startId) + "(p, normal, light_dir); }\n";
		}
		else {
			var midpoint = (startId + endId) / 2;
			return "if (modelId < " + midpoint + ") {\n" + generateBranches(startId, midpoint) + "}\n" +
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
		"scene_sdf_branching_code": generateSceneSDFGLSLBranchingCode(models.length),
		"model_shader_branching_code": generateModelShaderGLSLBranchingCode(models.length)
	});
}
