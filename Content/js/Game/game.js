var App = {};
App.currentKey = [];

var canvas = document.createElement('canvas');
var label = document.createElement('p');
canvas.width = 512;
canvas.height = 480;
var context = canvas.getContext('2d');
var entities = {"level1": {name: "level"
		, src: 'content/img/background.png'
		, size: {w: 450, h: 414}
		, vector: {x: 0, y: 0, a: 0}
	}
	, "hero1": {name: "hero"
		, container: {max: {x: 450, y: 414}, min: {x: 20, y: 10}}
		, src: 'content/img/hero.png'
		, size: {w: 20, h: 20}
		, vector: {x: 50, y: 50, a: 0, direction: 0}
		, speed: {x: 3, y: 3, modifier: 5}
		/*, didCollide: function(entity){
			if(this.vector.x >= entity.collisionDetection.max.x) this.vector.x = entity.collisionDetection.max.x - 1;
			if(this.vector.y >= entity.collisionDetection.max.y) this.vector.y = entity.collisionDetection.max.y - 1;
			if(this.vector.x <= entity.collisionDetection.min.x) this.vector.x = entity.collisionDetection.min.x + 1;
			if(this.vector.y <= entity.collisionDetection.min.y) this.vector.y = entity.collisionDetection.min.y + 1;
		}*/
		, max: {x: 16, y: 16}
		, min: {x: 0, y:0}
		, moveable: true
		, collidable: true
		, damage: 40
	}
	, "monster1": {name: "monster"
		, src: 'content/img/monster.png'
		, size: {w: 20, h: 20}
		, vector: {x: 150, y: 150, a: 0, direction: 0}
		, container: {max: {x: 450, y: 414}, min: {x: 20, y: 10}}
		/*, didCollide: function(entity){
			if(this.vector.x >= entity.collisionDetection.max.x) this.automoveable.speed.x = this.automoveable.speed.x * -1;
			if(this.vector.y >= entity.collisionDetection.max.y) this.automoveable.speed.y = this.automoveable.speed.y * -1;
			if(this.vector.x <= entity.collisionDetection.min.x) this.automoveable.speed.x = this.automoveable.speed.x * -1;
			if(this.vector.y <= entity.collisionDetection.min.y) this.automoveable.speed.y = this.automoveable.speed.y * -1;
		}*/
		, max: {x: 16, y: 16}
		, min: {x: 0, y:0}
		, automove: true
		, speed: {x: 3, y: 3, modifier: 5}
		, collidable: true
		, damage: 10
	}
	, "monster2": {name: "monster"
		, container: {max: {x: 450, y: 414}, min: {x: 20, y: 10}}
		, src: 'content/img/monster.png'
		, size: {w: 20, h: 20}
		, vector: {x: 50, y: 15, a: 0, direction: 0}
		/*, didCollide: function(entity){
			if(this.vector.x >= entity.collisionDetection.max.x) this.automoveable.speed.x = this.automoveable.speed.x * -1;
			if(this.vector.y >= entity.collisionDetection.max.y) this.automoveable.speed.y = this.automoveable.speed.y * -1;
			if(this.vector.x <= entity.collisionDetection.min.x) this.automoveable.speed.x = this.automoveable.speed.x * -1;
			if(this.vector.y <= entity.collisionDetection.min.y) this.automoveable.speed.y = this.automoveable.speed.y * -1;
		}*/
		, max: {x: 16, y: 16}
		, min: {x: 0, y:0}
		, automove: true
		, speed: {x: 3, y: 3, modifier: 5}
		, collidable: true
		, damage: 10
	}
};
entities["monster1"].vector.x = Math.floor((Math.random()*canvas.width)+1);
entities["monster1"].vector.y = Math.floor((Math.random()*canvas.height)+1);
entities["monster2"].vector.x = Math.floor((Math.random()*canvas.width)+1);
entities["monster2"].vector.y = Math.floor((Math.random()*canvas.height)+1);

var Rocket = function(){
	var self = {
		name: new Date()
		, container: {max: {x: 450, y: 414}, min: {x: 20, y: 10}}
		, src: 'content/img/BulletHor.png'
		, size: {w:5, h: 5}
		, vector: {x: 0, y: 0, a: 0}
		, max: {x: 5, y: 5}
		, min: {x: 0, y: 0}
		, speed: {x: 5, y: 5, modifier: 5}
		, movesForAWhile: true
		, collidable: true
	}
	return self;
};

