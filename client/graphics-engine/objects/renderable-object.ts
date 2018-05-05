import {Model} from "./model";

export class RenderableObject {

	//TODO
	constructor(model: Model) {
		this.model = model;
	}

	private model: Model;
	
	public tick(deltaTime: number): void {
		//TODO
	}

	public getModel(): Model {
		return this.model;
	}

}
