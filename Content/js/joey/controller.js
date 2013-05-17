var LevelController = function(m, delegate){
	var self = mvc.controller.apply(this, [m, delegate]);
	this.min = {x: 32, y: 75};
	this.max = {x: 450, y: 460};
	this.controllers = [];
	this.delta = 0;
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
			if(v.x >= this.max.x) m.position.x = this.max.x - 1;
			if(v.y >= this.max.y) m.position.y = this.max.y - 1;
			if(v.x <= this.min.x) m.position.x = this.min.x + 1;
			if(v.y <= this.min.y) m.position.y = this.min.y + 1;
		}
	};
	this.refresh = function(keys, modifier, delta){
		this.delta = delta;
		this.view.refresh();
		this.controllers.forEach(function(c){
			c.update(keys, modifier, delta);
		});
	};
	return this;
};
var MonsterController = function(m, delegate){
	var self = mvc.controller.apply(this, [m, delegate]);
	var _interval = null;
    this.model.position.x = 32 + (Math.random() * (this.delegate.max.x - 64));
    this.model.position.y = 32 + (Math.random() * (this.delegate.max.y - 64));
	this.load_view = function(canvas){
		this.view = new MonsterView(canvas, this, this.model, null);
		/*_interval = setInterval(function(){
			self.move();
		}, 60);*/
		return this.view;
	};
	this.will_release = function(){
		clearInterval(_interval);
	};
	this.refresh = function(){
		this.view.move(this.model.position);
	};
	this.update = function(keys, modifier, delta){
        if((this.model.speed.x > 0 && this.model.position.x >= this.delegate.max.x - 16) 
			|| (this.model.speed.x < 0 && this.model.position.x <= this.delegate.min.x))
            this.model.speed.x = this.model.speed.x * -1;

        if((this.model.speed.y < 0 && this.model.position.y >= this.delegate.max.y - 16)
			|| (this.model.speed.y > 0 && this.model.position.y <= this.delegate.min.y))
            this.model.speed.y = this.model.speed.y * -1;

        this.model.position.x += this.model.speed.x;// * delta;
        this.model.position.y -= this.model.speed.y;// * delta;
		this.refresh();
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