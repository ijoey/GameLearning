var LevelController = function(m, delegate){
	var self = mvc.controller.apply(this, [m, delegate]);
	var min = {x: 32, y: 75};
	var max = {x: 450, y: 460};
	this.controllers = [];
	this.load_view = function(canvas){
		this.view = new LevelView(canvas, this, this.model);
		this.controllers.forEach(function(c){
			c.model.subscribe("position", self);
			c.refresh();
		});
		return this.view;
	};
	this.will_release = function(){
		
	};
	this.update = function(key, old, v, m){
		if(key === "position"){
			if(v.x >= max.x) m.position.x = max.x - 1;
			if(v.y >= max.y) m.position.y = max.y - 1;
			if(v.x <= min.x) m.position.x = min.x + 1;
			if(v.y <= min.y) m.position.y = min.y + 1;
		}
	};
	this.refresh = function(keys, modifier){
		this.view.refresh();
		this.controllers.forEach(function(c){
			c.update(keys, modifier);
		});
	};
	return this;
};

var HeroController = function(m, delegate){
	var self = mvc.controller.apply(this, [m, delegate]);
	var _interval = null;
	this.load_view = function(canvas){
		this.view = new HeroView(canvas, this, this.model, null);
		return this.view;
	};
	this.will_release = function(){
		
	};
	this.refresh = function(){
		this.view.move(this.model.position);
	};
	this.down = function(modifier){
		var position = this.model.position;
		position.y += this.model.speed * modifier;
		this.model.position = position;
	};
	this.up = function(modifier){
		var position = this.model.position;
		position.y -= this.model.speed * modifier;
		this.model.position = position;
	};
	this.left = function(modifier){
		var position = this.model.position;
		position.x -= this.model.speed * modifier;
		this.model.position = position;
	};
	this.right = function(modifier){
		var position = this.model.position;
		position.x += this.model.speed * modifier;
		this.model.position = position;
	};
	this.fire = function(){
		this.model.fire();
	};
	this.update = function(keys, modifier){
		if(32 in keys){
			this.fire();
		}
		if(37 in keys){
			this.left(modifier);
		}else if(38 in keys){
			this.up(modifier);
		}else if(39 in keys){
			this.right(modifier);
		}else if(40 in keys){
			this.down(modifier);
		}else{
			this.refresh();
		}
	};
	return this;
};