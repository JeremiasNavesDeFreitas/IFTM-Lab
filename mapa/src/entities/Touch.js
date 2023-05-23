// entities/Touch.js

import { CONFIG } from "../config";

export default class Touch extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y);
    

    scene.add.existing(this); // coloca o elemento na tela
    scene.physics.add.existing(this); // coloca na physics

    this.init();

    }

    init(){
        this.body.setSize(CONFIG.TILE_SIZE/2, CONFIG.TILE_SIZE/2);
    }

}

