(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var dom_1 = require("./util/dom");
var ticker_1 = require("./util/ticker");
/*
 * The main class for handling the graphics engine
 */
var GraphicsEngine = /** @class */ (function () {
    /*
     * @param parentElement - the parent element of this graphics engine
     */
    function GraphicsEngine(parentElement) {
        var _this = this;
        this.dom = new dom_1.GraphicsEngineDOM(parentElement);
        this.ticker = new ticker_1.Ticker(function (deltaTime) { return _this.tick(deltaTime); }, function () { return _this.render(); });
    }
    /* starts the graphics engine */
    GraphicsEngine.prototype.start = function () {
        this.ticker.start();
    };
    /* stops the graphics engine */
    GraphicsEngine.prototype.stop = function () {
        this.ticker.stop();
    };
    /*
     * @return whether or not the graphics engine is currently running
     */
    GraphicsEngine.prototype.isRunning = function () {
        return this.ticker.isRunning();
    };
    /*
     * Starts using (rendering and ticking) the given scene
     * (overwrites the current scene if there is one bound)
     *
     * @param scene - the scene to be bound
     */
    GraphicsEngine.prototype.bind = function (scene) {
        scene.init(this.dom.gl);
        this.scene = scene;
    };
    /*
     * @return the scene currently in use
     */
    GraphicsEngine.prototype.getScene = function () {
        return this.scene;
    };
    /*
     * Called every graphics engine tick
     */
    GraphicsEngine.prototype.tick = function (deltaTime) {
        if (this.scene != undefined) {
            this.scene.tick(deltaTime);
        }
    };
    /*
     * Called every frame to render the scene (both 2d and 3d)
     */
    GraphicsEngine.prototype.render = function () {
        this.dom.canvas.setAttribute('width', window.getComputedStyle(this.dom.canvas, null).getPropertyValue('width')); // FIXME find a more efficient solution to resizing game canvases
        this.dom.canvas.setAttribute('height', window.getComputedStyle(this.dom.canvas, null).getPropertyValue('height'));
        if (this.scene != undefined) {
            this.scene.render();
        }
    };
    return GraphicsEngine;
}());
exports.GraphicsEngine = GraphicsEngine;

},{"./util/dom":26,"./util/ticker":30}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var engine_1 = require("./engine");
exports.GraphicsEngine = engine_1.GraphicsEngine;
var scene_1 = require("./scene");
exports.Scene = scene_1.Scene;
var objects_1 = require("./objects");
exports.RenderableObject = objects_1.RenderableObject;
exports.Model = objects_1.Model;
exports.SDF = objects_1.SDF;
exports.Shader = objects_1.Shader;

},{"./engine":1,"./objects":3,"./scene":25}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var renderable_object_1 = require("./renderable-object");
exports.RenderableObject = renderable_object_1.RenderableObject;
var model_1 = require("./model");
exports.Model = model_1.Model;
var sdf_1 = require("./sdf");
exports.SDF = sdf_1.SDF;
var shader_1 = require("./shader");
exports.Shader = shader_1.Shader;

},{"./model":4,"./renderable-object":5,"./sdf":12,"./shader":21}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/*
 * A 3D Model
 * (not to be confused with a RenderableObject, which is an instance of a Model with transformations and other data applied)
 */
var Model = /** @class */ (function () {
    /*
     * Creates a Model based on the given SDF and shader
     *
     * @param sdf - the SDF
     * @param shader - the shader
     */
    function Model(sdf, shader) {
        this.sdf = sdf;
        this.shader = shader;
    }
    /*
     * Converts this model to GLSL code
     *
     * @return - the set of functions needed by this model
     */
    Model.prototype.compile = function () {
        return {
            "sdf": this.sdf.compile(),
            "shade": this.shader.compile()
        };
    };
    return Model;
}());
exports.Model = Model;

},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/*
 * A 3D object
 */
var RenderableObject = /** @class */ (function () {
    /*
     * Creates a 3D object with the given model
     *
     * @param model - the model this is an instance of
     * @param tick - the tick function for this object
     */
    function RenderableObject(model, tick) {
        this.model = model;
        this.tick = tick;
    }
    /*
     * Returns the model this object is an instance of
     *
     * @return - the model
     */
    RenderableObject.prototype.getModel = function () {
        return this.model;
    };
    RenderableObject.prototype.toFloatData = function (dst, modelId, modelCount) {
        dst[0] = modelId / modelCount;
        //this.transform.toFloatData(new Float32Array(dst.buffer, Float32Array.BYTES_PER_ELEMENT, Transform.SIZE_IN_BYTES));
    };
    RenderableObject.SIZE_IN_FLOATS = 1; /*model id*/ //+ Transform.SIZE_IN_FLOATS;
    RenderableObject.SIZE_IN_BYTES = 4 * RenderableObject.SIZE_IN_FLOATS;
    return RenderableObject;
}());
exports.RenderableObject = RenderableObject;

},{}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var sdf_node_1 = require("../sdf-node");
var glsl_1 = require("../../../util/glsl");
/*
 * An SDF node that evaluates to a constant value
 */
var ConstantNode = /** @class */ (function (_super) {
    __extends(ConstantNode, _super);
    /*
     * Creates a constant node with the given value
     *
     * @param data - the value of the constant
     */
    function ConstantNode(data) {
        var _this = _super.call(this) || this;
        if (data instanceof Array && data.length < 2 || data.length > 4) {
            throw 'Error: Constant vector must have dimension between 2 and 4 inclusive';
        }
        _this.data = data;
        return _this;
    }
    /*
     * Converts this constant node into GLSL code
     *
     * @return - a function that evaluates to the constant value of this node
     *
     */
    ConstantNode.prototype.compile = function () {
        var dataType;
        var literalString;
        if (typeof this.data == 'number') {
            dataType = 'float';
            literalString = "float(" + this.data.toString() + ")";
        }
        else if (this.data instanceof Array) {
            dataType = { 2: 'vec2', 3: 'vec3', 4: 'vec4' }[this.data.length];
            literalString = dataType + "(" + this.data.join(", ") + ")";
        }
        return new glsl_1.GLSLFunction(glsl_1.GLSLFunctionType.SDF, dataType, {}, "return " + literalString + ";");
    };
    return ConstantNode;
}(sdf_node_1.SDFNode));
exports.ConstantNode = ConstantNode;

},{"../../../util/glsl":29,"../sdf-node":14}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var sdf_node_1 = require("../sdf-node");
var glsl_1 = require("../../../util/glsl");
/*
 * A SDf node with custom GLSL code as the source
 */
var Custom = /** @class */ (function (_super) {
    __extends(Custom, _super);
    /*
     * Creates a custom node with the given source, return type, and depedencies
     *
     * @param source - the GLSL source
     * @param returnType - the return type
     * @param dependencies - the dependencies / inputs
     */
    function Custom(source, returnType, dependencies) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.returnType = returnType;
        _this.dependencies = dependencies;
        return _this;
    }
    /*
     * Creates a custom node from the given node data
     *
     * @param nodeData - the node data
     *
     * Node Data Format:
     *
     * {
     * 	"type": "custom",
     * 	"depdencies": { [name] : SDFNodeData }, // maps names to SDFNodeData that will be converted to SDFNodes
     * 	"source": <string>,
     * 	"return-type": <string>
     * }
     *
     * @param - the custom node created
     */
    Custom.create = function (nodeData) {
        return new Custom(nodeData.source, nodeData['return-type'], nodeData.dependencies);
    };
    /*
     * Compile this custom node to GLSL source
     *
     * @return - a GLSL function with the source of this custom node
     */
    Custom.prototype.compile = function () {
        var compiledDependencies = {};
        for (var name_1 in this.dependencies) {
            compiledDependencies[name_1] = this.dependencies[name_1].compile();
        }
        return new glsl_1.GLSLFunction(glsl_1.GLSLFunctionType.SDF, this.returnType, compiledDependencies, this.source);
    };
    return Custom;
}(sdf_node_1.SDFNode));
exports.Custom = Custom;

},{"../../../util/glsl":29,"../sdf-node":14}],8:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var sdf_node_1 = require("../sdf-node");
var glsl_1 = require("../../../util/glsl");
/*
 * An SDF node for a plane
 */
var Plane = /** @class */ (function (_super) {
    __extends(Plane, _super);
    /*
     * Creates a plane node with the given normal
     *
     * @param normal - the normal of the plane
     * @param p - the point to calculate the distance from the surface to (the point is in localized model coordinate space)
     */
    function Plane(normal, p) {
        var _this = _super.call(this) || this;
        _this.normal = normal;
        _this.p = p;
        return _this;
    }
    /*
     * Creates a plane node from the given node data
     *
     * @param nodeData - the node data
     *
     * Node Data Format:
     *
     * {
     * 	"type": "plane",
     * 	"normal": <vec3> // must be normalized
     * 	"p": <vec3> // the point to calculate the distance from the surface to (point is in local model coordinate space)
     * }
     */
    Plane.create = function (nodeData) {
        return new Plane(nodeData.normal, nodeData.p);
    };
    /*
     * Converts this plane node to GLSL code
     *
     * @return - the SDF function
     */
    Plane.prototype.compile = function () {
        return new glsl_1.GLSLFunction(glsl_1.GLSLFunctionType.SDF, 'float', {
            "p": this.p.compile(),
            "normal": this.normal.compile()
        }, 'return dot($$p$$, $$normal$$.xyz);');
    };
    return Plane;
}(sdf_node_1.SDFNode));
exports.Plane = Plane;

},{"../../../util/glsl":29,"../sdf-node":14}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var sdf_node_1 = require("../sdf-node");
var glsl_1 = require("../../../util/glsl");
/*
 * An SDF node for distorting an SDF using a simple method
 */
