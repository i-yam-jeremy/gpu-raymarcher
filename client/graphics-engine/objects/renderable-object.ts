import {Model} from "./model";
import {TickCallback} from "../util/ticker";

/*
 * A 3D object
 */
export class RenderableObject {

	/* the model this object is based on */
	private model: Model;
	/* called every tick */
	readonly tick: TickCallback;
	/* the transformations applied to this object */
	//TODO private transform: Transform; // includes scale, translation, rotation

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

}
