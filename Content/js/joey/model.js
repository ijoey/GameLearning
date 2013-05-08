var Level = function(monsterCount, goal, heroSpeed, monsterSpeed) {
	var self = mvc.model.apply(this, []);
	var _min = {x: 0, y:0};
	Object.defineProperty(this, "min", {
		get: function(){return _min;}
		, set: function(v){
			var old = _min;
			_min = v;
			self.changed("min", old, v);
		}
	});
	
	var _max = {x: 0, y:0};
	Object.defineProperty(this, "max", {
		get: function(){return _max;}
		, set: function(v){
			var old = _max;
			_max = v;
			self.changed("max", old, v);
		}
	});
	
	var _monsterCount = monsterCount;
	Object.defineProperty(this, "monsterCount", {
		get: function(){return _monsterCount;}
		, set: function(v){
			var old = _monsterCount;
			_monsterCount = v;
			self.changed("monsterCount", old, v);
		}
	});
	var _goal = goal;
	Object.defineProperty(this, "goal", {
		get: function(){return _goal;}
		, set: function(v){
			var old = _goal;
			_goal = v;
			self.changed("goal", old, v);
		}
	});
	
	var _heroSpeed = heroSpeed;
	Object.defineProperty(this, "heroSpeed", {
		get: function(){return _heroSpeed;}
		, set: function(v){
			var old = _heroSpeed;
			_heroSpeed = v;
			self.changed("heroSpeed", old, v);
		}
	});
	
	var _monsterSpeed = monsterSpeed;
	Object.defineProperty(this, "monsterSpeed", {
		get: function(){return _monsterSpeed;}
		, set: function(v){
			var old = _monsterSpeed;
			_monsterSpeed = v;
			self.changed("monsterSpeed", old, v);
		}
	});
	
	return this;
};

var Hero = function(obj){
    var self = mvc.model.apply(this, [obj]);
	var _damage = 0;
	Object.defineProperty(this, "damage", {
		get: function(){return _damage;}
		, set: function(v){
			var old = _damage;
			v = v > self.health ? self.health : v;
			_damage = v;
			self.changed("damage", old, v);
		}
	});
	
	var _health = 0;
	Object.defineProperty(this, "health", {
		get: function(){return _health;}
		, set: function(v){
			var old = _health;
			_health = v;
			self.changed("health", old, v);
		}
	});
	
	var _position = {x: 0, y: 0};
	Object.defineProperty(this, "position", {
		get: function(){return _position;}
		, set: function(v){
			var old = _position;
			_position = v;
			self.changed("position", old, v);
		}
	});
	
	var _speed = 256;
	Object.defineProperty(this, "speed", {
		get: function(){return _speed;}
		, set: function(v){
			var old = _speed;
			_speed = v;
			self.changed("speed", old, v);
		}
	});
	
	this.subscribe("damage", this);
	
	/*
    this.Speed = speed;
    this.X = Game.Canvas.width / 2;
    this.Y = Game.Canvas.height / 2;
    this.Ready = false;
    this.ImageSrc = 'Content/img/hero.png';
    this.Image = null;
    this.Direction = Game.Entity.Direction.Down;
    this.Health = 100;
    this.Projectiles = [];
	*/
	this.update = function(key, old, v, obj){
		if(key === "damage") _health -= v;
	};
	this.fire = function(){
		
	};
};