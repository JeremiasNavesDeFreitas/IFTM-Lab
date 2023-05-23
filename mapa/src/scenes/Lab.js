// src/scenes/Lab.js
import {Scene} from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";
import Touch from "../entities/Touch";

export default class Lab extends Scene {

    /** @type {Phaser.Tilemaps.Tilemap} */
    map;
    layers = {};


    /** @type {Player}*/
    player;
    touch;

    // adicionado aula de 8/maio
    /** @type {Phaser.Physics.Arcade.Group} */
    groupObjects;

    //Adicionada na aula de 8/Maio
    isTouching = false; 


    constructor(){
        super('Lab'); // Salvando o nome desta cena

    }

    preload(){
        // carregar os dados do mapa
        this.load.tilemapTiledJSON('tilemap-lab-info', './sala.tmj');

        // carregar os tilesets do map (as imagens)
        this.load.image('Office', './Tiles/tiles_office.png');
        this.load.image('Floors', './Tiles/tiles_floors.png');
        this.load.image('Walls', './Tiles/tiles_walls.png');

        // importando um spritesheet
        this.load.spritesheet('player', 'Jerry.png', {
            frameWidth: CONFIG.TILE_SIZE,
            frameHeight: CONFIG.TILE_SIZE * 2 // ocupa 2 tiles = 16 x 16*2 
        })

    }

    create(){
        this.createMap();
        this.createLayers();
        this.createObjects();   // adicionado aula de 8/maio
        this.createPlayer();

        //this.player = new Player(this, 144, 90);
        
        this.createCamera();
        this.createColliders();

    }

    update(){

    }

    createPlayer(){

        this.touch = new Touch(this, 16*8, 16*5);

        this.player = new Player(this, 16*8, 16*5, this.touch);
        this.player.setDepth( 3 );
    }

    createMap(){
        this.map = this.make.tilemap({
            key: 'tilemap-lab-info',    // Dados JSON do mapa
            tileWidth: CONFIG.TILE_SIZE,
            tileHeight: CONFIG.TILE_SIZE
        });

        // Fazendo a correspondencia entre as imagens usadas no Tiled
        // e as carregadas pelo Phaser
        // addTilesetImage(nome da imagem no Tiled 
        //

        this.map.addTilesetImage('tiles_office', 'Office');
        this.map.addTilesetImage('tiles_floors', 'Floors');
        this.map.addTilesetImage('tiles_walls', 'Walls');

    }

    createLayers(){
        // pegando os tilesets (usar os nomes dados no Tiled)
        const tilesOffice = this.map.getTileset('tiles_office');
        const tilesWalls = this.map.getTileset('tiles_walls');
        const tilesFloors = this.map.getTileset('tiles_floors');

        const layerNames = this.map.getTileLayerNames();
        //console.log(layerNames);
        for (let i = 0; i < layerNames.length; i++) {
            const name = layerNames[i];

            //this.map.createLayer(name, [tilesOffice], 0, 0); // retirado na aula
            this.layers[name] = this.map.createLayer(name, [tilesOffice, tilesFloors, tilesWalls], 0, 0);
           
            
            // Definindo a profundidade de cada camada
            this.layers[name].setDepth( i );
           

            // Verificando se o layer possui colisão 
            if ( name.endsWith('Collision') ){
                this.layers[name].setCollisionByProperty({ collide: true}); // Mesmo nome colocado na propriedade (custom properties)

                if ( CONFIG.DEBUG_COLLISION ) {
                    const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(i);
                    this.layers[name].renderDebug(debugGraphics, {
                        tileColor: null, // Color of non-colliding tiles
                        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
                    });
                }
            }
       }
    }


    // adicionado na aula de 8/maio => criar um grupo para o objeto
    createObjects(){
        this.groupObjects = this.physics.add.group();

        // Criando sprites para cada objeto que vier da camada de objetos do Tiled
        // Parametros: nome da camada no Tiles, Propriedades de seleçao
        const objects = this.map.createFromObjects("Objetos", {
            name: "cadeira",
            // Qual imagem será carregada no sprite (SE HOUVER)
            // key: "player"  // Define a imagem a ser colocada no objeto
        });

        // Tornando todos os objetos, Sprites com Physics (que possuem body)
        this.physics.world.enable(objects);


        for (let i = 0; i < objects.length; i++) {
            // Pegando o objeto atual
            const obj = objects[i];
            // Pegando as informações do Objeto definidas no Tiled
            const prop = this.map.objects[0].objects[i];
            //console.log(prop);

            obj.setDepth(this.layers.length+1); // Cadeira ficou preta, falta definir uma imagem
            obj.setVisible(false); // Tornando o objeto invisivel

            this.groupObjects.add( obj );

            console.log(obj);

        }

    }
    

