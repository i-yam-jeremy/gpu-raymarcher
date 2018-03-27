if (!('Rayle' in window)) {
	window.Rayle = {};
}


Rayle.GraphicsEngine = (() => {

	const GraphicsEngine = require('./external/engine').GraphicsEngine;

	return {
		GraphicsEngine
	};

})();
