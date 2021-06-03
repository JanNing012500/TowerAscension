class room6 extends Phaser.Scene {
 
    constructor() {
        super('room6') //Template Room
    }
 
    preload() {
        this.load.audio('music2','./assets/Music2.mp3');
        this.load.audio('bounce','./assets/SpringBounceSFX.wav');
    }
 
    create() { 
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 20; j++) {
                this.add.sprite(baseUI*j, baseUI*i, 'towerwall', 0)
            }
        }
        // Load Audio 
        this.springsfx = this.sound.add('bounce',{volume: .25});
        this.jumpsfx = this.sound.add('jump', {volume: .15}); 
        this.doorsfx = this.sound.add('nextlvlsfx', {volume : .2});
        this.LoseFx = this.sound.add('Lose', {volume : .3});
        this.backgroundMusic = this.sound.add("music2", {volume: .4, loop: true}); 
        this.backgroundMusic.play(); 
;
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
 
        // Number of consecutive jumps made
        this.playerJumps = 0;
 
        // Create the player in the scene
        this.player = this.physics.add.sprite(baseUI*2, baseUI*18, 'p1', 0).setOrigin(0,0);
 
        // Add gravity to make it fall
        this.player.setGravityY(gameOption.playerGravity);

         // Create a Timer Window on the top Corner
         this.playerScore = 0; 
         let scoreConfig = {
             fontFamily: 'Courier',
             fontSize: '28px',
             color: '#843605',
             align: 'right',
             padding: {
             top: 5,
             bottom: 5,
             },
             fixedWidth: 100
         }
         this.scoreLeft = this.add.text(game.config.width - 100, game.config.height - 595, gameOption.finalScore, scoreConfig).setOrigin(5.5,0.5);
 
         // Timer for Game
         this.timer = this.time.addEvent({
             delay: 1000,
             callback: this.addTime,
             callbackScope: this,
             loop: true
         })    
 
        this.level = [
            'axxxxxxxxxxxxxxxxxxb', // 0
            'a                xxb', // 1
            'a                 xb', // 2
            'ad                 b', // 3
            'axx!!!!x           b', // 4
            'axxxxxxx           b', // 5
            'a      xx          b', // 6
            'a                  b', // 7
            'a                  b', // 8
            'a            xx    b', // 9
            'a    xx            b', // 10
            'a                  b', // 11
            'a              xx  b', // 12
            'a    xx            b', // 13
            'a                  b', // 14
            'a         xx       b', // 15
            'a                  b', // 16
            'a   d              b', // 17
            'a   x!!!!!!!!!!!!!!b', // 18
            'axxxxxxxxxxxxxxxxxxb'  // 19
        ];
 
        //-----------------
        // Create the level
        //-----------------
        this.walls = this.add.group();
        this.spikes = this.add.group();
        this.jumps = this.add.group();
        
        // Create the level by going though the array
        for (var i = 0; i < this.level.length; i++) {
            for (var j = 0; j < this.level[i].length; j++) {
                // Ground tile
                if (this.level[i][j] == 'x') {
                    // If there is no platform on the right or left
                    if (this.level[i][j+1] != 'x' && this.level[i][j+1] != 'b' && this.level[i][j-1] != 'x' && this.level[i][j-1] != 'a')
                        if (this.level[i+1][j] != 'x' && this.level[i-1][j] != 'x')
                            this.wall = this.physics.add.sprite(baseUI*j, baseUI*i, 'tiles', 8).setOrigin(0,0);
                        else if (this.level[i][j-1] == ' ' && this.level[i][j+1] != ' ')
                            this.wall = this.physics.add.sprite(baseUI*j, baseUI*i, 'tiles', 7).setOrigin(0,0);
                        else if (this.level[i][j+1] == ' ' && this.level[i][j-1] != ' ')
                            this.wall = this.physics.add.sprite(baseUI*j, baseUI*i, 'tiles', 6).setOrigin(0,0);
                        else
                            this.wall = this.physics.add.sprite(baseUI*j, baseUI*i, 'tiles', 2).setOrigin(0,0);
                    // If there is no platform on the right
                    else if (this.level[i][j+1] != 'x' && this.level[i][j+1] != 'b')
                        if (this.level[i-1][j] == 'x')
                            this.wall = this.physics.add.sprite(baseUI*j, baseUI*i, 'tiles', 5).setOrigin(0,0);
                        else
                            this.wall = this.physics.add.sprite(baseUI*j, baseUI*i, 'tiles', 6).setOrigin(0,0);
                    else if (this.level[i][j-1] != 'x' && this.level[i][j-1] != 'a')
                        if (this.level[i-1][j] == 'x')
                            this.wall = this.physics.add.sprite(baseUI*j, baseUI*i, 'tiles', 4).setOrigin(0,0);
                        else
                            this.wall = this.physics.add.sprite(baseUI*j, baseUI*i, 'tiles', 7).setOrigin(0,0);
                    else if (i < 19 && i > 1 && this.level[i-1][j] != ' ' && (this.level[i][j+1] == 'x' || this.level[i][j-1] == 'x' || this.level[i+1][j] == 'x'))
                        this.wall = this.physics.add.sprite(baseUI*j, baseUI*i, 'tiles', 3).setOrigin(0,0);
                    // Regular floor tile
                    else
                        if (i > 1 && this.level[i-1][j] != ' ')
                            this.wall = this.physics.add.sprite(baseUI*j, baseUI*i, 'tiles', 3).setOrigin(0,0);
                        else
                            this.wall = this.physics.add.sprite(baseUI*j, baseUI*i, 'tiles', 2).setOrigin(0,0);
                    this.walls.add(this.wall);
                    this.wall.body.immovable = true;
                }
                // Left Wall
                else if (this.level[i][j] == 'a') { 
                    this.wall = this.physics.add.sprite(32*j, 32*i, 'tiles', 9).setOrigin(0,0);
                    this.walls.add(this.wall);
                    this.wall.body.immovable = true;
                }
                // Right Wall
                else if (this.level[i][j] == 'b') {
                    this.wall = this.physics.add.sprite(32*j, 32*i, 'tiles', 10).setOrigin(0,0);
                    this.walls.add(this.wall);
                    this.wall.body.immovable = true;
                }
                // Spikes
                else if (this.level[i][j] == '!') {
                    this.spike = this.physics.add.sprite(32*j, 32*i, 'tiles', 1).setOrigin(0,0);
                    this.spikes.add(this.spike);
                    this.spike.body.immovable = true;
                }
                // Springs
                else if (this.level[i][j] == 'e') {
                    let JumpUP = this.physics.add.sprite(32*j, 32*i, 'extraJump', 0).setOrigin(0,0);
                    this.physics.add.overlap(this.player, JumpUP, function(){ 
                        JumpUP.anims.play('jumpPU', true);
                        this.springsfx.play();
                        gameOption.jumpForce = 400;
                        
                        this.jump();
                        gameOption.jumpForce = 325;}, 
                    null, this);
                    this.jumps.add(JumpUP);
                }
                 // door
                 else if (this.level[i][j] == 'd') {
                    this.door = this.physics.add.sprite(32*j, 32*i, 'tiles', 11).setOrigin(0,0);
                    this.physics.add.overlap(this.player, this.door, function(){this.windoor()},null,this);
                }
            }
        }
        
        // set collision between the player and platform
        this.physics.add.collider(this.player, this.walls);

        //win door
        this.cursors = this.input.keyboard.createCursorKeys();
    }
 
    update() {
        // Left and Right Movement
        if (keyLEFT.isDown){
            this.player.anims.play('leftWalk', true);
            dir = 1;
            this.player.setVelocityX(-1 * gameOption.speed);
        }
        else if (keyRIGHT.isDown){
            this.player.anims.play('rightWalk', true);
            dir = -1;
            this.player.setVelocityX(gameOption.speed);
        }
        else {
            if (dir == 1)
                this.player.anims.play('leftIdle', true);
            if (dir == -1)
                this.player.anims.play('rightIdle', true);
            this.player.body.velocity.x = 0;
        }  

        this.physics.overlap(this.player, this.spikes, function(){ this.restart() }, null, this);

        if (keySPACE.isDown) {
            if (!flip) {
                if (this.jump() == 1)
                    this.jumpsfx.play(); 
                flip = true;
            }
        }
        if (keySPACE.isUp)
            flip = false;
    }
    
    jump() {
        // Make the player jump if only they are touching the ground
        if(this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOption.jumps)){
            if(this.player.body.touching.down){
                this.playerJumps = 0;
            }
            this.player.setVelocityY(gameOption.jumpForce * -1);
            this.playerJumps += 1;
            return 1;
        }
        return 0;
    }
 
    restart() {
        this.LoseFx.play(); 
        this.player.x = baseUI*2;
        this.player.y = baseUI*17;
        this.player.body.velocity.y = 0;
    }
 
    windoor()
    {      
        this.game.sound.stopAll(); 
        this.doorsfx.play();
        this.scene.remove('room6');
        this.scene.start('room2'); 
    }   

    addTime() {
        gameOption.finalScore += 1; 
        this.scoreLeft.text = gameOption.finalScore;
        console.log(gameOption.finalScore); 
    }
} 
 
 
 
 