function hittingLeftWall(entity){
	return entity.vector.x <= entity.container.min.x + entity.speed.x;
}
function hittingRightWall(entity){
	return entity.vector.x >= entity.container.max.x - entity.speed.x;
}
function hittingTopWall(entity){
	return entity.vector.y <= entity.container.min.y + entity.speed.y;
}
function hittingBottomWall(entity){
	return entity.vector.y >= entity.container.max.y - entity.speed.y;
}
var KEYS = {
	up: 38
	, down: 40
	, left: 37
	, right: 39
	, space: 32
};
var notificationCenter = (function(){
	var observers = [];
	var self = {
		publish: function(notification, publisher, info){
			var ubounds = observers.length;
			var i = 0;
			for(i; i<ubounds; i++){
				if(!observers[i]) continue;
				if(observers[i].notification != notification) continue;
				if(observers[i].publisher != null && observers[i].publisher != publisher) continue;
				try{
					observers[i].observer[notification].apply(observers[i].observer, [publisher, info]);
				}catch(e){
					console.log([e, observers[i]]);
				}
			}
		}
		, subscribe: function(notification, observer, publisher){
			observers.push({"notification": notification, "observer":observer, "publisher":publisher});
		}
		, unsubscribe: function(notification, observer, publisher){
			var i = 0;
			var ubounds = observers.length;
			for(i; i<ubounds; i++){
				if(observers[i].observer == observer && observers[i].notification == notification){
					observers.splice(i, 1);
					break;
				}
			}
		}
	}
	return self;
})();

var collided = {
	"entities collided": function(publisher, info){
		if(info.b.damage){
			info.b.damage -= 1;
		}
		if(info.a.damage){
			info.a.damage -= 1;
		}
		if(info.a.damage <= 0){
			notificationCenter.publish('died', this, info.a);
		}
		if(info.b.damage <= 0){
			notificationCenter.publish('died', this, info.b);
		}
	}
	, "bullet fired": function(publisher, entity){
		var id = (new Date()).getTime();
		var offset = {x: -10, y: 0};
		if(entity.vector.direction === 90){
			offset.x = 40;
		}
		if(entity.vector.direction === 180){
			offset.x = -10;
			offset.y = 5;
		}
		entities[id] = Rocket();
		entities[id].vector.x = entity.vector.x + offset.x;
		entities[id].vector.y = entity.vector.y + offset.y;
		entities[id].vector.a = entity.vector.a;
		entities[id].vector.direction = entity.vector.direction;
		if(entities[id].vector.direction === 0 || entities[id].vector.direction === 180){
			entities[id].src = 'content/img/BulletVer.png';
		}
		setTimeout(function(){
			delete entities[id];
		}, 1000);
	}
	, "died": function(publisher, entity){
		for(id in entities){
			if(entity === entities[id]) delete entities[id];
		}
	}
};
notificationCenter.subscribe('entities collided', collided, null);
notificationCenter.subscribe('bullet fired', collided, null);
notificationCenter.subscribe('died', collided, null);
var origin = {x: canvas.width/2, y: canvas.height/2};

