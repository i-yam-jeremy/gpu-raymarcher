import {Vector3} from "../util/vector";

export class Transform {

	/*
	 * 4x4 transformation matrix including scale, rotation and translation
	 * TODO possibly make this the inverse of the transformation so it can be applied to p just by multiplication and inverse does not need to be calculated in shader
	 *
	 *
	 * Format (to ensure vectors are in contiguous memory)
	 *
	 * [ lookLeft,		0]
	 * [ lookUp,		0]
	 * [ lookForward,	0]
	 * [ translation,	0]
	 *
	 */
	/*	private transformationMatrix: Float32Array;

	public Transform() {
		this.transformationMatrix = new Float32Array([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]);
	}

	public get pos(): Vector3 {
		return new Vector3(new Float32Array(this.transformationMatrix.buffer, 0, 3*Float32Array.BYTES_PER_ELEMENT)); // this uses the same memory as the internal transformation matrix, so modifying this will modify the matrix
	}

	public set pos(p: Vector3): void {
		this.transformationMatrix[0] = p.x;
		this.transformationMatrix[1] = p.y;
		this.transformationMatrix[2] = p.z;
	}

	public toFloatData(dst: Float32Array): void {
		for (let i = 0; i < this.transformationMatrix.length; i++) {
			dst[i] = this.transformationMatrix[i];
		}
	}*/
}
