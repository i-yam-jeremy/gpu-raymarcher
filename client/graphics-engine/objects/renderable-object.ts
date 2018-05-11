import {Model} from "./model";
import {TickCallback} from "../util/ticker";
import {Transform} from "./transform";

/*
 * A 3D object
 */
export class RenderableObject {

	public static SIZE_IN_FLOATS: number = 1;/*model id*/ //+ Transform.SIZE_IN_FLOATS;
	public static SIZE_IN_BYTES: number = 4*RenderableObject.SIZE_IN_FLOATS;

	/* the model this object is based on */
	private model: Model;
	/* called every tick */
	readonly tick: TickCallback;
	/* the transformations applied to this object */
	private transform: Transform; 

	/*
	 * Creates a 3D object with the given model
	 *
	 * @param model - the model this is an instance of
	 * @param tick - the tick function for this object
	 */
	constructor(model: Model, tick: TickCallback) {
		this.model = model;
		this.tick = tick;
	}

	/*
	 * Returns the model this object is an instance of
	 *
	 * @return - the model
	 */
	public getModel(): Model {
		return this.model;
	}

	public toFloatData(dst: Float32Array, modelId: number): void {
		dst[0] = modelId;
		//this.transform.toFloatData(new Float32Array(dst.buffer, Float32Array.BYTES_PER_ELEMENT, Transform.SIZE_IN_BYTES));
	}

}
