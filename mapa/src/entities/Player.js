// src/entities/Player.js

import { CONFIG } from "../config";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    /** @type {Phaser.type.Input.keyboard.CursorKeys} */
    cursors;

    touch;

    //Adicionada na aula de 8/Maio
    isAction = false;   // Diz se a tecla espaço de ação está pressionada


    constructor(scene, x, y, touch) {
        super(scene, x, y, 'player');

        this.touch = touch;

        scene.add.existing(this);           // criando a imagem que o jogador vê
        scene.physics.add.existing(this);   // criando o BODY da Física

        this.init();

    }


    init(){

        this.setFrame(3);

        this.speed = 120;
        this.frameRate = 8;
        this.direction ='down';
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.setOrigin(0, 0.5);

        this.body.setSize(14, 10); // Ajustando tamanho 
        this.body.setOffset(1, 22); // Recuo

        this.initAnimations();
        
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

        this.play('idle-right');
        //this.play('idle-left'); // novo

    }

    update(){
        const{ left, right, down, up , space} = this.cursors;  // pegar o espaço

        if (left.isDown ) {
            this.direction = 'left';  // novo 23-abr
            this.setVelocityX(-this.speed);

        }else if ( right.isDown ){
            this.direction = 'right'; // novo 23-abr
            this.setVelocityX(this.speed);
             
        }else {
            this.setVelocityX(0);
        }

        if (up.isDown ) {
            this.direction = 'up';
            this.setVelocityY(-this.speed);

        }else if ( down.isDown ){
            this.direction = 'down';
            this.setVelocityY(this.speed);
             
        }else {
            this.setVelocityY(0);
        }

        //Adicionada na aula de 8/Maio
        if (space.isDown ){
            this.isAction = true;
            //console.log("ESPAÇO")  // Testando quando aperta a tecla espaço
        }else{
            this.isAction = false;
        }

        //https://developer.mozilla.org/en-US/docs/Web/API/VideoColorSpace
        //Estava dando erro e não deixava executar no Firefox - tela preta
        /*if (VideoColorSpace.isDown){
            console.log("ESPAÇO");
        }*/

        // Mudar a animaçao 
        // Parou de andar , está parado

        if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {
            this.play ('idle-' + this.direction, true);
            //está em movimento
        }else{
            this.play('walk-' + this.direction, true);
        }

        // Fazer o Touch seguir o Player
        let tx, ty;
        let distance = 16;

        switch (this.direction){
            case 'down':
                tx = 0;
                ty = distance;
                break;
            case 'up':
                tx = 0;
                ty = -distance + CONFIG.TILE_SIZE;
                break;
            case 'right':
                tx = distance/2;
                ty = CONFIG.TILE_SIZE/2;
                break;
            case 'left':
                tx = -distance/2;
                ty = CONFIG.TILE_SIZE/2;
                break;
        }

        this.touch.setPosition(this.x + tx + CONFIG.TILE_SIZE/2, this.y + ty);
    }

    initAnimations(){
        // idle
        this.anims.create({
            key: 'idle-right',
            frames: this.anims.generateFrameNumbers('player', {
            start: 4, end: 9}),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'idle-left',
            frames: this.anims.generateFrameNumbers('player', {
            start: 16, end: 21}),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'idle-up',
            frames: this.anims.generateFrameNumbers('player', {
            start: 10, end: 15}),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'idle-down',
            frames: this.anims.generateFrameNumbers('player', {
            start: 22, end: 27}),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', {
            start: 28, end: 33}),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', {
            start: 40, end: 45}),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', {
            start: 34, end: 39}),
            frameRate: this.frameRate,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player', {
            start: 46, end: 51}),
            frameRate: this.frameRate,
            repeat: -1
        });

    }


}

// this.add.physics.sprite('imagem', x, y); // Usado para o coelho chamando a cena atual local