var SimpleDistortion = /** @class */ (function (_super) {
    __extends(SimpleDistortion, _super);
    /*
     * Creates a distortion node
     *
     * @param distance - distance to the surface of the base object without distortion
     * @param point - the current point in the raymarching (the point used to calculate the distance)
     * @param magnitude - the magnitude of the distortion
     * @param freq - the frequency of the distortion
     */
    function SimpleDistortion(distance, point, magnitude, freq) {
        var _this = _super.call(this) || this;
        _this.distance = distance;
        _this.point = point;
        _this.magnitude = magnitude;
        _this.freq = freq;
        return _this;
    }
    /*
     * Creates a distortion node from the given node data
     *
     * @param nodeData - the node data
     *
     * Node Data Format:
     *
     * {
     * 	"type": "simple-distortion",
     * 	"distance": <number>,
     * 	"p": <vec3>,
     * 	"mangitude": <non-negative number>,
     * 	"freq": <positive number>
     * }
     */
    SimpleDistortion.create = function (nodeData) {
        return new SimpleDistortion(nodeData.distance, nodeData.p, nodeData.magnitude, nodeData.freq);
    };
    /*
     * Converts this distortion node to GLSL code
     *
     * @return - the SDF function
     */
    SimpleDistortion.prototype.compile = function () {
        return new glsl_1.GLSLFunction(glsl_1.GLSLFunctionType.SDF, 'float', {
            "distance": this.distance.compile(),
            "p": this.point.compile(),
            "magnitude": this.magnitude.compile(),
            "freq": this.freq.compile()
        }, 'return $$distance$$ + $$magnitude$$*sin($$freq$$*$$p$$.x)*sin($$freq$$*$$p$$.y)*sin($$freq$$*$$p$$.z);');
    };
    return SimpleDistortion;
}(sdf_node_1.SDFNode));
exports.SimpleDistortion = SimpleDistortion;

},{"../../../util/glsl":29,"../sdf-node":14}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var sdf_node_1 = require("../sdf-node");
var glsl_1 = require("../../../util/glsl");
/*
 * The types of the special inputs
 *
 * input name -> type
 */
var SPECIAL_NAME_TYPES = {
    "p": "vec3",
    "u_time": "float"
};
/*
 * A shader node for getting the value of special inputs (such as normal, light_dir, etc.)
 */
var SpecialInput = /** @class */ (function (_super) {
    __extends(SpecialInput, _super);
    /*
     * Creates a special input node with the given input name
     *
     * @param name - the name of the special input
     */
    function SpecialInput(name) {
        var _this = _super.call(this) || this;
        if (!(name in SPECIAL_NAME_TYPES)) {
            throw 'Invalid special input name';
        }
        _this.name = name;
        return _this;
    }
    /*
     * Creates a special input node from the given node data
     *
     * @param nodeData - the node data
     *
     * Node Data Format:
     *
     * {
     * 	"type": "special-input",
     * 	"name": <string>
     * }
     *
     * @return - a special input node
     */
    SpecialInput.create = function (nodeData) {
        return new SpecialInput(nodeData.name);
    };
    /*
     * Converts this node to GLSL code
     *
     * @return - a GLSL function that returns the value of the special input
     *
     */
    SpecialInput.prototype.compile = function () {
        return new glsl_1.GLSLFunction(glsl_1.GLSLFunctionType.SDF, SPECIAL_NAME_TYPES[this.name], {}, 'return ' + this.name + ';');
    };
    return SpecialInput;
}(sdf_node_1.SDFNode));
exports.SpecialInput = SpecialInput;

},{"../../../util/glsl":29,"../sdf-node":14}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var sdf_node_1 = require("../sdf-node");
var glsl_1 = require("../../../util/glsl");
/*
 * An SDF node for a sphere
 */
var Sphere = /** @class */ (function (_super) {
    __extends(Sphere, _super);
    /*
     * Creates a sphere node with the given radius
     *
     * @param radius - the radius of the sphere
     * @param p - the point to calculate the distance from the surface to (the point is in localized model coordinate space)
     */
    function Sphere(radius, p) {
        var _this = _super.call(this) || this;
        _this.radius = radius;
        _this.p = p;
        return _this;
    }
    /*
     * Creates a sphere node from the given node data
     *
     * @param nodeData - the node data
     *
     * Node Data Format:
     *
     * {
     * 	"type": "sphere",
     * 	"radius": <number>,
     * 	"p": <vec3> // the point to calculate the distance from the surface to (point is in local model coordinate space)
     * }
     */
    Sphere.create = function (nodeData) {
        return new Sphere(nodeData.radius, nodeData.p);
    };
    /*
     * Converts this sphere node to GLSL code
     *
     * @return - the SDF function
     */
    Sphere.prototype.compile = function () {
        return new glsl_1.GLSLFunction(glsl_1.GLSLFunctionType.SDF, 'float', {
            "p": this.p.compile(),
            "radius": this.radius.compile()
        }, 'return length($$p$$) - $$radius$$;');
    };
    return Sphere;
}(sdf_node_1.SDFNode));
exports.Sphere = Sphere;

},{"../../../util/glsl":29,"../sdf-node":14}],12:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var sdf_1 = require("./sdf");
exports.SDF = sdf_1.SDF;

},{"./sdf":15}],13:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var sdf_node_1 = require("./sdf-node");
var constant_1 = require("./basic/constant");
var sphere_1 = require("./basic/sphere");
var plane_1 = require("./basic/plane");
var special_input_1 = require("./basic/special-input");
var custom_1 = require("./basic/custom");
var simple_distortion_1 = require("./basic/simple-distortion");
/* the table mapping node names to their respective creator function */
var NODE_TABLE = {
    "sphere": sphere_1.Sphere.create,
    "special-input": special_input_1.SpecialInput.create,
    "custom": custom_1.Custom.create,
    "simple-distortion": simple_distortion_1.SimpleDistortion.create,
    "plane": plane_1.Plane.create
};
/*
 * Loads SDF node objects from JSON and node data
 */
var SDFNodeLoader = /** @class */ (function () {
    function SDFNodeLoader() {
    }
    /*
     * Converts this node data dictionary to SDF nodes where applicable.
     * It does this recursively on all fields on the node data dictionary, starting from leafs and building up from there.
     *
     * @param nodeData - the node data
     *
     * @return - an SDF node iff the root node data can be converted to an SDF node, otherwise it returns SDF node data
     * 	with the children converted to shader nodes where approriate.
     */
    SDFNodeLoader.convertDataObjectToNodeRecursively = function (nodeData) {
        for (var key in nodeData) {
            if (typeof nodeData[key] == 'object' && !(nodeData[key] instanceof Array)) {
                nodeData[key] = SDFNodeLoader.convertDataObjectToNodeRecursively(nodeData[key]);
            }
            else if (typeof nodeData[key] != 'string') {
                nodeData[key] = new constant_1.ConstantNode(nodeData[key]);
            }
        }
        if (nodeData['type'] in NODE_TABLE) {
            return NODE_TABLE[nodeData['type']](nodeData);
        }
        else {
            return nodeData;
        }
    };
    /*
     * Converts SDF node data to an SDF node
     *
     * @param nodeData - the data specifying type and additional parameters relating
     * 			to the SDF node
     *
     * @return - the created SDF node
     */
    SDFNodeLoader.fromDataObject = function (nodeData) {
        var output = SDFNodeLoader.convertDataObjectToNodeRecursively(nodeData);
        if (output instanceof sdf_node_1.SDFNode) {
            return output;
        }
        else {
            throw 'Error: nodeData does not represent a node at root level.';
        }
    };
    /*
     * Converts a JSON string to an SDF node
     *
     * @param jsonString - the JSON string containing the node data
     *
     * @return - the created SDF node
     */
    SDFNodeLoader.fromJSON = function (jsonString) {
        try {
            var nodeData = JSON.parse(jsonString);
            return SDFNodeLoader.fromDataObject(nodeData);
        }
        catch (e) {
            console.error(e);
        }
    };
    return SDFNodeLoader;
}());
exports.SDFNodeLoader = SDFNodeLoader;

},{"./basic/constant":6,"./basic/custom":7,"./basic/plane":8,"./basic/simple-distortion":9,"./basic/special-input":10,"./basic/sphere":11,"./sdf-node":14}],14:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/*
 * A node in the node-based SDF function structure
 *
 * Node-based means that instead of defining the entire SDF as one function,
 * nodes can be created, modified, and joined and then the resulting node structure
 * can be compiled into GLSL code.
 *
 * For example, a union node could be used to combine two sphere nodes, resulting in
 * two spheres in one SDF.
 */
var SDFNode = /** @class */ (function () {
    function SDFNode() {
    }
    return SDFNode;
}());
exports.SDFNode = SDFNode;

},{}],15:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var sdf_node_loader_1 = require("./sdf-node-loader");
/*
 * A signed-distance function that can be converted to GLSL code
 */
var SDF = /** @class */ (function () {
    /*
     * Creates an SDF using the given SDF as the root node
     *
     * @param node - the root node of the SDF
     */
    function SDF(node) {
        this.node = node;
    }
    /*
     * Converts a JSON string to an SDF
     *
     * @param jsonString - the JSON string containing the node-based SDF data
     */
    SDF.fromJSON = function (jsonString) {
        return new SDF(sdf_node_loader_1.SDFNodeLoader.fromJSON(jsonString));
    };
    /*
     * Converts this SDF to GLSL code
     *
     * @return - the SDF function
     */
    SDF.prototype.compile = function () {
        return this.node.compile();
    };
    return SDF;
}());
exports.SDF = SDF;

},{"./sdf-node-loader":13}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var shader_node_1 = require("../shader-node");
var glsl_1 = require("../../../util/glsl");
/*
 * A shader node that evaluates to a constant value
 */
