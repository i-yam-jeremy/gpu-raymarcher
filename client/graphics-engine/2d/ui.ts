import {Object2d} from "./object2d";

/*
 * The 2D UI
 */
export class UI {

	/*
	 * The objects the are currently in this 2D UI
	 * (they will be ticked and rendered)
	 */
	private objects: Object2d[];

	/*
	 * Instantiates a new UI
	 */
	constructor() {
		this.objects = [];
	}

	/*
	 * Adds the given object to this 2D UI
	 * @param obj - the object to add
	 */
	public add(obj: Object2d): void {
		this.objects.push(obj);
	}

	/*
	 * Removes the given object from this 2D UI
	 * @param obj - the object to remove
	 */
	public remove(obj: Object2d): void {
		var index = this.objects.indexOf(obj);
		this.objects.splice(index, 1);
	}

	/*
	 * Updates the elements by ticking them
	 */
	public tick(deltaTime: number): void {
		this.objects.forEach((obj) => obj.tick(deltaTime));
	}

	/*
	 * Renders the 2D scene
	 */
	public render(ctx: CanvasRenderingContext2D): void {
		this.objects.forEach((obj) => {
			ctx.translate(obj.x, obj.y);
			obj.render(ctx);
			ctx.translate(-obj.y, -obj.y);
		});
	}

}
