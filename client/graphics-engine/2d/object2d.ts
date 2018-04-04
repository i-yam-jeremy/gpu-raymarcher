
/*
 * An abstract class for 2D UI objects
 * All 2D UI objects must be children of this class
 */
export abstract class Object2d {

	public x: number;
	public y: number;

	/* 
	 * The default constructor for an Object2d
	 * Must be called by the child class
	 */
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	/*
	 * To be implemented in the child class
	 * Called every graphics engine tick
	 */
	public abstract tick(deltaTime: number): void;

	/*
	 * To be implemented in the child class
	 * Called every frame
	 */
	public abstract render(ctx: CanvasRenderingContext2D): void;

}