var ConstantNode = /** @class */ (function (_super) {
    __extends(ConstantNode, _super);
    /*
     * Creates a constant node with the given value
     *
     * @param data - the value of the constant
     */
    function ConstantNode(data) {
        var _this = _super.call(this) || this;
        if (data instanceof Array && data.length < 2 || data.length > 4) {
            throw 'Error: Constant vector must have dimension between 2 and 4 inclusive';
        }
        _this.data = data;
        return _this;
    }
    /*
     * Converts this constant node into GLSL code
     *
     * @return - a function that evaluates to the constant value of this node
     *
     */
    ConstantNode.prototype.compile = function () {
        var dataType;
        var literalString;
        if (typeof this.data == 'number') {
            dataType = 'float';
            literalString = "float(" + this.data.toString() + ")";
        }
        else if (this.data instanceof Array) {
            dataType = { 2: 'vec2', 3: 'vec3', 4: 'vec4' }[this.data.length];
            literalString = dataType + "(" + this.data.join(", ") + ")";
        }
        return new glsl_1.GLSLFunction(glsl_1.GLSLFunctionType.SHADER, dataType, {}, "return " + literalString + ";");
    };
    return ConstantNode;
}(shader_node_1.ShaderNode));
exports.ConstantNode = ConstantNode;

},{"../../../util/glsl":29,"../shader-node":23}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var shader_node_1 = require("../shader-node");
var glsl_1 = require("../../../util/glsl");
/*
 * A SDf node with custom GLSL code as the source
 */
var Custom = /** @class */ (function (_super) {
    __extends(Custom, _super);
    /*
     * Creates a custom node with the given source, return type, and depedencies
     *
     * @param source - the GLSL source
     * @param returnType - the return type
     * @param dependencies - the dependencies / inputs
     */
    function Custom(source, returnType, dependencies) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.returnType = returnType;
        _this.dependencies = dependencies;
        return _this;
    }
    /*
     * Creates a custom node from the given node data
     *
     * @param nodeData - the node data
     *
     * Node Data Format:
     *
     * {
     * 	"type": "custom",
     * 	"depdencies": { [name] : ShaderNodeData }, // maps names to ShaderNodeData that will be converted to ShaderNodes
     * 	"source": <string>,
     * 	"return-type": <string>
     * }
     *
     * @param - the custom node created
     */
    Custom.create = function (nodeData) {
        return new Custom(nodeData.source, nodeData['return-type'], nodeData.dependencies);
    };
    /*
     * Compile this custom node to GLSL source
     *
     * @return - a GLSL function with the source of this custom node
     */
    Custom.prototype.compile = function () {
        var compiledDependencies = {};
        for (var name_1 in this.dependencies) {
            compiledDependencies[name_1] = this.dependencies[name_1].compile();
        }
        return new glsl_1.GLSLFunction(glsl_1.GLSLFunctionType.SHADER, this.returnType, compiledDependencies, this.source);
    };
    return Custom;
}(shader_node_1.ShaderNode));
exports.Custom = Custom;

},{"../../../util/glsl":29,"../shader-node":23}],18:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var shader_node_1 = require("../shader-node");
var glsl_1 = require("../../../util/glsl");
/*
 * Shader for Lambertian reflectance
 * Shading has a ambient and diffuse component
 */
var Lambert = /** @class */ (function (_super) {
    __extends(Lambert, _super);
    /*
     * Creates a Lambert shader with the specified fields
     *
     * @param ambientAmount - the amount of ambient reflectance
     * @param ambientColor - the color of ambient reflectance
     * @param diffuseAmount - the color of diffuse reflectance
     * @param diffuseColor - the color of diffuse reflectance
     * @param normal - the surface normal of the model at the point to be shaded
     * @param light_dir - the incoming light direction
     *
     */
    function Lambert(ambientAmount, ambientColor, diffuseAmount, diffuseColor, normal, lightDir) {
        var _this = _super.call(this) || this;
        _this.ambientAmount = ambientAmount;
        _this.ambientColor = ambientColor;
        _this.diffuseAmount = diffuseAmount;
        _this.diffuseColor = diffuseColor;
        _this.normal = normal;
        _this.lightDir = lightDir;
        return _this;
    }
    /*
     * Creates a Lambert shader from the specified node data
     *
     * @param nodeData - the node data
     *
     * Node Data Format:
     * {
     * 	"type": "lambert",
     * 	"ambient": {
     *		"amount": <number>,
     *		"color": <vec3>
     * 	},
     * 	"diffuse": {
     *		"amount": <number>,
     *		"color": <vec3>
     * 	},
     * 	"normal": <vec3>,
     * 	"light_dir": <vec3>
     * }
     *
     * @return - a Lambert shader
     */
    Lambert.create = function (nodeData) {
        return new Lambert(nodeData.ambient.amount, nodeData.ambient.color, nodeData.diffuse.amount, nodeData.diffuse.color, nodeData.normal, nodeData.light_dir);
    };
    /*
     * Converts this shader into GLSL code
     *
     * @return - the GLSLFunctionSet specifying the shade function for this shader
     */
    Lambert.prototype.compile = function () {
        return new glsl_1.GLSLFunction(glsl_1.GLSLFunctionType.SHADER, 'vec3', {
            "ambient_amount": this.ambientAmount.compile(),
            "ambient_color": this.ambientColor.compile(),
            "diffuse_amount": this.diffuseAmount.compile(),
            "diffuse_color": this.diffuseColor.compile(),
            "normal": this.normal.compile(),
            "light_dir": this.lightDir.compile()
        }, "\n\t\t\t\tfloat ambient_amount = float($$ambient_amount$$);\n\t\t\t\tvec3 ambient_color = $$ambient_color$$;\n\t\t\t\tfloat diffuse_amount = float($$diffuse_amount$$);\n\t\t\t\tvec3 diffuse_color = $$diffuse_color$$;\n\t\t\t\treturn ambient_amount*ambient_color + diffuse_amount*diffuse_color*max(0.0, dot($$normal$$, -$$light_dir$$));\n\t\t");
    };
    return Lambert;
}(shader_node_1.ShaderNode));
exports.Lambert = Lambert;

},{"../../../util/glsl":29,"../shader-node":23}],19:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var shader_node_1 = require("../shader-node");
var glsl_1 = require("../../../util/glsl");
/*
 * Shader for Phong reflectance
 * Shading has a ambient, diffuse, and specular component
 */
var Phong = /** @class */ (function (_super) {
    __extends(Phong, _super);
    /*
     * Creates a Lambert shader with the specified fields
     *
     * @param ambientAmount - the amount of ambient reflectance
     * @param ambientColor - the color of ambient reflectance
     * @param diffuseAmount - the color of diffuse reflectance
     * @param diffuseColor - the color of diffuse reflectance
     * @param normal - the surface normal of the model at the point to be shaded
     * @param lightDir - the incoming light direction
     * @param viewDir - the view direction from the camera
     */
    function Phong(ambientAmount, ambientColor, diffuseAmount, diffuseColor, specularPower, normal, lightDir, viewDir) {
        var _this = _super.call(this) || this;
        _this.ambientAmount = ambientAmount;
        _this.ambientColor = ambientColor;
        _this.diffuseAmount = diffuseAmount;
        _this.diffuseColor = diffuseColor;
        _this.specularPower = specularPower;
        _this.normal = normal;
        _this.lightDir = lightDir;
        _this.viewDir = viewDir;
        return _this;
    }
    /*
     * Creates a Phong shader from the specified node data
     *
     * @param nodeData - the node data
     *
     * Node Data Format:
     * {
     * 	"type": "phong",
     * 	"ambient": {
     *		"amount": <number>,
     *		"color": <vec3>
     * 	},
     * 	"diffuse": {
     *		"amount": <number>,
     *		"color": <vec3>
     * 	},
     * 	"specular": <number>,
     * 	"normal": <vec3>,
     * 	"light-dir": <vec3>,
     * 	"view-dir": <vec3>
     * }
     *
     * @return - a Phong shader
     */
    Phong.create = function (nodeData) {
        return new Phong(nodeData.ambient.amount, nodeData.ambient.color, nodeData.diffuse.amount, nodeData.diffuse.color, nodeData.specular, nodeData.normal, nodeData['light-dir'], nodeData['view-dir']);
    };
    /*
     * Converts this shader into GLSL code
     *
     * @return - the GLSLFunctionSet specifying the shade function for this shader
     */
    Phong.prototype.compile = function () {
        return new glsl_1.GLSLFunction(glsl_1.GLSLFunctionType.SHADER, 'vec3', {
            "ambient_amount": this.ambientAmount.compile(),
            "ambient_color": this.ambientColor.compile(),
            "diffuse_amount": this.diffuseAmount.compile(),
            "diffuse_color": this.diffuseColor.compile(),
            "specular": this.specularPower.compile(),
            "normal": this.normal.compile(),
            "light_dir": this.lightDir.compile(),
            "view_dir": this.viewDir.compile()
        }, "\n\t\t\t\tvec3 ambient = $$ambient_amount$$*$$ambient_color$$;\n\t\t\t\tvec3 diffuse = $$diffuse_amount$$*$$diffuse_color$$*max(0.0, dot($$normal$$, -$$light_dir$$));\n\t\t\t\tvec3 specular = dot($$normal$$, $$light_dir$$) < 0.0 ?\n\t\t\t\t\t/*TODO $$light_color*/vec3(1)*pow(\n\t\t\t\t\t\tmax(0.0, dot(reflect(-$$light_dir$$, $$normal$$), $$view_dir$$)),\n\t\t\t\t\t\t$$specular$$\n\t\t\t\t\t):\n\t\t\t\t\tvec3(0);\n\t\t\t\treturn ambient + diffuse + specular;\n\t\t");
    };
    return Phong;
}(shader_node_1.ShaderNode));
exports.Phong = Phong;

},{"../../../util/glsl":29,"../shader-node":23}],20:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var shader_node_1 = require("../shader-node");
var glsl_1 = require("../../../util/glsl");
/*
 * The types of the special inputs
 *
 * input name -> type
 */
