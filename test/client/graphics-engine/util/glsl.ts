const assert = require("assert");

describe("GLSL", function () {

	describe("getModelSDFFunctionName", function () {
		it("id=0", function () {
			assert.equal(getModelSDFFunctionName(0), "sdf_0");
		});
		it("id=1", function () {
			assert.equal(getModelSDFFunctionName(1), "sdf_1");
		});
		it("id=1074", function () {
			assert.equal(getModelSDFFunctionName(1074), "sdf_1074");
		});
	});
	
	describe("generateSceneSDFGLSLBranchingCode", function () {
		it("modelCount=1", function () {
			assert.equal(generateSceneSDFGLSLBranchingCode(1), "if (id == 0) { return sdf_0(p); }\n");
		});
		it("modelCount=2", function () {
			assert.equal(generateSceneSDFGLSLBranchingCode(2), "if (id < 1) {\nif (id == 0) { return sdf_0(p); }\n}\nelse {\nif (id == 1) { return sdf_1(p); }\n}\n");
		});
		it("modelCount=7", function () {
			assert.equal(generateSceneSDFGLSLBranchingCode(7), "if (id < 4) {\nif (id < 2) {\nif (id < 1) {\nif (id == 0) { return sdf_0(p); }\n}\nelse {\nif (id == 1) { return sdf_1(p); }\n}\n}\nelse {\nif (id < 3) {\nif (id == 2) { return sdf_2(p); }\n}\nelse {\nif (id == 3) { return sdf_3(p); }\n}\n}\n}\nelse {\nif (id < 6) {\nif (id < 5) {\nif (id == 4) { return sdf_4(p); }\n}\nelse {\nif (id == 5) { return sdf_5(p); }\n}\n}\nelse {\nif (id < 7) {\nif (id == 6) { return sdf_6(p); }\n}\nelse {\nif (id == 7) { return sdf_7(p); }\n}\n}\n}\n");
		});
	});

});
