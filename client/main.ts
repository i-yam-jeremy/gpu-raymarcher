import {GraphicsEngine, Scene, RenderableObject, Model, SDF, Shader} from "./graphics-engine";

declare var document;

document.addEventListener("DOMContentLoaded", () => {
	var graphics = new GraphicsEngine(document.body);

	var scene = new Scene();

	graphics.bind(scene);

	scene.add(new RenderableObject(new Model(SDF.fromJSON(`
	{
		"type": "simple-distortion",
		"distance": {
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
			},
			"p": {
				"type": "custom",
				"dependencies": {
					"p": {
						"type": "special-input",
						"name": "p"
					},
					"time": {
						"type": "special-input",
						"name": "u_time"
					}
				},
				"return-type": "vec3",
				"source": "return $$p$$ - vec3(sin($$time$$), cos($$time$$), 10);"
			}
		},
		"p": {
			"type": "special-input",
			"name": "p"
		},
		"magnitude": 0.05,
		"freq": 10.0
	}`
	), Shader.fromJSON(`
		{
			"type": "phong",
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
					"source": "return 0.2;// + 0.1*sin(2.0*$$time$$);"
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
					"source": "return 0.8;// + 0.4*sin(2.0*$$time$$);"
				}
			},
			"specular": 8,
			"normal": {
				"type": "special-input",
				"name": "normal"
			},
			"light-dir": {
				"type": "special-input",
				"name": "light_dir"
			},
			"view-dir": {
				"type": "custom",
				"dependencies": {},
				"return-type": "vec3",
				"source": "return normalize(u_camera_pos-p);"
			}
		}`)), (dt) => {}));

	scene.add(new RenderableObject(new Model(SDF.fromJSON(`
	{
		"type": "simple-distortion",
		"distance": {
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
			},
			"p": {
				"type": "custom",
				"dependencies": {
					"p": {
						"type": "special-input",
						"name": "p"
					},
					"time": {
						"type": "special-input",
						"name": "u_time"
					}
				},
				"return-type": "vec3",
				"source": "return $$p$$ - vec3(0, 0, 10);"
			}
		},
		"p": {
			"type": "special-input",
			"name": "p"
		},
		"magnitude": 0.05,
		"freq": 10.0
	}`
	), Shader.fromJSON(`
		{
			"type": "phong",
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
					"source": "return 0.2;// + 0.1*sin(2.0*$$time$$);"
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
					"source": "return 0.8;// + 0.4*sin(2.0*$$time$$);"
				}
			},
			"specular": 8,
			"normal": {
				"type": "special-input",
				"name": "normal"
			},
			"light-dir": {
				"type": "special-input",
				"name": "light_dir"
			},
			"view-dir": {
				"type": "custom",
				"dependencies": {},
				"return-type": "vec3",
				"source": "return normalize(u_camera_pos-p);"
			}
		}`)), (dt) => {}));

	graphics.start();
});
