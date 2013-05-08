Game.Event.Start = function () {
    if(Game.Entity.Levels.length == 0)
    {
        alert('No Levels Loaded!!!');
        return;
    }
    Game.Levels = Game.Entity.Levels;
    Game.Event.Load();
    Game.Event.NextLevel();

    Game.Event.Reset();
    Game.LastTime = Date.now();
    var execDelay = Game.FrameRate / 1000;
    Game.MainInterval = setInterval(Game.Event.Loop, execDelay);
};

Game.Event.Loop = function() {
    var now = Date.now();
    var delta = now - Game.LastTime;
    Game.Delta = delta;
    Game.Event.Update(delta / 1000);
    Game.Event.Render();
    Game.LastTime = now;
};

Game.Event.Load = function() {
    var canvas = document.createElement('canvas');
    Game.CanvasContext = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 525;
    document.body.appendChild(canvas);
    Game.Canvas = canvas;
    Game.BindKeys();
};

Game.Event.Update = function (modifier) {
    var heroSpeed = Game.CurrentLevel.Hero.Speed;
    if (38 in Game.KeysDown && Game.CurrentLevel.Hero.Y > Game.MinY) { // Player holding up
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

Game.Event.Render = function() {
    var i = 0;
    var lvl = Game.CurrentLevel;
    if (lvl.Ready) {
        Game.CanvasContext.drawImage(Game.CurrentLevel.Background, 0, 0);
    }

    if (Game.CurrentLevel.Hero.Ready) {
        Game.CanvasContext.drawImage(Game.CurrentLevel.Hero.Image, Game.CurrentLevel.Hero.X, Game.CurrentLevel.Hero.Y);
    }

    var projectile = null;
    i = Game.CurrentLevel.Hero.Projectiles.length;
    while(i--)
    {
        projectile = Game.CurrentLevel.Hero.Projectiles[i];
        if(projectile.Ready) {
            Game.CanvasContext.drawImage(projectile.Image, projectile.X, projectile.Y);
        }
    }

    var monster = null;
    i = Game.CurrentLevel.TotalMonsters;
    while(i--)
    {
        monster = Game.CurrentLevel.Monsters[i];
        if (monster.Ready) {
            Game.CanvasContext.drawImage(monster.Image, monster.X, monster.Y);
        }
    }

    // Score
    Game.CanvasContext.fillStyle = 'rgb(250, 250, 250)';
    Game.CanvasContext.font = '20px Helvetica';
    Game.CanvasContext.textAlign = 'left';
    Game.CanvasContext.textBaseline = 'top';

    // var text = 'X: ' + Game.CurrentLevel.Hero.X.toString() + '; Y:' + Game.CurrentLevel.Hero.Y + ';';
    // text += 'MonsterX: ' + Game.CurrentLevel.Monsters[0].X + '; Y: ' + Game.CurrentLevel.Monsters[0].Y + ';';
    var text = 'Level: ' + (Game.CurrentLevelIndex + 1) + '.  Monsters caught: ' + Game.MonstersCaught + '.  Health: ' + Game.CurrentLevel.Hero.Health + '.';
    Game.CanvasContext.fillText(text, 0, 0);
};

Game.Event.Reset  = function () {
    // Place hero in center of canvas
    // Game.CurrentLevel.Hero.X = Game.Canvas.width / 2;
    // Game.CurrentLevel.Hero.Y = Game.Canvas.height / 2;

    // Throw the monsters somewhere on the screen randomly
    var i = Game.CurrentLevel.TotalMonsters;
    while(i--)
    {
       Game.CurrentLevel.Monsters[i].X = 32 + (Math.random() * (Game.Canvas.width - 64));
        Game.CurrentLevel.Monsters[i].Y = 32 + (Math.random() * (Game.Canvas.height - 64));    
    }
};

Game.Event.NextLevel = function() {
    Game.CurrentLevelIndex++;
    Game.MonstersCaught = 0;

    if(Game.CurrentLevelIndex >= Game.Levels.length)
        return Game.Event.Win();

    Game.CurrentLevel = new Game.Entity.Level(Game.Levels[Game.CurrentLevelIndex]);
};

Game.Event.Win = function() {
    return;
    // alert('you win!!!');
    // window.location.reload();
};
