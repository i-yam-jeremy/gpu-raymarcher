import {GraphicsEngine, Scene, RenderableObject, Model, SDF, Shader} from "./graphics-engine";

declare var document;

document.addEventListener("DOMContentLoaded", () => {
	var graphics = new GraphicsEngine(document.body);

	var scene = new Scene();

	graphics.bind(scene);

	scene.add(new RenderableObject(new Model(SDF.fromJSON(`
	{
		"type": "sphere",
		"radius": {
			"type": "custom",
			"dependencies": {
				"time": {
					"type": "special-input",
					"name": "u_time"
				}
			},
			"return-type": "float",
			"source": "return 0.5 + 0.2*sin(3.0*$$time$$);"
		}
	}`
	), Shader.fromJSON(`
		{
			"type": "lambert",
			"ambient": {
				"color": [1, 0, 0], 
				"amount": {
					"type": "custom",
					"dependencies": {
						"time": {
							"type": "special-input",
							"name": "u_time"
						}
					},
					"return-type": "float",
					"source": "return 0.2 + 0.1*sin(2.0*$$time$$);"
				}
			},
			"diffuse": {
				"color": [1, 0, 0], 
				"amount": {
					"type": "custom",
					"dependencies": {
						"time": {
							"type": "special-input",
							"name": "u_time"
						}
					},
					"return-type": "float",
					"source": "return 0.8 + 0.4*sin(2.0*$$time$$);"
				}
			},
			"normal": {
				"type": "special-input",
				"name": "normal"
			},
			"light_dir": {
				"type": "special-input",
				"name": "light_dir"
			}
		}`)), (dt) => {}));

	graphics.start();
});