var SPECIAL_NAME_TYPES = {
    "p": "vec3",
    "light_dir": "vec3",
    "normal": "vec3",
    "u_time": "float"
};
/*
 * A shader node for getting the value of special inputs (such as normal, light_dir, etc.)
 */
var SpecialInput = /** @class */ (function (_super) {
    __extends(SpecialInput, _super);
    /*
     * Creates a special input node with the given input name
     *
     * @param name - the name of the special input
     */
    function SpecialInput(name) {
        var _this = _super.call(this) || this;
        if (!(name in SPECIAL_NAME_TYPES)) {
            throw 'Invalid special input name';
        }
        _this.name = name;
        return _this;
    }
    /*
     * Creates a special input node from the given node data
     *
     * @param nodeData - the node data
     *
     * Node Data Format:
     *
     * {
     * 	"type": "special-input",
     * 	"name": <string>
     * }
     *
     * @return - a special input node
     */
    SpecialInput.create = function (nodeData) {
        return new SpecialInput(nodeData.name);
    };
    /*
     * Converts this node to GLSL code
     *
     * @return - a GLSL function that returns the value of the special input
     *
     */
    SpecialInput.prototype.compile = function () {
        return new glsl_1.GLSLFunction(glsl_1.GLSLFunctionType.SHADER, SPECIAL_NAME_TYPES[this.name], {}, 'return ' + this.name + ';');
    };
    return SpecialInput;
}(shader_node_1.ShaderNode));
exports.SpecialInput = SpecialInput;

},{"../../../util/glsl":29,"../shader-node":23}],21:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var shader_1 = require("./shader");
exports.Shader = shader_1.Shader;

},{"./shader":24}],22:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var shader_node_1 = require("./shader-node");
var constant_1 = require("./basic/constant");
var lambert_1 = require("./basic/lambert");
var phong_1 = require("./basic/phong");
var special_input_1 = require("./basic/special-input");
var custom_1 = require("./basic/custom");
/* the table mapping node names to their respective creator function */
var NODE_TABLE = {
    "lambert": lambert_1.Lambert.create,
    "phong": phong_1.Phong.create,
    "special-input": special_input_1.SpecialInput.create,
    "custom": custom_1.Custom.create
};
/*
 * Loads shader node objects from JSON and node data
 */
var ShaderNodeLoader = /** @class */ (function () {
    function ShaderNodeLoader() {
    }
    /*
     * Converts this node data dictionary to shader nodes where applicable.
     * It does this recursively on all fields on the node data dictionary, starting from leafs and building up from there.
     *
     * @param nodeData - the node data
     *
     * @return - a shader node iff the root node data can be converted to a shader node, otherwise it returns shader node data
     * 	with the children converted to shader nodes where approriate.
     */
    ShaderNodeLoader.convertDataObjectToNodeRecursively = function (nodeData) {
        for (var key in nodeData) {
            if (typeof nodeData[key] == 'object' && !(nodeData[key] instanceof Array)) {
                nodeData[key] = ShaderNodeLoader.convertDataObjectToNodeRecursively(nodeData[key]);
            }
            else if (typeof nodeData[key] != 'string') {
                nodeData[key] = new constant_1.ConstantNode(nodeData[key]);
            }
        }
        if (nodeData['type'] in NODE_TABLE) {
            return NODE_TABLE[nodeData['type']](nodeData);
        }
        else {
            return nodeData;
        }
    };
    /*
     * Converts shader node data to a shader node
     *
     * @param nodeData - the data specifying type and addition paremeters relating
     * 			to the shader node
     *
     * @return - the created shader node
     */
    ShaderNodeLoader.fromDataObject = function (nodeData) {
        var output = ShaderNodeLoader.convertDataObjectToNodeRecursively(nodeData);
        if (output instanceof shader_node_1.ShaderNode) {
            return output;
        }
        else {
            throw 'Error: nodeData does not represent a node at root level.';
        }
    };
    /*
     * Converts a JSON string to a shader node
     *
     * @param jsonString - the JSON string containing the node data
     *
     * @return - the created shader node
     */
    ShaderNodeLoader.fromJSON = function (jsonString) {
        try {
            var nodeData = JSON.parse(jsonString);
            return ShaderNodeLoader.fromDataObject(nodeData);
        }
        catch (e) {
            console.error(e);
        }
    };
    return ShaderNodeLoader;
}());
exports.ShaderNodeLoader = ShaderNodeLoader;

},{"./basic/constant":16,"./basic/custom":17,"./basic/lambert":18,"./basic/phong":19,"./basic/special-input":20,"./shader-node":23}],23:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/*
 * A node in the node-based shader function structure
 *
 * Node-based means that instead of defining the entire model shader as one function,
 * nodes can be created, modified, and joined and then the resulting node structure
 * can be compiled into GLSL code.
 *
 */
var ShaderNode = /** @class */ (function () {
    function ShaderNode() {
    }
    return ShaderNode;
}());
exports.ShaderNode = ShaderNode;

},{}],24:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var shader_node_loader_1 = require("./shader-node-loader");
/*
 * A shader for a specific model.
 * (Note: not to be confused with a GLSL vertex or fragment shader,
 * 	this shades a specific model and computes the color of the object
 * 	based on lighting, position, etc.)
 */
var Shader = /** @class */ (function () {
    /*
     * Creates a shader with the given node as the root node
     *
     * @param - the root node
     */
    function Shader(node) {
        this.node = node;
    }
    /*
     * Converts the given JSON string into a shader object
     *
     * @param jsonString - the JSON string specifying the shader data
     */
    Shader.fromJSON = function (jsonString) {
        return new Shader(shader_node_loader_1.ShaderNodeLoader.fromJSON(jsonString));
    };
    /*
     * Converts this shader into GLSL code
     *
     * @return - this shader function
     */
    Shader.prototype.compile = function () {
        return this.node.compile();
    };
    return Shader;
}());
exports.Shader = Shader;

},{"./shader-node-loader":22}],25:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var gl_manager_1 = require("./util/gl-manager");
/*
 * Stores and handles the rendering of a collection of objects
 */
var Scene = /** @class */ (function () {
    /*
     * Creates an empty scene
     */
    function Scene() {
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
    Scene.prototype.init = function (gl) {
        this.glManager = new gl_manager_1.GLManager(gl);
    };
    /*
     * Adds the given object to this scene
     *
     * @param obj - the object to add to the scene
     */
    Scene.prototype.add = function (obj) {
        this.objects.push(obj);
        if (this.uniqueModels.indexOf(obj.getModel()) == -1) {
            this.uniqueModels.push(obj.getModel());
            this.glManager.updateShaders(this.uniqueModels);
        }
    };
    /*
     * Removes the given object from this scene
     *
     * @param obj - the object to remove from the scene
     */
    Scene.prototype.remove = function (obj) {
        var index = this.objects.indexOf(obj);
        if (index != -1) {
            this.objects.splice(index, 1);
            //TODO FIXME possibly remove element from uniqueModels
        }
    };
    /*
     * Ticks this scene and all objects in it by one graphics engine tick
     *
     * @param deltaTime - the number of seconds to tick by
     */
    Scene.prototype.tick = function (deltaTime) {
        this.objects.forEach(function (obj) { return obj.tick(deltaTime); });
    };
    /*
     * Renders the scene
     * Called every frame
     */
    Scene.prototype.render = function () {
        this.glManager.render(this.objects, this.uniqueModels);
    };
    return Scene;
}());
exports.Scene = Scene;

},{"./util/gl-manager":28}],26:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/*
 * Creates a canvas element
 *
 * @param parentElement - the parent element of the canvas element created
 * @param canvasType - the type of canvas
 * @return the canvas created
 */
function createCanvas(parentElement) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('class', 'rayle-canvas');
    parentElement.appendChild(canvas);
    return canvas;
}
/*
 * A container that initializes all DOM elements needed by the graphics engine
 */
var GraphicsEngineDOM = /** @class */ (function () {
    /*
     * @param parentElement - the element to contain the graphics engine (all DOM elements created will be children, grand-children, etc. of this element)
     */
    function GraphicsEngineDOM(parentElement) {
        this.canvas = createCanvas(parentElement);
        this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('experimental-webgl2');
    }
    return GraphicsEngineDOM;
}());
exports.GraphicsEngineDOM = GraphicsEngineDOM;

},{}],27:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/*
 * The template for the fragment shader source. It contains syntactic sugar and
 * parameters that will be replaced.
 */
