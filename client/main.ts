import {GraphicsEngine} from "./graphics-engine";

declare var document;

document.addEventListener("DOMContentLoaded", () => {
	var graphics = new GraphicsEngine(document.body);
	graphics.start();
	console.log(graphics);
});
