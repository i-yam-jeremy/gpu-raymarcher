import {GraphicsEngine, Scene} from "./graphics-engine";

declare var document;

document.addEventListener("DOMContentLoaded", () => {
	var graphics = new GraphicsEngine(document.body);

	var scene = new Scene();

	graphics.bind(scene);
	
	graphics.start();
});
