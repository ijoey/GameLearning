var HeroView = function(id, c, m, options){
	var self = mvc.view.apply(this, [id, c, m, options]);
	this.context = this.container.getContext('2d');
	this.image = new Image();
	this.image.src = "Content/img/hero.png";
	this.will_release = function(){
		
	};
	this.model.subscribe("position", this);
	this.update = function(key, old, v, m){
		if(key === "position") this.move(v);
	};
	this.move = function(position){
		this.context.drawImage(this.image, position.x, position.y);
	};
	this.move(this.model.position);
	return this;
};
var MonsterView = function(id, c, m, options){
	var self = mvc.view.apply(this, [id, c, m, options]);
	this.context = this.container.getContext('2d');
	this.image = new Image();
	this.image.src = "Content/img/monster.png";
	this.will_release = function(){
		
	};
	this.model.subscribe("position", this);
	this.update = function(key, old, v, m){
		if(key === "position") this.move(v);
	};
	this.move = function(position){
		this.context.drawImage(this.image, position.x, position.y);
	};
	this.move(this.model.position);
	return this;
};
var LevelView = function(id, c, m, options){
	var self = mvc.view.apply(this, [id, c, m, options]);
	this.context = this.container.getContext('2d');
    this.container.width = 512;
    this.container.height = 525;
	this.background = new Image();
	this.background.src = "Content/img/Levels/orange.png";
	this.will_release = function(){
	
	};
	this.refresh = function(){
		this.context.drawImage(this.background, 0, 0);
	};
};