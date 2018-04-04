import {Object3d} from "./object3d";

export class Scene {

	
	private objects: Object3d[];
	//TODO

	public tick(deltaTime: number): void {
		this.objects.forEach((obj) => obj.tick(deltaTime));	
	}

	public render(gl: WebGLRenderingContext): void {
		//TODO
	}
}