exports.FRAGMENT_SHADER_SOURCE_TEMPLATE = "#version 300 es\nprecision highp float;\n\nlayout(location = 0) out vec4 main_image_color;\nlayout(location = 1) out vec4 depth_output;\n\n/*\n * Terms Used In This File\n *\n * Model (model base) - the basic model SDF with no transformation applied\n * Object - an instance of a model with transformations applied\n * \t(there can be multiple objects that are instances of the same model)\n *\n */\n\n\n/*\n * The time in seconds\n * (the offset of this time is not important because\n *  it is used for animations which only need to use the\n *  time modulo the animation time)\n */\nuniform float u_time;\n/* the position of the camera */\nuniform vec3 u_camera_pos;\n/* the screen width and height */\nuniform vec2 u_resolution;\n/* the object data texture */\nuniform sampler2D u_object_data;\n/* object data texture side length in pixels */\nuniform int u_object_data_side_length;\n/* the number of objects in the scene */\nuniform int u_object_count;\n\n\n/* \n * used for when the max number of raymarching steps is reached\n * before hitting an object\n */\n#define NO_OBJECT_FOUND (-1)\n\n/*\n * Identifying IDs for objects\n */\nstruct ObjectID {\n\tint modelId;  // the id of the model this object is an instance of\n\tint objectId; // the unique identifier for this object\n};\n\n/*\n * A 3D Ray\n */\nstruct Ray {\n\tvec3 o; // origin\n\tvec3 d; // direction\n};\n\n/*\n * Distance to a given object\n */\nstruct Distance {\n\tObjectID id; // object id\n\tfloat d; // distance\n};\n\n/*\n * Intersection between ray and the surface of an object\n */\nstruct Intersection {\n\tObjectID id; // object id\n\tvec3 p; // intersection point\n};\n\n/*\n * Returns the Distance struct with the smaller (more-negative, not magnitude) distance\n *\n * @param a - the first Distance\n * @param b - the second Distance\n *\n * @return - the smaller of a and b\n */\nDistance min_d(Distance a, Distance b) {\n\tif (a.d < b.d) {\n\t\treturn a;\n\t}\n\telse {\n\t\treturn b;\n\t}\n}\n\n%%model_source%%\n\n/*\n * Returns the distance to the given model base from the given point\n * (By model base I mean the model without any instance-specific transformations\n *  applied. All transformations are applied to p before this function is called)\n *\n * @param id - the model id\n * @param p - the point\n *\n * @return - the shortest distance to the surface of specified model base\n */\nfloat scene_sdf(int modelId, vec3 p) {\n\t%%scene_sdf_branching_code%%\n\treturn -1.0; // Invalid modelId\n}\n\n/*\n * Calculates the normal of the model base at the given point\n * (By model base I mean the model without any instance-specific transformations\n *  applied. All transformations are applied to p before this function is called)\n *\n * @param id - the model id\n * @param p - the point\n *\n * @return - the normal\n */\nvec3 calc_normal(int modelId, vec3 p) {\n\tfloat h = 0.001;\n\tfloat d = scene_sdf(modelId, p);\n\treturn normalize(vec3(\n\t\t\t(d - scene_sdf(modelId, p+vec3(h, 0, 0))) / h,\n\t\t\t(d - scene_sdf(modelId, p+vec3(0, h, 0))) / h,\n\t\t\t(d - scene_sdf(modelId, p+vec3(0, 0, h))) / h\n\t\t));\n}\n\nint imod(int n, int m) {\n\treturn n - m*(n/m);\n}\n\n/*\n * Raymarches along the given ray, starting at the rays origin until it\n * intersects with an object or it reaches the max number of raymarching steps\n *\n * @param r - the ray to march along\n *\n * @return - the intersection between the ray and the hit object's surface\n * \t(intersection has objectId NO_OBJECT_FOUND when the no object was hit\n * \t before reaching the max number of marching steps)\n */\nIntersection march(Ray r) {\n\tvec3 p = r.o;\n\tfor (int i = 0; i < %%max_marching_steps%%; i++) {\n\t\tDistance d = Distance(ObjectID(-1, -1), 10e20);\n\t\tfor (int obj = 0; obj < 100000; obj++) {\n\t\t\tif (!(obj < u_object_count)) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t\tvec4 data = texture(u_object_data, vec2(imod(obj/4, u_object_data_side_length), obj/4 / u_object_data_side_length) / float(u_object_data_side_length));\n\t\t\tfloat value;\n\t\t\tint channel = imod(obj, 4);\n\t\t\tvec4 tmp = data.rgba * vec4(channel == 0, channel == 1, channel == 2, channel == 3);\n\t\t\tvalue = tmp.r + tmp.g + tmp.b + tmp.a;\n\t\t\t/*if (channel == 0)\n\t\t\t\tvalue = data.r;\n\t\t\telse if (channel == 1)\n\t\t\t\tvalue = data.g;\n\t\t\telse if (channel == 2)\n\t\t\t\tvalue = data.b;\n\t\t\telse if (channel == 3)\n\t\t\t\tvalue = data.a;*/\n\t\t\tint modelId = int(value*float(%%model_count%%));\n\t\t\td = min_d(d, Distance(ObjectID(modelId, obj), scene_sdf(modelId, p)));\n\t\t}\n\t\t\n\t\tif (d.d < %%epsilon%%) {\n\t\t\treturn Intersection(d.id, p);\n\t\t}\n\t\t\n\t\tp += r.d*d.d;\n\t\tif (length(p - r.o) > float(%%max_render_distance%%)) {\n\t\t\tbreak;\n\t\t}\n\t}\n\treturn Intersection(ObjectID(-1, NO_OBJECT_FOUND), vec3(0));\n}\n\n/*\n * Calculates the shading of the specified object for a specified light. Calls the shader\n * function of the model base\n * (By model base I mean the model without any instance-specific transformations\n *  applied. All transformations are applied to p before this function is called)\n *\n *  @param modelId - the model id\n *  @param p - the point on the surface of the model\n *  @param normal - the normal vector of the model surface at the given point p\n *  @param light_dir - the light\n *\n *  @return - the color of the shading of the model at the given point\n */\nvec3 shade(int modelId, vec3 p, vec3 normal, vec3 light_dir) {\n\t%%model_shader_branching_code%%\n\treturn vec3(1, 0, 1); // Invalid id specified \n}\n\n/*\n * The shader main function. Raymarches, finds the intersection point, and shades the object\n */\nvoid main() {\n\tvec3 camera_pos = u_camera_pos + vec3(0, 0, -3.0);\n\tvec2 uv = (2.0*gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;\n\t\n\tRay r = Ray(camera_pos, normalize(vec3(uv, 0) - camera_pos));\n\tIntersection i = march(r);\n\tif (i.id.objectId == NO_OBJECT_FOUND) {\n\t\tmain_image_color = vec4(0, 0, 0, 1);\n\t}\n\telse {\n\t\tvec3 light_pos = vec3(0, 0, -2);\n\t\tvec3 light_dir = normalize(light_pos - i.p);\n\t\tvec3 normal = calc_normal(i.id.modelId, i.p);\n\t\tvec3 c = shade(i.id.modelId, i.p, normal, light_dir);\n\t\tmain_image_color = vec4(c, 1);\n\t}\n}\n";

},{}],28:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var objects_1 = require("../objects");
var glsl_1 = require("./glsl");
/*
 * Thrown when a GLSL shader could not be compiled
 */
var ShaderCompilationError = /** @class */ (function (_super) {
    __extends(ShaderCompilationError, _super);
    /*
     * @param shaderType - the type of the shader (either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
     * @param message - the error message
     */
    function ShaderCompilationError(shaderType, message) {
        var _this = _super.call(this, message) || this;
        _this.name = "ShaderCompilationException";
        return _this;
    }
    return ShaderCompilationError;
}(Error));
/*
 * Rounds the given number up to the nearest power of two
 *
 * @param n - the number to round
 *
 * @return n rounded up to the nearest power of two
 */
function roundUpToNearestPowerOfTwo(n) {
    return Math.pow(2, Math.ceil(Math.log(n) / Math.LN2));
}
/* the key in the render targets dictionary for the main image render target texture */
var MAIN_IMAGE_RENDER_TARGET = 0;
/* the key in the render targets dictionary for the depth render target texture */
var DEPTH_RENDER_TARGET = 1;
/*
 * Helps encapsulate WebGL functionality so other code doesn't have to deal with
 * the complexities of WebGL and the other code only has to deal with models, objects, and scenes
 * Handles shaders, rendering, etc.
 */
