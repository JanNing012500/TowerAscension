var flip = false, flop = false, pause = true, clickF = 0;
var dir = 1;

class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        pause = true;
        this.load.image('ground', './assets/Ground.png');
        this.load.image('grass', './assets/GrassGround.png');
        this.load.image('sign', './assets/WoodenSign.png');
        this.load.image('control', './assets/ControlWindow.png');
        this.load.image('background', './assets/Background.png');
        this.load.image('tower', './assets/Tower.png');
        this.load.image('gate', './assets/Gate.png');
        
        this.load.spritesheet('p1', './assets/Player01.png', 
            {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 19 });
        this.load.spritesheet('tiles', './assets/Ground-Sheet.png', 
            {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 6 });
        this.load.spritesheet('pressF', './assets/PressF.png', 
            {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1 });
        this.load.spritesheet('pressSpace', './assets/PressSpace.png', 
            {frameWidth: 160, frameHeight: 32, startFrame: 0, endFrame: 1 });
        
        this.load.audio('jump', './assets/jump.wav'); 
        this.load.audio('music','./assets/Music3.mp3');
        this.load.image('door', './assets/Door.png');
    }

    create() {
        this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0,0);
        this.tower = this.add.sprite(0, 0, 'tower').setOrigin(0,0);
  
        // Load Audio 
        this.jumpsfx = this.sound.add('jump', {volume: .5}); 
        this.backgroundMusic = this.sound.add("music", {volume: .5, loop: true}); 
        this.backgroundMusic.play(); 
        // Variable to store the arrow key pressed
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        //-----------------
        // Create the level
        //-----------------
        this.ground = this.add.group();
        this.level = [
            '                    ', // 0
            '                    ', // 1
            '                    ', // 2
            '                    ', // 3
            '                    ', // 4
            '                    ', // 5
            '                    ', // 6
            '                    ', // 7
            '                    ', // 8
            '                    ', // 9
            '                    ', // 10
            '                    ', // 11
            '                    ', // 12
            '                    ', // 13
            '                    ', // 14
            '                    ', // 15
            '                    ', // 16
            '                    ', // 17
            '                    ', // 18
            'gggggggggggggggggggg'  // 19
        ];
        // Create the level by going though the array
        for (var i = 0; i < this.level.length; i++) {
            for (var j = 0; j < this.level[i].length; j++) {
                if (this.level[i][j] == 'g') {
                    this.floor = this.physics.add.sprite(32*j, 32*i, 'tiles', 0).setOrigin(0,0);
                    this.ground.add(this.floor);
                    this.floor.body.immovable = true;
                }
            }
        }

        this.sign = this.physics.add.sprite(baseUI*5, baseUI*18, 'sign');
        this.door = this.physics.add.sprite(baseUI*10, baseUI*16, 'gate');
        this.control = this.add.sprite(baseUI*10, baseUI*10, 'control').setOrigin(0.5, 0.5);
        this.control.alpha = 0;

        // Animation config
        // Left Idle
        this.anims.create({
            key: 'leftIdle',
            frames: this.anims.generateFrameNumbers('p1', { start: 0, end: 3, first: 0 }),
            frameRate: 10
        })
        // Right Idle
        this.anims.create({
            key: 'rightIdle',
            frames: this.anims.generateFrameNumbers('p1', { start: 4, end: 7, first: 4 }),
            frameRate: 10
        })
        // Left Walk
        this.anims.create({
            key: 'leftWalk',
            frames: this.anims.generateFrameNumbers('p1', { start: 8, end: 11, first: 8 }),
            frameRate: 10
        })
        // Right Idle
        this.anims.create({
            key: 'rightWalk',
            frames: this.anims.generateFrameNumbers('p1', { start: 12, end: 15, first: 12 }),
            frameRate: 10
        })
        this.anims.create({
            key: 'interact',
            frames: this.anims.generateFrameNumbers('pressF', { start: 0, end: 1, first: 0 }),
            frameRate: 1
        })
        this.anims.create({
            key: 'space',
            frames: this.anims.generateFrameNumbers('pressSpace', { start: 0, end: 1, first: 0 }),
            frameRate: 1
        })

        // Number of consecutive jumps made
        this.playerJumps = 0;

        // Create the player in the middle of the Menu Screen.
        this.player = this.physics.add.sprite(baseUI*2, baseUI*18, 'p1', 0).setOrigin(0,0);

        // Add gravity to make it fall
        this.player.setGravityY(gameOption.playerGravity);

        // set collision between the player and platform
        this.physics.add.collider(this.player, this.ground)

        // The two button
        this.press1 = this.add.sprite(baseUI*4.5, baseUI*16.5, 'pressF', 0).setOrigin(0,0);
        this.press2 = this.add.sprite(baseUI*7.5, baseUI*15.5, 'pressSpace', 0).setOrigin(0,0);
    }
        
    update() {
        this.press1.alpha = 0;
        this.press2.alpha = 0;
        this.sky.tilePositionX += 2;
        this.physics.overlap(this.player, this.sign, function() { this.signtrigger() }, null, this);
        this.physics.overlap(this.player, this.door, function() { this.doortrigger() }, null, this);
        if (pause) {
            // Left and Right Movement
            if (keyLEFT.isDown && this.player.x > 0){
                this.player.anims.play('leftWalk', true);
                dir = 1;
                this.player.setVelocityX(-200);
            }
            else if (keyRIGHT.isDown && this.player.x < game.config.width - this.player.width){
                this.player.anims.play('rightWalk', true);
                dir = -1;
                this.player.setVelocityX(200);
            }
            else {
                if (dir == 1)
                    this.player.anims.play('leftIdle', true);
                if (dir == -1)
                    this.player.anims.play('rightIdle', true);
                this.player.setVelocityX(0);
            }  
            if (keySPACE.isDown) {
                if (!flip) {
                    this.jump();
                    flip = true;
                }
            }
            if (keySPACE.isUp)
                flip = false;
        }
    }

    signtrigger() {
        this.press1.anims.play('interact', true);
        this.press1.alpha = 1;
        if (keyF.isDown) {
            if (!flop) {
                if (clickF == 0) {
                    this.player.setVelocityX(0);
                    pause = false;
                    this.control.alpha = true;
                    clickF = 1;
                }
                else if (clickF == 1) {
                    pause = true;
                    this.control.alpha = false;
                    clickF = 0;
                }
                flop = true;
            }
        }
        if (keyF.isUp) {
            flop = false;
        }
    }

    doortrigger() {
        this.press2.anims.play('space', true);
        this.press2.alpha = 1;
        if (keySPACE.isDown) {
            this.game.sound.stopAll(); 
            this.scene.stop();
            console.log("Entering Door");
            pause = false;
            this.scene.start('room1');
        }
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
}