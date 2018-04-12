import {Model} from "../objects";

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
const FRAGMENT_SHADER_SOURCE_TEMPLATE = `

precision highp float;

#define NO_OBJECT_FOUND (-1)

struct Ray {
	vec3 o; // origin
	vec3 d; // direction
};

struct Distance {
	int id; // object id
	float d; // distance
};

struct Intersection {
	int id; // object id
	vec3 p; // intersection point
};

%%model_source%%

Intersection march(Ray r) {
	vec3 p = r.o;
	for (int i = 0; i < %%max_marching_steps%%; i++) {
		Distance d = scene_sdf(p);

		if (d.d < %%epsilon%%) {
			return Intersection(d.id, p);
		}
		
		p += r.d*d.d;
	}
	return Intersection(NO_OBJECT_FOUND, vec3(0));
}

void main() {
	gl_FragColor = vec4(sin(gl_FragCoord.x/100.0), 0, 0, 1);
}

`;

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
			return "if (id == " + startId + ") { return " + getModelSDFFunctionName(startId) + "(p); }\n";
		}
		else {
			var midpoint = (startId + endId) / 2;
			return "if (id < " + midpoint + ") {\n" + generateBranches(startId, midpoint) + "}\n" +
				"else {\n" + generateBranches(midpoint, endId) + "}\n";
		}
	}
	return generateBranches(0, nearestLargerPowerOfTwoModelCount);
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
		modelSource += model.compile(id) + "\n";
	});
	//TODO add scene_sdf by using binary search branching
	return transpileFragmentShaderSource({"model_source": modelSource});
}