var GLManager = /** @class */ (function () {
    /*
     * @param gl - manages the given WebGL2RenderingContext
     */
    function GLManager(gl) {
        /* the current program */
        this.program = null;
        /* the current vertex shader */
        this.vertexShader = null;
        /* the current fragment shader */
        this.fragmentShader = null;
        this.gl = gl;
        this.updateRenderTargets();
        this.initPostProcess();
        this.updateShaders([]);
        this.vertexBuffer = this.createVertexBuffer();
        this.time = 0;
        this.lastFrameTime = Date.now();
        this.objectDataTexture = gl.createTexture();
        this.updateObjectData([], []);
    }
    /*
     * Updates a texture (deletes the previous texture and returns a new one with changed dimensions)
     *
     * @param oldTexutre - the old texture to delete
     * @param width - the new texture width
     * @param height - the new texture height
     *
     * @return the new texture
     */
    GLManager.prototype.updateTexture = function (oldTexture, width, height) {
        var gl = this.gl;
        width = roundUpToNearestPowerOfTwo(width);
        height = roundUpToNearestPowerOfTwo(height);
        gl.deleteTexture(oldTexture);
        var newTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, newTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4 * width * height));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        return newTexture;
    };
    /*
     * Updates the render target textures and framebuffer
     * (initializes them if needed)
     */
    GLManager.prototype.updateRenderTargets = function () {
        var gl = this.gl;
        this.renderTargets = this.renderTargets || {};
        this.renderTargets[MAIN_IMAGE_RENDER_TARGET] = this.updateTexture(this.renderTargets[MAIN_IMAGE_RENDER_TARGET], gl.canvas.width, gl.canvas.height);
        this.renderTargets[DEPTH_RENDER_TARGET] = this.updateTexture(this.renderTargets[DEPTH_RENDER_TARGET], gl.canvas.width, gl.canvas.height);
        this.framebuffer = this.framebuffer || gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.renderTargets[MAIN_IMAGE_RENDER_TARGET], 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.renderTargets[DEPTH_RENDER_TARGET], 0);
    };
    /*
     * Updates the data to be passed to the GPU/fragment shader that is stored in textures
     * (objects data such as transformation matrix, etc.)
     *
     * @param objects - the objects to put into the texture
     * @param uniqueModels - the models used by the objects with no duplicates
     */
    GLManager.prototype.updateObjectData = function (objects, uniqueModels) {
        var gl = this.gl;
        //TODO may need to delete and recreate texture if it cannot be resized. But if it CAN be resized with texImage2D just do that instead
        // BASED ON THE TEST BELOW IT LOOKS LIKE YOU CAN REUSE TEXTURES SO I WON'T NEED TO DELETE THEM (once the data packing on CPU and unpacking on GPU is implemented I will test to make sure it still works for resizing)
        var dataSize = objects.length * objects_1.RenderableObject.SIZE_IN_FLOATS;
        var sideLength = Math.pow(2, Math.ceil(Math.log(Math.sqrt(dataSize / 4)) / Math.LOG2E));
        var buffer = new Float32Array(4 * sideLength * sideLength);
        gl.uniform1i(this.uObjectDataSideLength, sideLength);
        gl.uniform1i(this.uObjectCount, objects.length);
        for (var i = 0; i < objects.length; i++) {
            var dst = new Float32Array(buffer.buffer, i * objects_1.RenderableObject.SIZE_IN_BYTES, objects_1.RenderableObject.SIZE_IN_FLOATS);
            objects[i].toFloatData(dst, uniqueModels.indexOf(objects[i].getModel()), uniqueModels.length);
        }
        gl.deleteTexture(this.objectDataTexture);
        this.objectDataTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.objectDataTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, sideLength, sideLength, 0, gl.RGBA, gl.FLOAT, buffer);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.uniform1i(this.uObjectData, 0);
        //gl.bindTexture(gl.TEXTURE_2D, null);
    };
    /*
     * Updates the source and recompiles the shaders based on the given models
     *
     * @param models - the models to incorporate into the shader (all objects used with these new shaders must be an instance of one of the models)
     */
    GLManager.prototype.updateShaders = function (models) {
        var gl = this.gl;
        if (this.program) {
            gl.deleteProgram(this.program);
        }
        if (this.vertexShader) {
            gl.deleteShader(this.vertexShader);
        }
        if (this.fragmentShader) {
            gl.deleteShader(this.fragmentShader);
        }
        this.program = gl.createProgram();
        this.vertexShader = this.createShader(gl.VERTEX_SHADER, glsl_1.VERTEX_SHADER_SOURCE);
        this.fragmentShader = this.createShader(gl.FRAGMENT_SHADER, glsl_1.generateFragmentShaderSource(models));
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);
        var linkedSuccessfully = gl.getProgramParameter(this.program, gl.LINK_STATUS);
        if (!linkedSuccessfully) {
            alert("Couldn't link WebGLProgram");
            console.error(gl.getProgramInfoLog(this.program));
        }
        this.vertexAttrib = gl.getAttribLocation(this.program, "pos");
        gl.enableVertexAttribArray(this.vertexAttrib);
        this.setUniformLocations(this.program);
    };
    /*
     * Sets the uniform location fields of this object to the uniform locations in the given GLProgram
     *
     * @param program - the current program
     */
    GLManager.prototype.setUniformLocations = function (program) {
        var gl = this.gl;
        this.uTime = gl.getUniformLocation(program, "u_time");
        this.uCameraPos = gl.getUniformLocation(program, "u_camera_pos");
        this.uResolution = gl.getUniformLocation(program, "u_resolution");
        this.uObjectData = gl.getUniformLocation(program, "u_object_data");
        this.uObjectDataSideLength = gl.getUniformLocation(program, "u_object_data_side_length");
        this.uObjectCount = gl.getUniformLocation(program, "u_object_count");
    };
    /*
     * Sets uniforms to the correct values
     * Called once per frame
     */
    GLManager.prototype.setUniforms = function () {
        var gl = this.gl;
        gl.uniform3fv(this.uCameraPos, [0, 0, 0]);
        gl.uniform1f(this.uTime, this.time);
        gl.uniform2f(this.uResolution, gl.canvas.width, gl.canvas.height); //FIXME make this more efficient because DOM is slow
    };
    /*
     * Render one frame using the fragment shader
     *
     * @param objects - the objects to render
     * @param uniqueModels - the models used by the objects with no duplicates
     */
    GLManager.prototype.render = function (objects, uniqueModels) {
        this.time += (Date.now() - this.lastFrameTime) / 1000;
        this.lastFrameTime = Date.now();
        var gl = this.gl;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // TODO make this more efficient by not using gl.canvas to get width and height
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.updateRenderTargets();
        gl.useProgram(this.program);
        this.updateObjectData(objects, uniqueModels);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.vertexAttrib, 2, gl.FLOAT, false, 0, 0);
        this.setUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.drawBuffers([
            gl.COLOR_ATTACHMENT0,
            gl.COLOR_ATTACHMENT1
        ]);
        this.doPostProcess();
    };
    GLManager.prototype.initPostProcess = function () {
        var gl = this.gl;
        this.postProcessProgram = gl.createProgram();
        this.postProcessVertexShader = this.createShader(gl.VERTEX_SHADER, glsl_1.VERTEX_SHADER_SOURCE);
        this.postProcessFragmentShader = this.createShader(gl.FRAGMENT_SHADER, "\n\t\t\t#version 300 es\n\t\t\tprecision highp float;\n\n\t\t\tlayout(location = 0) out vec4 color_out;\n\n\t\t\tuniform sampler2D u_main_image;\n\t\t\tuniform vec2 u_resolution;\n\n\t\t\tvoid main() {\n\t\t\t\tvec2 uv = (gl_FragCoord.xy) / u_resolution.xy;\n\t\t\t\tcolor_out = texture(u_main_image, uv);\n\t\t\t}\n\t\t".trim());
        gl.attachShader(this.postProcessProgram, this.postProcessVertexShader);
        gl.attachShader(this.postProcessProgram, this.postProcessFragmentShader);
        gl.linkProgram(this.postProcessProgram);
        var linkedSuccessfully = gl.getProgramParameter(this.postProcessProgram, gl.LINK_STATUS);
        if (!linkedSuccessfully) {
            alert("Couldn't link WebGLProgram");
            console.error(gl.getProgramInfoLog(this.postProcessProgram));
        }
        this.postProcessVertexAttrib = gl.getAttribLocation(this.postProcessProgram, "pos");
        gl.enableVertexAttribArray(this.postProcessVertexAttrib);
        this.postProcessUniforms = {};
        this.postProcessUniforms.uMainImage = gl.getUniformLocation(this.postProcessProgram, "u_main_image");
        this.postProcessUniforms.uResolution = gl.getUniformLocation(this.postProcessProgram, "u_resolution");
    };
    GLManager.prototype.doPostProcess = function () {
        var gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.useProgram(this.postProcessProgram);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.renderTargets[MAIN_IMAGE_RENDER_TARGET]);
        gl.uniform1i(this.postProcessUniforms.uMainImage, 0);
        gl.uniform2f(this.postProcessUniforms.uResolution, roundUpToNearestPowerOfTwo(gl.canvas.width), roundUpToNearestPowerOfTwo(gl.canvas.height));
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.postProcessVertexAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    /*
     * Creates a WebGL shader of the given type with the given source
     *
     * @param shaderType - the type of shader (either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
     * @param source - the source of the shader
     * @return the compiled shader
     * @throws ShaderCompilationError
     */
    GLManager.prototype.createShader = function (shaderType, source) {
        var gl = this.gl;
        var shader = this.gl.createShader(shaderType);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var compiledSuccessfully = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiledSuccessfully) {
            throw new ShaderCompilationError(shaderType, gl.getShaderInfoLog(shader));
        }
        return shader;
    };
    /*
     * Creates a vertex buffer for triangles to fill the 2d screen
     *
     * @return the buffer containing the vertex data
     */
    GLManager.prototype.createVertexBuffer = function () {
        var gl = this.gl;
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var vertices = [
            -1, -1,
            -1, 1,
            1, 1,
            -1, -1,
            1, -1,
            1, 1
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return vertexBuffer;
    };
    return GLManager;
}());
exports.GLManager = GLManager;

},{"../objects":3,"./glsl":29}],29:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var frag_1 = require("./frag");
/*
 * Contains data for GLSL vectors
 */
var GLSLVec = /** @class */ (function () {
    /*
     * Creates a GLSL vector with the specified data
     *
     * @param data - the data
     */
    function GLSLVec(data) {
        this.data = data;
    }
    return GLSLVec;
}());
/*
 * A 3D GLSL vector
 * Equivalent to vec3
 */
var GLSLVec3 = /** @class */ (function (_super) {
    __extends(GLSLVec3, _super);
    /*
     * Creates a 3D GLSL vector with the specified data
     *
     * @param data - the data (must be of length 3)
     */
    function GLSLVec3(data) {
        var _this = this;
        if (data.length == 3) {
            _this = _super.call(this, data) || this;
        }
        else {
            throw 'Array must have 3 elements';
        }
        return _this;
    }
    /*
     * Converts this vector into a GLSL constant expression
     * representing the same data
     */
    GLSLVec3.prototype.toGLSLString = function () {
        return 'vec3(' + this.data.join(', ') + ')';
    };
    return GLSLVec3;
}(GLSLVec));
exports.GLSLVec3 = GLSLVec3;
/*
 * A GLSL function
 */