    createLayersManual(){
        // pegando os tilesets
        const tilesOffice = this.map.getTileset('tiles_office');
        const tilesWalls = this.map.getTileset('tiles_walls');
        const tilesFloors = this.map.getTileset('tiles_floors');


        // Inserindo os layers manualmente
        //(Nome da Camada, vetor de tiles usados pra montar esta camada
        // posicao x da camada, posiçao y da camada)
        this.map.createLayer('Base', [tilesFloors, tilesWalls], 0, 0);
       
        this.map.createLayer('Nivel1', [tilesFloors, tilesWalls, tilesOffice], 0, 0);

        this.map.createLayer('Nivel2', [tilesOffice], 0, 0);
        this.map.createLayer('Nivel3', [tilesOffice], 0, 0);
        this.map.createLayer('Nivel4', [tilesOffice], 0, 0);

    }

    createCamera() {

        const mapWidth = this.map.width * CONFIG.TILE_SIZE;
        const mapHeight = this.map.height * CONFIG.TILE_SIZE;

        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.player);

    }

    createColliders(){
        // Diferença COLLIDER x OVERLAP
        // COLLIDER: colide e impede a passagem
        // OVERLAP: detecta a sobreposição dos elementos, não impede a passagem

        // Criando colisão entre o Player e as camadas de colisao do Tiled
        const layerNames = this.map.getTileLayerNames();
        for (let i = 0; i < layerNames.length; i++) {
            const name = layerNames[i];

            if ( name.endsWith('Collision') ){
                this.physics.add.collider(this.player, this.layers[name]);
            }
        }

        // Criar a colisão entre a "Mãozinha" do Player (TOUCH) e os 
        // objetos da camada de Objetos
        // Chama a função this.handleTouch toda vez que o this.touch
        // entrar em contato com um objeto do this.groupObjects
        this.physics.add.overlap(this.touch, this.groupObjects, this.handleTouch, undefined, this);

    }

    //Adicionada na aula de 8/Maio
    handleTouch(touch, object){

        // Testa se já iniciou o toque e está com o botão apertado
        // Já realizou o primeiro toque, sai
        if (this.isTouching && this.player.isAction){
            return;
        }

        // Está tocando mas soltou ESPAÇO (para de tocar)
        if (this.isTouching && !this.player.isAction){
            this.isTouching = false;
            return;
        }

        // Acabou de apertar o ESPAÇO pela primeira vez e ainda nao iniciou o toque
        if (this.player.isAction){
            this.isTouching = true;
            if (object.name == "cadeira"){
                if(this.player.body.enable == true){
                    this.player.body.enable = false;
                    this.player.x = object.x -8;
                    this.player.y = object.y -8;

                    //this.player.setPosition = (object.x - 8, object.y - 8);

                    //this.input.keyboard.removeAllKeys();
                    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.UP);
                    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
                    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
                    this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.LEFT);


                    this.player.direction = "up";
                    this.player.setDepth(0);



                }else{
                    this.player.body.enable = true;
                    this.player.setPosition = (object.x + 8, object.y + 8);
                    this.player.cursors = this.input.keyboard.addKeys({
                        up: Phaser.Input.Keyboard.KeyCodes.UP,
                        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
                        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                        space: Phaser.Input.Keyboard.KeyCodes.SPACE,

                    });

                    this.player.setDepth(0);

                }
               

        }

            //console.log("Estou tocando");
            //console.log(object);
        }

        // aparece a mensagem quando aperta a barra de espaço
        /*if (this.player.isAction){
            console.log("Estou tocando"); 
        }*/

        // Antes de criar a condicional aparecia a a mensagem 
        // quando o player estava tocando o objeto 
        // console.log("Estou tocando"); 

    }


}