//TODO do private internal object via factories (createInstance function, then local variables within that function)


function createObject2D() {

}


var internalObject2Ds = {};
var object2DKey = 1;

class Object2D {

	constructor(x, y, width, height, paint) {
		this.key = object2DKey++;
		internalObject2Ds[this.key] = new InternalObject2D(TODO);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	set x(newX) {
		//TODO add check within bounds
		internalObject2Ds[this.key].x = newX;
	}

	get x() {
		return internalObject2Ds[this.key].x;
	}

	set y(newY) {
		internalObject2Ds[this.key].y = newY;
	}

	get y() {
		return internalObject2Ds[this.key].y;
	}

	set width(newWidth) {
		internalObject2Ds[this.key].resize(newWidth, this.height);
	}

	get width() {
		return internalObject2Ds[this.key].width;
	}

	set height(newHeight) {
		internalObject2Ds[this.key].resize(this.width, newHeight);
	}

	paint(ctx) {
		internalObject2Ds[this.key].paint(ctx);
	}

}



module.exports.Object2D = Object2D;
