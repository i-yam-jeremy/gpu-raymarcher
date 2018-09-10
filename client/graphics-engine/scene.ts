import {GLManager} from "./util/gl-manager";
import {RenderableObject, Model} from "./objects";

/*
 * Stores and handles the rendering of a collection of objects
 */
export class Scene {

	/* the objects currently in the scene */
	private objects: RenderableObject[];
	/* the unique models of the objects */
	private uniqueModels: Model[];
	/* helps manage the WebGL interface */
	private glManager: GLManager;

	/*
	 * Creates an empty scene
	 */
	constructor() {
		this.objects = [];
		this.uniqueModels = [];
	}

	/*
	 * Important: to be called by GraphicsEngine only.
	 * Initializes the scene with the given WebGLRenderingContext
	 *
	 * @param gl - the WebGL2RenderingContext to be used for this scene
	 *
	 */
	public init(gl: WebGL2RenderingContext): void {
		this.glManager = new GLManager(gl);	
	}

	/*
	 * Adds the given object to this scene
	 *
	 * @param obj - the object to add to the scene
	 */
	public add(obj: RenderableObject): void {
		this.objects.push(obj);
		if (this.uniqueModels.indexOf(obj.getModel()) == -1) {
			this.uniqueModels.push(obj.getModel());
			this.glManager.updateShaders(this.uniqueModels);
		}	
	}

	/*
	 * Removes the given object from this scene
	 *
	 * @param obj - the object to remove from the scene
	 */
	public remove(obj: RenderableObject): void {
		var index = this.objects.indexOf(obj);
		if (index != -1) {
			this.objects.splice(index, 1);
			//TODO FIXME possibly remove element from uniqueModels
		}
	}

	/*
	 * Ticks this scene and all objects in it by one graphics engine tick
	 *
	 * @param deltaTime - the number of seconds to tick by
	 */
	public tick(deltaTime: number): void {
		this.objects.forEach((obj) => obj.tick(deltaTime));	
	}

	/*
	 * Renders the scene
	 * Called every frame
	 */
	public render(): void {
		this.glManager.render(this.objects, this.uniqueModels);
	}
}
