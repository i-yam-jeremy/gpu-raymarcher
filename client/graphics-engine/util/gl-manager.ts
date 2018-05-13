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

	/* the WebGL2RenderingContext this GLManager is managing */
	private gl: WebGL2RenderingContext;
	/* the current program */
	private program: WebGLProgram = null;
	/* the current vertex shader */
	private vertexShader: WebGLShader = null;
	/* the current fragment shader */
	private fragmentShader: WebGLShader = null;
	/* the vertex buffer for drawing the 2d screen-filling object that is shaded
	 * to display pixels to the screen using the fragment shader */
	private vertexBuffer: WebGLBuffer;
	/* the vertex attribute location for the vertex buffer */
	private vertexAttrib: AttribLocation;
	/* the frame number uniform location */
	private uTime: WebGLUniformLocation;
	/* the camera pos uniform location */
	private uCameraPos: WebGLUniformLocation;
	/* the screen width and height uniform location */
	private uResolution: WebGLUniformLocation;
	/* the uniform location for the texture containing object data */
	private uObjectData: WebGLUniformLocation;
	/* the uniform location for the side length of the object data texture */
	private uObjectDataSideLength: WebGLUniformLocation;
	/* the uniform location for the count of objects in the scene */
	private uObjectCount: WebGLUniformLocation;
	/* object data texture */
	private objectDataTexture: WebGLTexture;
	/* the time in milliseconds of the start of the last frame rendered */
	private lastFrameTime: number;
	/* the total number of seconds this has been running */
	private time: number;

	/*
	 * @param gl - manages the given WebGL2RenderingContext
	 */
	constructor(gl: WebGL2RenderingContext) {
		this.gl = gl
		this.updateShaders([]);
		this.vertexBuffer = this.createVertexBuffer();
		this.time = 0;
		this.lastFrameTime = Date.now();
		this.objectDataTexture = gl.createTexture();
		this.updateObjectData([], []);
	}

	/*
	 * Updates the data to be passed to the GPU/fragment shader that is stored in textures
	 * (objects data such as transformation matrix, etc.) 
	 *
	 * @param objects - the objects to put into the texture
	 * @param uniqueModels - the models used by the objects with no duplicates
	 */
	public updateObjectData(objects: RenderableObject[], uniqueModels: Model[]): void {
		var gl = this.gl;

		//TODO may need to delete and recreate texture if it cannot be resized. But if it CAN be resized with texImage2D just do that instead
		// BASED ON THE TEST BELOW IT LOOKS LIKE YOU CAN REUSE TEXTURES SO I WON'T NEED TO DELETE THEM (once the data packing on CPU and unpacking on GPU is implemented I will test to make sure it still works for resizing)

		var dataSize = objects.length * RenderableObject.SIZE_IN_FLOATS;
		var sideLength = Math.pow(2, Math.ceil(Math.log(Math.sqrt(dataSize/4))/Math.LOG2E));
		var buffer = new Float32Array(4*sideLength*sideLength);

		gl.uniform1i(this.uObjectDataSideLength, sideLength);
		gl.uniform1i(this.uObjectCount, objects.length);

		for (let i = 0; i < objects.length; i++) {
			var dst = new Float32Array(buffer.buffer, i*RenderableObject.SIZE_IN_BYTES, RenderableObject.SIZE_IN_FLOATS);
			objects[i].toFloatData(dst, uniqueModels.indexOf(objects[i].getModel()), uniqueModels.length);
		}

		gl.deleteTexture(this.objectDataTexture);
		this.objectDataTexture = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.objectDataTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, sideLength, sideLength, 0, gl.RGBA, gl.FLOAT, buffer);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.uniform1i(this.uObjectData, 0);
		//gl.bindTexture(gl.TEXTURE_2D, null);


	}

	/*
	 * Updates the source and recompiles the shaders based on the given models
	 *
	 * @param models - the models to incorporate into the shader (all objects used with these new shaders must be an instance of one of the models)
	 */
	public updateShaders(models: Model[]): void {
		var gl = this.gl;

		if (this.program) {
			gl.deleteProgram(this.program);
		}
		if (this.vertexShader) {
			gl.deleteShader(this.vertexShader);
		}
		if (this.fragmentShader) {
			gl.deleteShader(this.fragmentShader);
		}
		
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
		this.uResolution = gl.getUniformLocation(program, "u_resolution");

		this.uObjectData = gl.getUniformLocation(program, "u_object_data");
		this.uObjectDataSideLength = gl.getUniformLocation(program, "u_object_data_side_length");
		this.uObjectCount = gl.getUniformLocation(program, "u_object_count");
	}

	/*
	 * Sets uniforms to the correct values
	 * Called once per frame
	 */
	private setUniforms(): void {
		var gl = this.gl;

		gl.uniform3fv(this.uCameraPos, [0, 0, 0]);
		gl.uniform1f(this.uTime, this.time);
		gl.uniform2f(this.uResolution, gl.canvas.width, gl.canvas.height); //FIXME make this more efficient because DOM is slow
	}

	/*
	 * Render one frame using the fragment shader
	 *
	 * @param objects - the objects to render
	 * @param uniqueModels - the models used by the objects with no duplicates
	 */
	public render(objects: RenderableObject[], uniqueModels: Model[]): void {
		this.time += (Date.now() - this.lastFrameTime) / 1000;
		this.lastFrameTime = Date.now();

		var gl = this.gl;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // TODO make this more efficient by not using gl.canvas to get width and height
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(this.program);
		this.updateObjectData(objects, uniqueModels);
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