var systems = {
	collidable: {
		execute: function(entity, entities){
			for(id in entities){
				if(entity === entities[id]) continue;
				if ((entity.vector.x + entity.size.w >= entities[id].vector.x)
					 && (entity.vector.x <= entities[id].vector.x + entities[id].size.w)
					 && (entity.vector.y + entity.size.h >= entities[id].vector.y)
					 && (entity.vector.y <= entities[id].vector.y + entities[id].size.h)){
 						notificationCenter.publish('entities collided', this, {a: entities[id], b: entity});
					 }
			}
		}
		, fits: function(entity){
			if(!entity) return false;
			var matches = Object.getOwnPropertyNames(entity).filter(function(name){
				return (name === "size"
					|| name === "vector"
					|| name === "collidable"
					|| name === "max"
					|| name === "min");
			});
			return matches.length === 5;
		}
	}
	, renderable: {
		execute: function(entity, entities){
			var image = new Image();
			image.src = entity.src;
			context.drawImage(image, entity.vector.x, entity.vector.y);
		}
		, fits: function(entity){
			if(!entity) return false;
			var matches = Object.getOwnPropertyNames(entity).filter(function(name){
				return (name === "src"
					|| name === "vector");
			});
			return matches.length === 2;
		}
	}
	, movesForAWhile: {
		speed: 50
		, execute: function(entity, entities){
			
			if(entity.vector.direction === 0){
				entity.vector.y -= this.speed;
				entity.src = 'content/img/BulletVer.png';
			}
			if(entity.vector.direction === 90){
				entity.vector.x += this.speed;
			}
			if(entity.vector.direction === 180){
				entity.vector.y += this.speed;
				entity.src = 'content/img/BulletVer.png';
			}
			if(entity.vector.direction === 270){
				entity.vector.x -= this.speed;
			}
			//console.log(entity.vector.a * 180/Math.PI);
		}
		, fits: function(entity){
			if(!entity) return false;
			var matches = Object.getOwnPropertyNames(entity).filter(function(name){
				return (name === "movesForAWhile"
					|| name === "vector");
			});
			return matches.length === 2;
		}
	}
	, moveable: {
		execute: function(entity, entities){
			if(KEYS.space in App.currentKey){
				notificationCenter.publish('bullet fired', this, entity);
			}
			if(KEYS.left in App.currentKey){
				if(!hittingLeftWall(entity)) entity.vector.x -= entity.speed.x * entity.speed.modifier;
				entity.vector.direction = 270;
			}
			if(KEYS.up in App.currentKey){
				if(!hittingTopWall(entity)) entity.vector.y -= entity.speed.y * entity.speed.modifier;
				entity.vector.direction = 0;
			}
			if(KEYS.right in App.currentKey){
				if(!hittingRightWall(entity)) entity.vector.x += entity.speed.x * entity.speed.modifier;
				entity.vector.direction = 90;
			}
			if(KEYS.down in App.currentKey){
				if(!hittingBottomWall(entity)) entity.vector.y += entity.speed.y * entity.speed.modifier;
				entity.vector.direction = 180;
			}
			var a = entity.vector.y;// - entity.vector.previous.y;
			var c = entity.vector.x;// - entity.vector.previous.x;
			var b = Math.sqrt(Math.pow(c, 2) + Math.pow(a, 2));
			if(a > 0 && c > 0){
				var z = ((Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2))/(2*b*c));
				entity.vector.a = Math.acos(z);
				//console.log(entity.vector.a * 180/Math.PI);
			}
			var x = (entity.vector.x - origin.x);
			var y = (entity.vector.y - origin.y);
			var s = Math.pow(x, 2) + Math.pow(y, 2);
			label.innerHTML = Math.sqrt(s);
			context.beginPath();
			context.moveTo(origin.x, origin.y);
			context.lineTo(entity.vector.x, entity.vector.y);
			context.stroke();
		}
		, fits: function(entity){
			//console.log(entity);
			if(!entity) return false;
			var matches = Object.getOwnPropertyNames(entity).filter(function(name){
				return (name === "vector"
					|| name === "speed"
					|| name === "moveable");
			});
			return matches.length === 3;
		}
	}
	, automoveable: {
		execute: function(entity, entities){
			if(hittingLeftWall(entity)) entity.speed.x = Math.abs(entity.speed.x);
			if(hittingRightWall(entity)) entity.speed.x = -1 * entity.speed.x;
			if(hittingTopWall(entity)) entity.speed.y = Math.abs(entity.speed.y);
			if(hittingBottomWall(entity)) entity.speed.y = -1 * entity.speed.y;
			entity.vector.x += entity.speed.x * entity.speed.modifier;
			entity.vector.y += entity.speed.y * entity.speed.modifier;
		}
		, fits: function(entity){
			if(!entity) return false;
			var matches = Object.getOwnPropertyNames(entity).filter(function(name){
				return (name === "automove"
					|| name === "speed"
					|| name === "vector");
			});
			return matches.length === 3;
		}
	}
};
var interval = null;
document.body.appendChild(label);
document.body.appendChild(canvas);
interval = setInterval(function(){
	for(key in systems){
		var system = systems[key];
		var matched = [];
		for(name in entities){
			if(system.fits(entities[name])) matched.push(entities[name]);
		}
		matched.forEach(function(entity, i, list){
			system.execute(entity, list);
		});
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