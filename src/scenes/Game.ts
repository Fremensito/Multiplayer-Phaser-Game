import { Input, Scene, Textures, Tilemaps } from 'phaser';
import { Math } from 'phaser';
import { Player } from '../objects/Player';
import { PCControls } from '../controls/PCControls';


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
        PCControls.player = this.player;
        PCControls.input = this.input;
    }

    update(time:number, delta:number){
        PCControls.update();
        this.player.update(delta);
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
}