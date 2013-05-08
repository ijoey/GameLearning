Game.Entity.Direction = {
    Up: 1,
    Right: 2,
    Down: 3,
    Left: 4   
};

Game.Entity.LevelDefinition = function(src, numMonsters, goal, heroSpeed, monsterSpeed) {
    this.Background = 'Content/img/Levels/' + src;
    this.NumMonsters = numMonsters;
    this.HeroSpeed = heroSpeed;
    this.KillGoal = goal;
    this.MonsterSpeed = monsterSpeed;
};

Game.Entity.Levels = 
[
    new Game.Entity.LevelDefinition('green.png', 1, 5, 256, .5),
    new Game.Entity.LevelDefinition('blue.png', 2, 5, 256, 2),
    new Game.Entity.LevelDefinition('orange.png', 3, 5, 256, 3)
];

Game.Entity.Projectile = function(direction, speed, x, y) {
    var self = this;

    this.X = x;
    this.Y = y;
    this.Interval = null;
    this.Image = null;
    this.Ready = false;
    this.VerticalImg = 'Content/img/BulletVer.png';
    this.HorizontalImg = 'Content/img/BulletHor.png';
    this.Speed = speed;
    this.ImageSrc = [Game.Entity.Direction.Up, Game.Entity.Direction.Down].indexOf(this.Direction) > -1 ? this.VerticalImg : this.HorizontalImg;

    this.Direction = direction;

    this.Load = function() {
        self.Image = new Image();
        self.Image.onload = function () { 
            self.Ready = true;
        };
        self.Image.src = self.ImageSrc;

        var execDelay = Game.FrameRate / 100;
        self.Interval = setInterval(self.Move, execDelay);
        return self;
    };

    this.Reset = function (x, y) {
        self.X = x;
        self.Y = y;
    };

    this.Move = function() {

        var speed = self.Speed * Game.Delta;

        switch(self.Direction)
        {
            case Game.Entity.Direction.Up:
                self.Y -= speed;
            break;
            case Game.Entity.Direction.Right:
                self.X += speed;
            break;
            case Game.Entity.Direction.Down:
                self.Y += speed;
            break;
            case Game.Entity.Direction.Left:
                self.X -= speed;
            break;
        }
    };
};

Game.Entity.Monster = function (speed) {
    var self = this;
    this.LastTime = null;
    this.XSpeed = speed;
    this.YSpeed = speed;
    this.X = 0;
    this.Y = 0;
    this.Ready = false;
    this.ImageSrc = 'Content/img/monster.png';
    this.Image = null;
    this.Damage = 10;

    this.Interval = null;

    this.Load = function() {
        self.Image = new Image();
        self.Image.onload = function () {
            self.Ready = true;
        };
        self.Image.src = self.ImageSrc;

        var execDelay = Game.FrameRate / 100;
        self.Interval = setInterval(self.Move, execDelay);
        return self;
    };

    this.Reset = function (x, y) {
        self.X = x;
        self.Y = y;
    };

    this.Move = function() {

        if((self.XSpeed > 0 && self.X >= Game.MaxX - 16) || (self.XSpeed < 0 && self.X <= Game.MinX))
            self.XSpeed = self.XSpeed * -1;

        if((self.YSpeed < 0 && self.Y >= Game.MaxY - 16) || (self.YSpeed > 0 && self.Y <= Game.MinY))
            self.YSpeed = self.YSpeed * -1;

        self.X += self.XSpeed * Game.Delta;
        self.Y -= self.YSpeed * Game.Delta;
    };
};


Game.Entity.Hero = function (speed) {
    var self = this;
    this.Speed = speed;
    this.X = Game.Canvas.width / 2;
    this.Y = Game.Canvas.height / 2;
    this.Ready = false;
    this.ImageSrc = 'Content/img/hero.png';
    this.Image = null;
    this.Direction = Game.Entity.Direction.Down;
    this.Health = 100;
    this.Projectiles = [];

    this.Fire = function() {
        this.Projectiles.push((new Game.Entity.Projectile(self.Direction, 2, self.X, self.Y)).Load());
    };

    this.TakeDamage = function(damage) {
        damage = damage > self.Health ? self.Health : damage;
        self.Health -= damage;
    };

    this.Load = function () {
        self.Image = new Image();
        self.Image.onload = function () {
            self.Ready = true;
        };
        self.Image.src = self.ImageSrc;
        return self;
    };

    this.Reset = function (x, y) {
        self.X = x;
        self.Y = y;
    };
};

Game.Entity.Level = function(lvlDef) {
    var self = this;
    this.BackgroundImageSrc = '';
    this.Background = null;
    this.Ready = false;
    this.Definition = lvlDef;

    this.Hero = null;
    this.Monsters = [];
    this.TotalMonsters = self.Definition.NumMonsters;
    this.KillGoal = self.Definition.KillGoal;
    this.MonsterSpeed = self.Definition.MonsterSpeed;

    this.SetBackground = function(src) {
        self.BackgroundImageSrc = src;
        self.Background = new Image();
        self.Background.onload = function () {
            self.Ready = true;
        };
        self.Background.src = self.BackgroundImageSrc;
    };

    this.Load = function() {
        self.SetBackground(self.Definition.Background);
        self.Hero = (new Game.Entity.Hero(self.Definition.HeroSpeed)).Load();
        while(self.Definition.NumMonsters--){
            self.Monsters.push((new Game.Entity.Monster(self.MonsterSpeed)).Load());
        }

        return self;
    };

    return this.Load();
};