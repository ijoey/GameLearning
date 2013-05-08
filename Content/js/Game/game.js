var Game = {};
Game.Entity = {};
Game.Event = {};
Game.Levels = [];
Game.Canvas = null;
Game.CanvasContext = null;
Game.LastTime = null;
Game.FrameRate = 1000; // frames per sec
Game.MainInterval = null;
Game.CurrentLevelIndex = -1;
Game.CurrentLevel = null;
Game.MonstersCaught = 0;
Game.Delta = 0;
Game.KeysDown = [];
Game.MinX = 34;
Game.MaxX = 448;
Game.MinY = 55;
Game.MaxY = 457;

Game.BindKeys = function () {
    addEventListener("keydown", function (e) {
        Game.KeysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
		//Game.KeysDown.splice(e.keyCode, 1);
		delete Game.KeysDown[e.keyCode];
    }, false);
};

Game.DependentScripts = ['Content/js/Game/game.entity.js','Content/js/Game/game.event.js'];
require(Game.DependentScripts, function() { Game.Event.Start(); });