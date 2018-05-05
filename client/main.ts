import {GraphicsEngine, Scene, RenderableObject, Model, SDF, Shader} from "./graphics-engine";

declare var document;

document.addEventListener("DOMContentLoaded", () => {
	var graphics = new GraphicsEngine(document.body);

	var scene = new Scene();

	graphics.bind(scene);

	scene.add(new RenderableObject(new Model(SDF.fromJSON('{"type": "sphere", "radius": 0.1}'), Shader.fromJSON(`
		{
			"type": "lambert",
			"ambient": {
				"color": [1, 0, 0], 
				"amount": 0.2
			},
			"diffuse": {
				"color": [1, 0, 0], 
				"amount": 0.8
			}
		}`))));

	graphics.start();
});
