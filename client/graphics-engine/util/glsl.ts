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

%%model_source%%

void main() {
	gl_FragColor = vec4(1, 0, 0, 1);
}

`;

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
export function transpileFragmentShaderSource(params: { [ name: string ] : string }): string {
	var source = FRAGMENT_SHADER_SOURCE_TEMPLATE;
	for (let key in params) {
		source = source.replace("%%" + key + "%%", params[key]);
	}
	/* 
	 * This is done after the replacement of params so if parameters
	 * have syntactic sugar than can be transpiled as well
	 */
	source = transpileSyntacticSugar(source);
	return source;
}
