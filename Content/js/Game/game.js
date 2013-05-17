var App = {};
App.Entity = {};
App.Event = {};
App.Levels = [];
App.Canvas = null;
App.CanvasContext = null;
App.LastTime = null;
App.FrameRate = 1000; // frames per sec
App.MainInterval = null;
App.CurrentLevelIndex = -1;
App.CurrentLevel = null;
App.MonstersCaught = 0;
App.Delta = 0;
App.MinX = 34;
App.MaxX = 448;
App.MinY = 55;
App.MaxY = 457;
App.currentKey = [];

var canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 525;
var context = canvas.getContext('2d');
var entities = {"level1": {name: "level"
		, renderable: {src: 'content/img/levels/orange.png', envelope: {w: 448, h: 457}}
		, position: {x: 0, y: 0, a: 0}
	}
	, "hero1": {name: "hero"
		, container: {max: {x: 448, y: 457}, min: {x: 34, y:55}}
		, collisionDetection: {max: {x: 16, y: 16}, min: {x: 0, y:0}}
		, renderable: {src: 'content/img/hero.png', envelope: {w: 20, h: 20}}
		, position: {x: 50, y: 50, a: 0}
		, moveable: {speed: {x: 3, y: 3, modifier: 5}}
		/*, didCollide: function(entity){
			if(this.position.x >= entity.collisionDetection.max.x) this.position.x = entity.collisionDetection.max.x - 1;
			if(this.position.y >= entity.collisionDetection.max.y) this.position.y = entity.collisionDetection.max.y - 1;
			if(this.position.x <= entity.collisionDetection.min.x) this.position.x = entity.collisionDetection.min.x + 1;
			if(this.position.y <= entity.collisionDetection.min.y) this.position.y = entity.collisionDetection.min.y + 1;
		}*/
		, max: {x: 16, y: 16}, min: {x: 0, y:0}
	}
	, "monster1": {name: "monster"
		, container: {max: {x: 448, y: 457}, min: {x: 34, y:55}}
		, collisionDetection: {max: {x: 16, y: 16}, min: {x: 0, y:0}}
		, renderable: {src: 'content/img/monster.png', envelope: {w: 20, h: 20}}
		, position: {x: 150, y: 150, a: 0}
		, automoveable: {container: {max: {x: 457, y: 448}, min: {x: 34, y: 55}}, speed: {x: 5, y: 5, modifier: 5}}
		/*, didCollide: function(entity){
			if(this.position.x >= entity.collisionDetection.max.x) this.automoveable.speed.x = this.automoveable.speed.x * -1;
			if(this.position.y >= entity.collisionDetection.max.y) this.automoveable.speed.y = this.automoveable.speed.y * -1;
			if(this.position.x <= entity.collisionDetection.min.x) this.automoveable.speed.x = this.automoveable.speed.x * -1;
			if(this.position.y <= entity.collisionDetection.min.y) this.automoveable.speed.y = this.automoveable.speed.y * -1;
		}*/
		, max: {x: 16, y: 16}, min: {x: 0, y:0}
	}
};

function hittingLeftWall(entity){
	return entity.position.x <= entity.container.min.x + entity.moveable.speed.x;
}
function hittingRightWall(entity){
	return entity.position.x >= entity.container.max.x - entity.moveable.speed.x;
}
function hittingTopWall(entity){
	return entity.position.y <= entity.container.min.y + entity.moveable.speed.y;
}
function hittingBottomWall(entity){
	return entity.position.y >= entity.container.max.y - entity.moveable.speed.y;
}
var KEYS = {
	up: 38
	, down: 40
	, left: 37
	, right: 39
	, space: 32
};
var systems = {
	renderable: function(entity){
		var image = new Image();
		image.src = entity.renderable.src;
		context.drawImage(image, entity.position.x, entity.position.y);
	}
	, moveable: function(entity){
		if(KEYS.space in App.currentKey){
		}
		if(KEYS.left in App.currentKey){
			if(!hittingLeftWall(entity)) entity.position.x -= entity.moveable.speed.x * entity.moveable.speed.modifier;
		}
		if(KEYS.up in App.currentKey){
			if(!hittingTopWall(entity)) entity.position.y -= entity.moveable.speed.y * entity.moveable.speed.modifier;
		}
		if(KEYS.right in App.currentKey){
			if(!hittingRightWall(entity)) entity.position.x += entity.moveable.speed.x * entity.moveable.speed.modifier;
		}
		if(KEYS.down in App.currentKey){
			if(!hittingBottomWall(entity)) entity.position.y += entity.moveable.speed.y * entity.moveable.speed.modifier;
		}
	}
	, shouldContain: function(entity, speed){
		if(entity.position.x >= entity.container.max.x) entity.position.x -= 1;
		if(entity.position.y >= entity.container.max.y) entity.position.y -= 1;
		if(entity.position.x <= entity.container.min.x) entity.position.x += 1;
		if(entity.position.y <= entity.container.min.y) entity.position.y += 1;
	}
	, automoveable: function(entity){
        entity.position.x += entity.automoveable.speed.x;
        entity.position.y -= entity.automoveable.speed.y;
	}
	, collisionDetection: function(entity){
		for(id in entities){
			if(entity === entities[id]) continue;
			if(!entities[id].didCollide) continue;
			if((entities[id].position.x >= entity.collisionDetection.max.x)
				|| (entities[id].position.y >= entity.collisionDetection.max.y)
				|| (entities[id].position.x <= entity.collisionDetection.min.x)
				|| (entities[id].position.y <= entity.collisionDetection.min.y)){
					entities[id].didCollide(entity);
				}
		}
	}
};

var interval = null;
document.body.appendChild(canvas);
interval = setInterval(function(){
	for(id in entities){
		for(system in systems){
			if(entities[id][system]) systems[system](entities[id]);
		}
	}
}, 60);

window.addEventListener("keydown", function (e) {
    App.currentKey[e.keyCode] = true;
}, false);

window.addEventListener("keyup", function (e) {
	delete App.currentKey[e.keyCode];
}, false);
window.addEventListener("unload", function(e){
	clearInterval(interval);
}, false);