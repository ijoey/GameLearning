var App = function(window){
	var self = this;
    var _lastTime = Date.now();
	var _frameRate = 1000;	
	var _interval = null;
	var _currentLevelIndex = -1;
	var _caughtMonsters = 0;
	var _delta = 0;
	var _keysDown = [];
	var _minX = 34;
	var _maxX = 448;
	var _minY = 55;
	var _maxY = 457;
	var _canvas = document.createElement('canvas');	
	var _levels = [];
	_levels.push(new Level(1, 5, 256, .5));
	_levels.push(new Level(2, 5, 256, 2))
	_levels.push(new Level(3, 5, 256, 3))
	
	var _levelController = null;
	var _hero = new Hero();
	var _heroController = null;
	var _keys = [];
	this.init = function(){
		_levelController = new LevelController(_levels, this);
		_heroController = new HeroController(_hero, this);
		_heroController.load_view(_canvas);
		_levelController.controllers.push(_heroController);
		_heroController.model.position = {x: _canvas.width /2, y: _canvas.height / 2};
		var levelView = _levelController.load_view(_canvas);
	    document.body.appendChild(levelView.container);
		window.addEventListener("keydown", this, false);
		window.addEventListener("keyup", this, false);
	    _interval = setInterval(function(){
	    	self.tick();
	    }, _frameRate / 1000);
	};
	this.handleEvent = function(e){
		if(e.type === "keydown"){
			_keys[e.keyCode] = true;
		}else if(e.type === "keyup"){
			delete _keys[e.keyCode];
		}
	};
	this.tick = function(){
	    var now = Date.now();
	    _delta = now - _lastTime;
		var modifier = _delta / 1000;
		_levelController.update(_keys, modifier);
	    _lastTime = now;
	};
	this.goto = function(i){
		_currentLevel = _levels[i];
	    _caughtMonsters = 0;
		// reset game
	    var i = _currentLevel.TotalMonsters;
	    while(i--){
	       _currentLevel.Monsters[i].X = 32 + (Math.random() * (_canvas.width - 64));
	       _currentLevel.Monsters[i].Y = 32 + (Math.random() * (_canvas.height - 64));    
	    }
	};
	this.update = function(modifier){
		var position = _heroController.model.position;
	    if (38 in _keysDown && _heroController.model.position.y > _levelController.model.min.y) { // Player holding up
	        Game.CurrentLevel.Hero.Y -= heroSpeed * modifier;
	    }

	    if (40 in Game.KeysDown && Game.CurrentLevel.Hero.Y < Game.MaxY) { // Player holding down
	        Game.CurrentLevel.Hero.Y += heroSpeed * modifier;
	    }

	    if (37 in Game.KeysDown && Game.CurrentLevel.Hero.X > Game.MinX) { // Player holding left
	        Game.CurrentLevel.Hero.X -= heroSpeed * modifier;
	    }

	    if (39 in Game.KeysDown && Game.CurrentLevel.Hero.X < Game.MaxX) { // Player holding right
	        Game.CurrentLevel.Hero.X += heroSpeed * modifier;
	    }

	    if(32 in Game.KeysDown) { // space = fire
	        Game.CurrentLevel.Hero.Fire();
	    }

	    var caughtMonster = false;

	    var i = Game.CurrentLevel.TotalMonsters;
	    while(i--)
	    {
	        var monster = Game.CurrentLevel.Monsters[i];
	        // Are they touching?
	        if (
	            Game.CurrentLevel.Hero.X <= (monster.X + 32)
	            && monster.X <= (Game.CurrentLevel.Hero.X + 32)
	            && Game.CurrentLevel.Hero.Y <= (monster.Y + 32)
	            && monster.Y <= (Game.CurrentLevel.Hero.Y + 32)
	        ) {
	            Game.CurrentLevel.Hero.TakeDamage(monster.Damage);
	            ++Game.MonstersCaught;
	            caughtMonster = true;
	        }
	    }

	    if(Game.MonstersCaught == Game.CurrentLevel.KillGoal)
	    {
	        Game.Event.NextLevel();
	        Game.Event.Reset();
	        return;
	    }

	    if(caughtMonster)
	        Game.Event.Reset();
	};
	return this;
};
require(['Content/js/mvc.js', 'Content/js/joey/model.js','Content/js/joey/controller.js','Content/js/joey/view.js'], function(){
	App(window).init();
});
