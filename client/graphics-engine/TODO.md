# TODO

1) ~~Make all rendering (both 2d and 3d) use WebGL~~  
2) Make a node-based structure for defining distance functions (2d and 3d)  
	A node-based structure means that distance functions are composed of simpler individual nodes such as, circle, square, union, scale, etc.  
3) Write code to compile the node-based structure to a GLSL fragment shader  
4) Store distance functions as JSON structure of the nodes  
5) For shading/color (not the fragment or vertex shader, the actually shading/coloring of the individual distance function object) use a preset list of possible shaders (Phong, PBR, etc.) and just store the shader type and parameters for the shader (color, specular, roughness, etc.) in the JSON file with the distance function (or possibly in a separate file, I don't know yet)
