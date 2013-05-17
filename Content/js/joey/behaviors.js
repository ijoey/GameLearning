var Behavior = {};
Behavior.AutoMove = function(obj, options) {
	this.execute = function(speed) {
		if((obj.speed.x > 0 && obj.position.x >= options.max.x - 16) || (obj.speed.x < 0 && obj.position.x <= options.min.x))
			obj.speed.x = obj.speed.x * -1;

		if((obj.speed.y < 0 && obj.position.y >= options.max.y - 16) || (obj.speed.y > 0 && obj.position.y <= options.min.y))
			obj.speed.y = obj.speed.y * -1;

		obj.position.x += obj.speed.x;
		obj.position.y -= obj.speed.y;
	};
	return this;
};