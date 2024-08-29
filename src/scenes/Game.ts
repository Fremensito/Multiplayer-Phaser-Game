import { GameObjects, Scene, Tilemaps} from 'phaser';
import { Math } from 'phaser';
import { Player } from '../classes/Player';
import { PCControls } from '../controls/PCControls';
import { Character } from '../objects/sctythe-girl/Character';
import { NETManager } from '../managers/NETManager';
import { Enemy } from '../objects/Enemy';
import { WorldManager } from '../managers/WorldManager';
//import { PhysicsManager } from '../managers/PhysicsManager';


export class Game extends Scene
{   
    character:Character;
    player: Player
    layer: Tilemaps.TilemapLayer;
    backgroundLoop: number;
    pcControls: PCControls
    delta:number;
    timeElapsed = 0;
    enemy:Enemy
    created = false;
    static ghostSprites = {
        ghostIdle: "ghost",
        ghostGetHit: "ghost get hit"
    }

    partitionWidth = 200;

    constructor ()
    {
        super("Game");
    }

    preload ()
    {   
        this.load.setPath('assets');
        this.load.image('tile-map', 'first-lv-tilemap.png');
        this.load.spritesheet("player", "classes/scythe-girl/walking.png", {frameWidth:64, frameHeight:64});
        this.load.spritesheet("player idle", "classes/scythe-girl/idle.png", {frameWidth:64, frameHeight:64});
        this.load.spritesheet("player basic attack", "classes/scythe-girl/basic-attack.png", {frameWidth:64, frameHeight:64});
        this.load.spritesheet("player w", "classes/scythe-girl/W.png", {frameWidth:64, frameHeight:64});
        this.load.spritesheet("W-particles", "classes/scythe-girl/W-particles.png", {frameWidth:64, frameHeight:64});
        
        this.load.spritesheet(Game.ghostSprites.ghostIdle, "enemies/ghost/ghost-idle.png", {frameWidth: 64, frameHeight: 64})
        this.load.spritesheet(Game.ghostSprites.ghostGetHit, "enemies/ghost/ghost-get-hit.png", {frameWidth: 64, frameHeight: 64})

        this.load.audio("getHit", "sounds/get-hit2.wav")
        this.load.audio("WScythe", "sounds/scythe-girl/W.wav");
        this.load.audio("QScythe", "sounds/scythe-girl/Q.wav")
    }

    async create ()
    {   
        this.generateMap();
        //this.generatePlayer();
        this.input.setDefaultCursor("url(assets/cursor.png), pointer")
        document.addEventListener('contextmenu', event => event.preventDefault());

        NETManager.scene = this;
        await NETManager.connect();

        //PhysicsManager.startPhysics(this);
        this.matter.world.getDelta = ()=>{
            return this.game.loop.delta
        }
        
        //this.enemy = new Enemy(this, {x: 320, y: 320, speed: 0.4, id:"ghost"})

        //this.matter.world.add(rectangle)
        // this.time.addEvent({
        //     delay: 1000,
        //     callback: ()=>console.log(WorldManager.enemies.size),
        //     loop: true
        // })
    } 
    
    generateMainPlayer(character:Character){
        this.character = character
        this.cameras.main.zoom = 3;
        this.cameras.main.centerOn(this.character.x, this.character.y)
        this.cameras.main.startFollow(this.character)
        this.pcControls = new PCControls();
        this.pcControls.character = this.character
        this.pcControls.input = this.input
        this.pcControls.setInput();
    }

    update(time:number, delta:number){
        if(this.pcControls && this.pcControls.input){
            this.pcControls.update();
            //this.character.update(delta);
        }
        WorldManager.enemies.forEach(e => e.update(delta))
        WorldManager.players.forEach(c =>{
            c!.update(delta)
        })
        this.delta = delta;
        WorldManager.delta = delta;
        WorldManager.checkCollisions();
    }
    
    generateMap(){
        const map = this.make.tilemap({width:50, height: 50, tileWidth: 16, tileHeight: 16});
        const tiles = map.addTilesetImage("tile-map", undefined, 16, 16)!;
        this.layer = map.createBlankLayer('layer1', tiles)!;
        
        this.layer.forEachTile((v)=>{
            if(Math.Between(1, 100) <= 30){
                v.index = 2;
            }
            else{
                v.index = Math.Between(0,1);
            }
        })
        
        this.layer.x = 0;
        this.layer.y = 0;
        this.layer.scale = 1;
        this.layer.setSkipCull(true);
        this.partition()
    }

    partition(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                let rect = new GameObjects.Rectangle(this, j*200 + 100, i*200 + 100, 200, 200);
                rect.setStrokeStyle(1, 0x13e8e8)
                rect.depth = 3000;
                this.add.existing(rect)
            }
        }
    }

    generatePlayer(){
        this.character = new Character(
            this, 
            this.player.character
        );

        // this.character.x = this.layer.getCenter().x;
        // this.character.y = this.layer.getCenter().y;

        //Makes the.character look front
        this.character.pointToMove.y = this.character.y + 10;
        this.character.pointToMove.x = this.character.x;
        
        this.cameras.main.zoom = 3;
        this.cameras.main.centerOn(this.character.x, this.character.y)
    }

    updateMatter(delta:number){
        this.timeElapsed += delta;
        if(this.timeElapsed > 16){
            console.log("hello");
            this.matter.world.update(Date.now(), this.timeElapsed.valueOf());
            this.timeElapsed = 0;
        }
    }
}