var GLSLFunction = /** @class */ (function () {
    /*
     * Creates a GLSLFunction
     *
     * @param fType - the type of this function
     * @param returnType - the return type
     * @param params - the params with their types included
     * @param source - the source / body of the function
     *
     */
    function GLSLFunction(fType, returnType, dependencies, source) {
        this.fType = fType;
        this.returnType = returnType;
        this.dependencies = dependencies;
        this.source = source;
    }
    /*
     * Converts this function to GLSL source using the given name as the function name
     *
     * @param name - the name of the function
     *
     * @return - GLSL source
     */
    GLSLFunction.prototype.compile = function (name) {
        var _this = this;
        var dependencySource = Object.keys(this.dependencies).map(function (dependencyName) {
            return _this.dependencies[dependencyName].compile(name + "_" + dependencyName);
        }).join("\n");
        var paramString = (this.fType == GLSLFunctionType.SHADER) ? "(vec3 p, vec3 normal, vec3 light_dir)" : "(vec3 p)";
        var callDependencyArgsString = (this.fType == GLSLFunctionType.SHADER) ? "(p, normal, light_dir)" : "(p)";
        var functionSource = this.returnType + " " + name + paramString + " {\n" + this.source + "\n}\n";
        Object.keys(this.dependencies).forEach(function (dependencyName) {
            functionSource = functionSource.replace(new RegExp("\\$\\$" + dependencyName + "\\$\\$", "g"), name + "_" + dependencyName + callDependencyArgsString); // FIXME (this is a bug if the dependency name has any special regex characters because it will match other things too (if restricted to alphanumeric and underscore it should be fine)
        });
        return dependencySource + "\n" + functionSource;
    };
    return GLSLFunction;
}());
exports.GLSLFunction = GLSLFunction;
/*
 * The type of a GLSLFunction
 */
var GLSLFunctionType;
(function (GLSLFunctionType) {
    GLSLFunctionType[GLSLFunctionType["SDF"] = 0] = "SDF";
    GLSLFunctionType[GLSLFunctionType["SHADER"] = 1] = "SHADER";
})(GLSLFunctionType = exports.GLSLFunctionType || (exports.GLSLFunctionType = {}));
;
/*
 * GLSL vertex shader source
 */
exports.VERTEX_SHADER_SOURCE = "\n#version 300 es\n\nin vec2 pos;\n\nvoid main() {\n\tgl_Position = vec4(pos, 0, 1);\n}\n\n".trim();
/*
 * The default transpiler parameters
 */
var DEFAULT_PARAMS = {
    "max_marching_steps": 64,
    "epsilon": 0.01,
    "max_render_distance": 1000
};
/*
 * Extends GLSL by adding syntactic sugar.
 *
 * @param source - the source to transpile to GLSL
 * @return - the GLSL equivalent of the given source
 */
function transpileSyntacticSugar(source) {
    // Currently does not add any features to GLSL
    return source;
}
/*
 * Transpiles the fragment shader source by adding in the given params and turning
 * syntactic sugar into GLSL
 *
 * @param params - the parameters to replace
 */
function transpileFragmentShaderSource(params) {
    var source = frag_1.FRAGMENT_SHADER_SOURCE_TEMPLATE;
    var paramsWithDefaults = Object.assign({}, DEFAULT_PARAMS);
    paramsWithDefaults = Object.assign(paramsWithDefaults, params);
    for (var key in paramsWithDefaults) {
        var searchString = "%%" + key + "%%";
        while (source.indexOf(searchString) > -1) {
            source = source.replace(searchString, "" + paramsWithDefaults[key]); // "" + params[key] is to convert the parameter values to strings if they are not already 
        }
    }
    /*
     * This is done after the replacement of params so if parameters
     * have syntactic sugar than can be transpiled as well
     */
    source = transpileSyntacticSugar(source);
    return source;
}
/*
 * Returns the model specific function name given the generic base name for the function
 *
 * @param baseName - the generic name of the function
 * @param modelId - the ID of the model
 *
 * @return - the name of the model specific function
 */
function getModelFunctionName(baseName, modelId) {
    return baseName + "_" + modelId;
}
/*
 * Generates the branching GLSL code for calling the model specific SDF function
 * based on the ID.
 *
 * @param modelCount - the number of models (and therefore the number of model specific SDF functions)
 *
 * @return - the GLSL code for branching and calling a specific SDF when given the model ID
 */
function generateSceneSDFGLSLBranchingCode(modelCount) {
    var nearestLargerPowerOfTwoModelCount = Math.pow(2, Math.ceil(Math.log(modelCount) / Math.LN2));
    function generateBranches(startId, endId) {
        if (startId + 1 == endId) {
            if (startId < modelCount) {
                return "if (modelId == " + startId + ") { return " + getModelFunctionName('sdf', startId) + "(p); }\n";
            }
            else {
                return "";
            }
        }
        else {
            var midpoint = (startId + endId) / 2;
            return "if (modelId < " + midpoint + ") {\n" + generateBranches(startId, midpoint) + "}\n" +
                "else {\n" + generateBranches(midpoint, endId) + "}\n";
        }
    }
    if (modelCount == 0) {
        return "";
    }
    else {
        return generateBranches(0, nearestLargerPowerOfTwoModelCount);
    }
}
/*
 * Generates the branching GLSL code for calling the model specific shader function
 * based on the ID.
 *
 * @param modelCount - the number of models (and therefore the number of model specific shader functions)
 *
 * @return - the GLSL code for branching and calling a specific model shader when given the model ID
 */
function generateModelShaderGLSLBranchingCode(modelCount) {
    var nearestLargerPowerOfTwoModelCount = Math.pow(2, Math.ceil(Math.log(modelCount) / Math.LN2));
    function generateBranches(startId, endId) {
        if (startId + 1 == endId) {
            if (startId < modelCount) {
                return "if (modelId == " + startId + ") { return " + getModelFunctionName('shade', startId) + "(p, normal, light_dir); }\n";
            }
            else {
                return "";
            }
        }
        else {
            var midpoint = (startId + endId) / 2;
            return "if (modelId < " + midpoint + ") {\n" + generateBranches(startId, midpoint) + "}\n" +
                "else {\n" + generateBranches(midpoint, endId) + "}\n";
        }
    }
    if (modelCount == 0) {
        return "";
    }
    else {
        return generateBranches(0, nearestLargerPowerOfTwoModelCount);
    }
}
/*
 * Compiles a set of GLSL functions using the specified model ID
 *
 * @param fSet - the set of GLSL functions
 * @param modelId - the ID of the model that these functions are related to
 *
 * @return - the GLSL source
 */
function compileFunctionSet(fSet, modelId) {
    return Object.keys(fSet).map(function (fname) {
        return fSet[fname].compile(fname + "_" + modelId);
    }).join("\n");
}
/*
 * Generates the GLSL fragment shader source from the given models
 *
 * @param models - the models to incorporate into the shader source
 * @return the shader source
 */
function generateFragmentShaderSource(models) {
    var modelSource = "";
    models.forEach(function (model, id) {
        modelSource += compileFunctionSet(model.compile(), id) + "\n";
    });
    return transpileFragmentShaderSource({
        "model_source": modelSource,
        "model_count": models.length,
        "scene_sdf_branching_code": generateSceneSDFGLSLBranchingCode(models.length),
        "model_shader_branching_code": generateModelShaderGLSLBranchingCode(models.length)
    });
}
exports.generateFragmentShaderSource = generateFragmentShaderSource;

},{"./frag":27}],30:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/*
 * Manages graphics engine tick rate and framerate
 */
var Ticker = /** @class */ (function () {
    /*
     * @param tickCallback - called every graphics engine tick
     * @param renderCallback - called every frame
     * @param tickRate - the number of graphics engine ticks per second
     *
     */
    function Ticker(tickCallback, renderCallback, tickRate) {
        if (tickRate === void 0) { tickRate = 180; }
        this.fpsTracker = new FPSTracker();
        this.tickCallback = tickCallback;
        this.renderCallback = renderCallback;
        this.tickStep = 1 / tickRate;
        this.tickAccumulator = 0;
        this.running = false;
    }
    /* starts the ticker */
    Ticker.prototype.start = function () {
        var _this = this;
        this.running = true;
        this.lastFrameTime = Date.now();
        window.requestAnimationFrame(function () { return _this.frameLoop(); });
    };
    /* stops the ticker */
    Ticker.prototype.stop = function () {
        this.running = false;
    };
    /*
     * @return whether or not the ticker is running
     */
    Ticker.prototype.isRunning = function () {
        return this.running;
    };
    /*
     * @return the current framerate
     */
    Ticker.prototype.getFPS = function () {
        return this.fpsTracker.getFPS();
    };
    /*
     * loops and calls tickCallback and renderCallback accordingly
     */
    Ticker.prototype.frameLoop = function () {
        var _this = this;
        if (this.running) {
            var frameStartTime = Date.now();
            this.fpsTracker.frame();
            this.tickAccumulator += (frameStartTime - this.lastFrameTime) / 1000;
            while (this.tickAccumulator > this.tickStep) {
                this.tickCallback(this.tickStep);
                this.tickAccumulator -= this.tickStep;
            }
            this.renderCallback();
            this.lastFrameTime = frameStartTime;
            window.requestAnimationFrame(function () { return _this.frameLoop(); });
        }
    };
    return Ticker;
}());
exports.Ticker = Ticker;
/*
 * Tracks the framerate
 */
