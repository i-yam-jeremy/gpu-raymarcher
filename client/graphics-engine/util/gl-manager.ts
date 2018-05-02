import {RenderableObject, Model} from "../objects";
import {VERTEX_SHADER_SOURCE, generateFragmentShaderSource} from "./glsl";

/* used for attribute locations from gl.getAttribLocation(...) */
type AttribLocation = number;

/*
 * Thrown when a GLSL shader could not be compiled
 */
class ShaderCompilationError extends Error {

	/*
	 * @param shaderType - the type of the shader (either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
	 * @param message - the error message
	 */
	constructor(shaderType: number, message: string) {
		super(message);
		this.name = "ShaderCompilationException";
	}

}

/*
 * Helps encapsulate WebGL functionality so other code doesn't have to deal with
 * the complexities of WebGL and the other code only has to deal with models, objects, and scenes
 * Handles shaders, rendering, etc.
 */
export class GLManager {

	/* the WebGLRenderingContext this GLManager is managing */
	private gl: WebGLRenderingContext;
	/* the current program */
	private program: WebGLProgram;
	/* the current vertex shader */
	private vertexShader: WebGLShader;
	/* the current fragment shader */
	private fragmentShader: WebGLShader;
	/* the vertex buffer for drawing the 2d screen-filling object that is shaded
	 * to display pixels to the screen using the fragment shader */
	private vertexBuffer: WebGLBuffer;
	/* the vertex attribute location for the vertex buffer */
	private vertexAttrib: AttribLocation;
	/* the frame number uniform location */
	private uTime: WebGLUniformLocation;
	/* the camera pos uniform location */
	private uCameraPos: WebGLUniformLocation;
	/* the time in milliseconds of the start of the last frame rendered */
	private lastFrameTime: number;
	/* the total number of seconds this has been running */
	private time: number;

	/*
	 * @param gl - manages the given WebGLRenderingContext
	 */
	constructor(gl: WebGLRenderingContext) {
		this.gl = gl;
		this.updateShaders([]);
		this.vertexBuffer = this.createVertexBuffer();
		this.time = 0;
		this.lastFrameTime = Date.now();
	}

	/*
	 * Updates the source and recompiles the shaders based on the given models
	 *
	 * @param models - the models to incorporate into the shader (all objects used with these new shaders must be an instance of one of the models)
	 */
	public updateShaders(models: Model[]): void {
		var gl = this.gl;

		this.program = this.gl.createProgram();

		this.vertexShader = this.createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
		this.fragmentShader = this.createShader(gl.FRAGMENT_SHADER, generateFragmentShaderSource(models));

		gl.attachShader(this.program, this.vertexShader);
		gl.attachShader(this.program, this.fragmentShader);

		gl.linkProgram(this.program);

		var linkedSuccessfully = gl.getProgramParameter(this.program, gl.LINK_STATUS);

		if (!linkedSuccessfully) {
			alert("Couldn't link WebGLProgram");
			console.error(gl.getProgramInfoLog(this.program));
		}

		this.vertexAttrib = gl.getAttribLocation(this.program, "pos");
		gl.enableVertexAttribArray(this.vertexAttrib);	
	
		this.setUniformLocations(this.program);
	}

	/*
	 * Sets the uniform location fields of this object to the uniform locations in the given GLProgram
	 *
	 * @param program - the current program
	 */
	private setUniformLocations(program: WebGLProgram) {
		var gl = this.gl;
		
		this.uTime = gl.getUniformLocation(program, "u_time");
		this.uCameraPos = gl.getUniformLocation(program, "u_camera_pos");

		
	}

	/*
	 * Sets uniforms to the correct values
	 * Called once per frame
	 */
	private setUniforms(): void {
		var gl = this.gl;

		gl.uniform3fv(this.uCameraPos, [0, 0, 0]);
		gl.uniform1f(this.uTime, this.time);
	}

	/*
	 * Render one frame using the fragment shader
	 */
	public render(): void {
		this.time += (Date.now() - this.lastFrameTime) / 1000;
		this.lastFrameTime = Date.now();
		
		var gl = this.gl;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // TODO make this more efficient by not using gl.canvas to get width and height
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(this.program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(this.vertexAttrib, 2, gl.FLOAT, false, 0, 0);

		this.setUniforms();

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	/*
	 * Creates a WebGL shader of the given type with the given source
	 *
	 * @param shaderType - the type of shader (either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
	 * @param source - the source of the shader
	 * @return the compiled shader
	 * @throws ShaderCompilationError
	 */
	private createShader(shaderType: number, source: string): WebGLShader {
		var gl = this.gl;
		
		var shader = this.gl.createShader(shaderType);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		var compiledSuccessfully = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		
		if (!compiledSuccessfully) {
			throw new ShaderCompilationError(shaderType, gl.getShaderInfoLog(shader));
		}
		
		return shader;
	}

	/*
	 * Creates a vertex buffer for triangles to fill the 2d screen
	 *
	 * @return the buffer containing the vertex data
	 */
	private createVertexBuffer(): WebGLBuffer {
		var gl = this.gl;
		
		var vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		var vertices = [
			-1, -1,
			-1,  1,
			 1,  1,

			-1,  -1,
			 1,  -1,
			 1,   1
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		return vertexBuffer;
	}

}
