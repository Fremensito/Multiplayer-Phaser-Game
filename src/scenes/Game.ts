import { Core, GameObjects, Scene, Tilemaps, Time } from 'phaser';
import { Math } from 'phaser';
import { Player } from '../classes/Player';
import { PCControls } from '../controls/PCControls';
import { UI } from './UI';
import { Character } from '../objects/Character';
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

    constructor ()
    {
        super("Game");
        this.player = NETManager.getPlayer("s", "s");
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

        this.load.spritesheet("ghost", "enemies/ghost/ghost-idle.png", {frameWidth: 64, frameHeight: 64})
    }

    create ()
    {   
        this.generateMap();
        this.generatePlayer();
        this.input.setDefaultCursor("url(assets/cursor.png), pointer")
        document.addEventListener('contextmenu', event => event.preventDefault());

        this.pcControls = new PCControls();
        this.pcControls.character = this.character;
        this.pcControls.input = this.input;
        this.pcControls.setInput(); 
        const ui = new UI(this.character);
        this.game.scene.add("UI", ui, true);

        NETManager.scene = this;
        NETManager.connect();

        //PhysicsManager.startPhysics(this);
        this.matter.world.getDelta = ()=>{
            return this.game.loop.delta
        }
        
        //this.enemy = new Enemy(this, {x: 320, y: 320, speed: 0.4, id:"ghost"})

        //this.matter.world.add(rectangle)
    }   

    update(time:number, delta:number){
        this.pcControls.update();
        this.character.update(delta);
        WorldManager.enemies.forEach(e => e.update(delta))
        //this.enemy.update(delta)
        //this.children.sortChildrenFlag = true;
        NETManager.update();
        this.delta = delta;
        //this.updateMatter(delta)
        //console.log("hello")
        //this.children.depthSort()
        //console.log(this.matter.world.getDelta())
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
        
        this.layer.getCenter().y = this.game.config.height as number / 2;
        this.layer.scale = 0.8;
        this.layer.setSkipCull(true)
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
            console.log("hello")
            this.matter.world.update(Date.now(), this.timeElapsed.valueOf());
            this.timeElapsed = 0
        }
    }
}