var FPSTracker = /** @class */ (function () {
    /*
     * @param updateInterval - how often (in milliseconds) to update the framerate
     */
    function FPSTracker(updateInterval) {
        if (updateInterval === void 0) { updateInterval = 1000; }
        this.updateInterval = updateInterval;
        this.lastUpdateTime = Date.now();
        this.framesSinceLastUpdate = 0;
        this.fps = 0;
    }
    /*
     * Should be called once per frame
     * Updates the framerate every update interval
     */
    FPSTracker.prototype.frame = function () {
        this.framesSinceLastUpdate++;
        var now = Date.now();
        if (now - this.lastUpdateTime > this.updateInterval) {
            var secondsSinceLastUpdate = (now - this.lastUpdateTime) / 1000;
            this.fps = this.framesSinceLastUpdate / secondsSinceLastUpdate;
            this.framesSinceLastUpdate = 0;
            this.lastUpdateTime = now;
            console.log(this.fps);
        }
    };
    /*
     * @return the last calculated framerate
     */
    FPSTracker.prototype.getFPS = function () {
        return this.fps;
    };
    return FPSTracker;
}());

},{}],31:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var graphics_engine_1 = require("./graphics-engine");
document.addEventListener("DOMContentLoaded", function () {
    var graphics = new graphics_engine_1.GraphicsEngine(document.body);
    var scene = new graphics_engine_1.Scene();
    graphics.bind(scene);
    scene.add(new graphics_engine_1.RenderableObject(new graphics_engine_1.Model(graphics_engine_1.SDF.fromJSON("\n\t{\n\t\t\"type\": \"simple-distortion\",\n\t\t\"distance\": {\n\t\t\t\"type\": \"sphere\",\n\t\t\t\"radius\": {\n\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\"dependencies\": {\n\t\t\t\t\t\"time\": {\n\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\"name\": \"u_time\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t\"return-type\": \"float\",\n\t\t\t\t\"source\": \"return 0.5 + 0.2*sin(3.0*$$time$$);\"\n\t\t\t},\n\t\t\t\"p\": {\n\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\"dependencies\": {\n\t\t\t\t\t\"p\": {\n\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\"name\": \"p\"\n\t\t\t\t\t},\n\t\t\t\t\t\"time\": {\n\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\"name\": \"u_time\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t\"return-type\": \"vec3\",\n\t\t\t\t\"source\": \"return $$p$$ - vec3(sin($$time$$), cos($$time$$), 10);\"\n\t\t\t}\n\t\t},\n\t\t\"p\": {\n\t\t\t\"type\": \"special-input\",\n\t\t\t\"name\": \"p\"\n\t\t},\n\t\t\"magnitude\": 0.05,\n\t\t\"freq\": 10.0\n\t}"), graphics_engine_1.Shader.fromJSON("\n\t\t{\n\t\t\t\"type\": \"phong\",\n\t\t\t\"ambient\": {\n\t\t\t\t\"color\": [0, 0.75, 0.75], \n\t\t\t\t\"amount\": {\n\t\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\t\"dependencies\": {\n\t\t\t\t\t\t\"time\": {\n\t\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\t\"name\": \"u_time\"\n\t\t\t\t\t\t}\n\t\t\t\t\t},\n\t\t\t\t\t\"return-type\": \"float\",\n\t\t\t\t\t\"source\": \"return 0.2;// + 0.1*sin(2.0*$$time$$);\"\n\t\t\t\t}\n\t\t\t},\n\t\t\t\"diffuse\": {\n\t\t\t\t\"color\": [0, 0.75, 0.75], \n\t\t\t\t\"amount\": {\n\t\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\t\"dependencies\": {\n\t\t\t\t\t\t\"time\": {\n\t\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\t\"name\": \"u_time\"\n\t\t\t\t\t\t}\n\t\t\t\t\t},\n\t\t\t\t\t\"return-type\": \"float\",\n\t\t\t\t\t\"source\": \"return 0.8;// + 0.4*sin(2.0*$$time$$);\"\n\t\t\t\t}\n\t\t\t},\n\t\t\t\"specular\": 8,\n\t\t\t\"normal\": {\n\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\"name\": \"normal\"\n\t\t\t},\n\t\t\t\"light-dir\": {\n\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\"name\": \"light_dir\"\n\t\t\t},\n\t\t\t\"view-dir\": {\n\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\"dependencies\": {},\n\t\t\t\t\"return-type\": \"vec3\",\n\t\t\t\t\"source\": \"return normalize(u_camera_pos-p);\"\n\t\t\t}\n\t\t}")), function (dt) { }));
    scene.add(new graphics_engine_1.RenderableObject(new graphics_engine_1.Model(graphics_engine_1.SDF.fromJSON("\n\t{\n\t\t\"type\": \"simple-distortion\",\n\t\t\"distance\": {\n\t\t\t\"type\": \"sphere\",\n\t\t\t\"radius\": {\n\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\"dependencies\": {\n\t\t\t\t\t\"time\": {\n\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\"name\": \"u_time\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t\"return-type\": \"float\",\n\t\t\t\t\"source\": \"return 0.5 + 0.2*sin(3.0*$$time$$);\"\n\t\t\t},\n\t\t\t\"p\": {\n\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\"dependencies\": {\n\t\t\t\t\t\"p\": {\n\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\"name\": \"p\"\n\t\t\t\t\t},\n\t\t\t\t\t\"time\": {\n\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\"name\": \"u_time\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t\"return-type\": \"vec3\",\n\t\t\t\t\"source\": \"return $$p$$ - vec3(0, 0, 10);\"\n\t\t\t}\n\t\t},\n\t\t\"p\": {\n\t\t\t\"type\": \"special-input\",\n\t\t\t\"name\": \"p\"\n\t\t},\n\t\t\"magnitude\": 0.05,\n\t\t\"freq\": 10.0\n\t}"), graphics_engine_1.Shader.fromJSON("\n\t\t{\n\t\t\t\"type\": \"phong\",\n\t\t\t\"ambient\": {\n\t\t\t\t\"color\": [0.75, 0, 0], \n\t\t\t\t\"amount\": {\n\t\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\t\"dependencies\": {\n\t\t\t\t\t\t\"time\": {\n\t\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\t\"name\": \"u_time\"\n\t\t\t\t\t\t}\n\t\t\t\t\t},\n\t\t\t\t\t\"return-type\": \"float\",\n\t\t\t\t\t\"source\": \"return 0.2;// + 0.1*sin(2.0*$$time$$);\"\n\t\t\t\t}\n\t\t\t},\n\t\t\t\"diffuse\": {\n\t\t\t\t\"color\": [0.75, 0, 0], \n\t\t\t\t\"amount\": {\n\t\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\t\"dependencies\": {\n\t\t\t\t\t\t\"time\": {\n\t\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\t\"name\": \"u_time\"\n\t\t\t\t\t\t}\n\t\t\t\t\t},\n\t\t\t\t\t\"return-type\": \"float\",\n\t\t\t\t\t\"source\": \"return 0.8;// + 0.4*sin(2.0*$$time$$);\"\n\t\t\t\t}\n\t\t\t},\n\t\t\t\"specular\": 8,\n\t\t\t\"normal\": {\n\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\"name\": \"normal\"\n\t\t\t},\n\t\t\t\"light-dir\": {\n\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\"name\": \"light_dir\"\n\t\t\t},\n\t\t\t\"view-dir\": {\n\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\"dependencies\": {},\n\t\t\t\t\"return-type\": \"vec3\",\n\t\t\t\t\"source\": \"return normalize(u_camera_pos-p);\"\n\t\t\t}\n\t\t}")), function (dt) { }));
    scene.add(new graphics_engine_1.RenderableObject(new graphics_engine_1.Model(graphics_engine_1.SDF.fromJSON("\n\t{\n\t\t\"type\": \"simple-distortion\",\t\n\t\t\"distance\": {\n\t\t\t\"type\": \"plane\",\n\t\t\t\"normal\": [0, 0, -1],\n\t\t\t\"p\": {\n\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\"dependencies\": {\n\t\t\t\t\t\"p\": {\n\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\"name\": \"p\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t\"return-type\": \"vec3\",\n\t\t\t\t\"source\": \"return $$p$$ - vec3(0, 0, 25);\"\n\t\t\t}\n\t\t},\n\t\t\"p\": {\n\t\t\t\"type\": \"special-input\",\n\t\t\t\"name\": \"p\"\n\t\t},\n\t\t\"magnitude\": 0.1,\n\t\t\"freq\": 5.0\n\t}\n\t"), graphics_engine_1.Shader.fromJSON("\n\t\t{\n\t\t\t\"type\": \"phong\",\n\t\t\t\"ambient\": {\n\t\t\t\t\"color\": [0, 0.75, 0], \n\t\t\t\t\"amount\": {\n\t\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\t\"dependencies\": {\n\t\t\t\t\t\t\"time\": {\n\t\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\t\"name\": \"u_time\"\n\t\t\t\t\t\t}\n\t\t\t\t\t},\n\t\t\t\t\t\"return-type\": \"float\",\n\t\t\t\t\t\"source\": \"return 0.2;// + 0.1*sin(2.0*$$time$$);\"\n\t\t\t\t}\n\t\t\t},\n\t\t\t\"diffuse\": {\n\t\t\t\t\"color\": [0, 0.75, 0], \n\t\t\t\t\"amount\": {\n\t\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\t\"dependencies\": {\n\t\t\t\t\t\t\"time\": {\n\t\t\t\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\t\t\t\"name\": \"u_time\"\n\t\t\t\t\t\t}\n\t\t\t\t\t},\n\t\t\t\t\t\"return-type\": \"float\",\n\t\t\t\t\t\"source\": \"return 0.8;// + 0.4*sin(2.0*$$time$$);\"\n\t\t\t\t}\n\t\t\t},\n\t\t\t\"specular\": 100,\n\t\t\t\"normal\": {\n\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\"name\": \"normal\"\n\t\t\t},\n\t\t\t\"light-dir\": {\n\t\t\t\t\"type\": \"special-input\",\n\t\t\t\t\"name\": \"light_dir\"\n\t\t\t},\n\t\t\t\"view-dir\": {\n\t\t\t\t\"type\": \"custom\",\n\t\t\t\t\"dependencies\": {},\n\t\t\t\t\"return-type\": \"vec3\",\n\t\t\t\t\"source\": \"return normalize(u_camera_pos-p);\"\n\t\t\t}\n\t\t}\n\t")), function (dt) { }));
    graphics.start();
});

},{"./graphics-engine":2}]},{},[31]);
