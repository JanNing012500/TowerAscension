class room1 extends Phaser.Scene {

    constructor() {
        super('room1')
    }

    preload() {
        // Loads all our Images/tiles
        this.load.spritesheet('tiles', './assets/Ground-Sheet.png', 
            {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 6 });
        this.load.spritesheet('p1', './assets/Player01.png', 
            {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 19 });
        this.load.audio('jump', './assets/jump.wav'); 
        this.load.audio('music1','./assets/Music3.mp3');
        this.load.audio('nextlvlsfx','./assets/nextlvl.wav');
        
        ///door
        this.load.image('win1', './assets/Door.png');
    }

    create() { 
        // Load Audio 
        this.jumpsfx = this.sound.add('jump', {volume: .15}); 
        this.doorsfx = this.sound.add('nextlvlsfx', {volume : .2});
        this.backgroundMusic = this.sound.add("music1", {volume: .4, loop: true}); 
        this.backgroundMusic.play(); 

        // Variable to store the arrow key pressed
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        // Number of consecutive jumps made
        this.playerJumps = 0;

        // Create the player in the scene
        this.player = this.physics.add.sprite(baseUI*2, baseUI*18, 'p1', 0).setOrigin(0,0);

        // Add gravity to make it fall
        this.player.setGravityY(gameOption.playerGravity);

        //camera
        // this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
        // this.cameras.main.follow(this.player);

        //-----------------
        // Create the level
        //-----------------
        this.walls = this.add.group();
        this.spikes = this.add.group();

        this.level = [
            'xxxxxxxxxxxxxxxxxxxx', // 0
            'a                  b', // 1
            'a                  b', // 2
            'a               xxxb', // 3
            'a     x!x   x    xxb', // 4
            'a  x  xxx         xb', // 5
            'a                  b', // 6
            'ax                 b', // 7
            'a                  b', // 8
            'a  xx              b', // 9
            'a      xx  x       b', // 10
            'a      xx  xx      b', // 11
            'a      xx  xxxxx   b', // 12
            'a!!!!!!xx          b', // 13
            'axxxxxxxx          b', // 14
            'a                xxb', // 15
            'a                xxb', // 16
            'a           xx   xxb', // 17
            'a   xx!!xx       xxb', // 18
            'xxxxxxxxxxxxxxxxxxxx'  // 19
        ];

        // Create the level by going though the array
        for (var i = 0; i < this.level.length; i++) {
            for (var j = 0; j < this.level[i].length; j++) {
                // Ground tile
                if (this.level[i][j] == 'x') {
                    if(this.level[i][j+1] != 'x' && this.level[i][j+1] != 'b')
                        this.wall = this.physics.add.sprite(32*j, 32*i, 'tiles', 3).setOrigin(0,0);
                    else if (this.level[i][j-1] != 'x' && this.level[i][j-1] != 'a') 
                        this.wall = this.physics.add.sprite(32*j, 32*i, 'tiles', 4).setOrigin(0,0);
                    else 
                        this.wall = this.physics.add.sprite(32*j, 32*i, 'tiles', 2).setOrigin(0,0);
                    this.walls.add(this.wall);
                    this.wall.body.immovable = true;
                }
                // Left Wall
                else if (this.level[i][j] == 'a') {2, 
                    this.wall = this.physics.add.sprite(32*j, 32*i, 'tiles', 5).setOrigin(0,0);
                    this.walls.add(this.wall);
                    this.wall.body.immovable = true;
                }
                // Right Wall
                else if (this.level[i][j] == 'b') {
                    this.wall = this.physics.add.sprite(32*j, 32*i, 'tiles', 6).setOrigin(0,0);
                    this.walls.add(this.wall);
                    this.wall.body.immovable = true;
                }
                // Spikes
                else if (this.level[i][j] == '!') {
                    this.spike = this.physics.add.sprite(32*j, 32*i, 'tiles', 1).setOrigin(0,0);
                    this.spikes.add(this.spike);
                    this.spike.body.immovable = true;
                }
            }
        }
        this.door = this.physics.add.sprite(baseUI*18, baseUI*2, 'win1', 0).setOrigin(0,0);

        // set collision between the player and platform
        this.physics.add.collider(this.player, this.walls)

        //win door
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.door, this.ground);
    
        this.physics.add.overlap(this.player, this.door, function(){this.windoor1()},null,this);
    }

    update() {
        // Left and Right Movement
        if (keyLEFT.isDown){
            this.player.anims.play('leftWalk', true);
            dir = 1;
            this.player.setVelocityX(-200);
        }
        else if (keyRIGHT.isDown){
            this.player.anims.play('rightWalk', true);
            dir = -1;
            this.player.setVelocityX(200);
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
                this.jump();
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
            this.jumpsfx.play(); 
            this.playerJumps += 1;
        }
    }

    restart() {
        this.player.x = baseUI*2;
        this.player.y = baseUI*18;
    }

    windoor1()
    {      
        this.game.sound.stopAll(); 
        this.doorsfx.play();
        this.scene.stop();
        this.scene.start('room2');
    }   
} 