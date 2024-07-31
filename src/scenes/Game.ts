import { Input, Scene, Textures, Tilemaps } from 'phaser';
import { Math } from 'phaser';
import { Player } from '../objects/Player';


export class Game extends Scene
{   
    player:Player;
    layer: Tilemaps.TilemapLayer;

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('tile-map', 'first-lv-tilemap.png');
        this.load.spritesheet("player", "scythe-girl-walking.png", {frameWidth:64, frameHeight:64});
        this.load.spritesheet("player idle", "scythe-girl-idle.png", {frameWidth:64, frameHeight:64});
    }

    create ()
    {   
        this.generateMap();
        this.generatePlayer();
        this.input.setDefaultCursor("url(assets/cursor.png), pointer")
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    update(time:number, delta:number){
        console.log(this.player.idle);
        this.input.on("pointerdown", (p:Input.Pointer) => {this.player.idle = false, this.movePlayer(p, delta);})
        this.input.on("pointermove",  (p:Input.Pointer) => {
            this.movePlayer(p, delta)
        })
        this.input.on("pointerup", ()=>{this.player.setVelocity(0,0), this.player.idle = true})
        this.input.mousePointer.active = false;
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
        this.player = new Player(
            this, 
            this.game.config.width as number/2,
            this.game.config.height as number/2);

        this.player.x = this.layer.getCenter().x;
        this.player.y = this.layer.getCenter().y;
        
        this.cameras.main.zoom = 3;
        this.cameras.main.centerOn(this.player.x, this.player.y)
    }

    movePlayer(p:Input.Pointer, delta: number){
        {   
            if(!this.player.idle && p.button === 0){
                const direction = new Math.Vector2(p.worldX - this.player.getCenter().x, p.worldY - this.player.getCenter().y);
                direction.normalize()
                this.player.setVelocity(direction.x*delta/1000*this.player.speed, direction.y*delta/1000*this.player.speed)
            }
        }
    }
}
