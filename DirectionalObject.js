var DirectionalObject = (function() {

	function remap(x, s1, e1, s2, e2) {
		return (x - s1) * (e2 - s2) / (e1 - s1) + s2;
	}

	// uses wikihow method for finding angle between two vectors
	function angleBetween(x1, y1, x2, y2) {
		var length1 = Math.sqrt(x1 ** 2 + y1 ** 2);
		var length2 = Math.sqrt(x2 ** 2 + y2 ** 2);
		return Math.acos((x1 * x2 + y1 * y2) / (length1 * length2)) * (180 / Math.PI);
	}

	function DirectionalObject(array, position, direction, repeat) {
		if (!(this instanceof DirectionalObject)) return new DirectionalObject(array, repeat);

		if (!(array instanceof Array)) {
			console.log("DirectionalObject must recieve one argument of type Array, but did not recieve one");
			return;
		}

		position = position instanceof Array ? position : [];
		direction = direction instanceof Array ? direction : [];

		var posX = typeof position[0] === "number" ? position[0] : 0;
		var posY = typeof position[1] === "number" ? position[1] : 0;

		var dirX = typeof direction[0] === "number" ? direction[0] : 1;
		var dirY = typeof direction[1] === "number" ? direction[1] : 0;

		this.faces = array;
		this.repeat = !!repeat;
		this.face = array[0];
		this.position = {
			x: posX,
			y: posY
		};
		this.direction = {
			x: dirX,
			y: dirY
		};
	}

	DirectionalObject.prototype.orient = function(x, y) {
		// get the vector betwen our position and the provided (x, y) vector
		var between = {
			x: x - this.position.x,
			y: y - this.position.y
		};

		// the sign of the determinant of the between vector and our direction to distinguish the left side from the right
		var sign = Math.sign(between.x * this.direction.y - this.direction.x * between.y);
		// offsets the transition of one directional face to the next
		var offset = (360 / (this.faces.length * 2));
		// the angle between this direction vector and the between vector, offseted and multiplied by sign
		var angle = angleBetween(between.x, between.y, this.direction.x, this.direction.y) * sign - offset;

		if (angle < -180) {
			angle = 360 + angle
		}

		// remap the angle to a range of 0 - face amount
		this.face = this.faces[Math.floor(remap(angle, -180, 180, 0, this.faces.length))];
		return this;
	};

	return DirectionalObject;
})();