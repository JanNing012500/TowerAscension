/*
Team Member: Neo Zhang, Sam Luyen, Jan Ning
Title: 
Completion Data: 
Creative Tilt:

*/

var config = {
    type: Phaser.AUTO, 
    width: 640,
    height: 640,
    parent: 'phaser-game',
    scene: [Menu],
    physics: {
        default: 'arcade',
        arcade: {debug:true} // change false to make the pink lines go away
    }
};
let game = new Phaser.Game(config);

// set UI size
let baseUI = 32;


// Keybindings
let keySPACE; 