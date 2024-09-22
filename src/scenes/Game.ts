import { GameObjects, Scene, Tilemaps} from 'phaser';
import { Math } from 'phaser';
import { Player } from '../classes/Player';
import { NETManager } from '../managers/NETManager';
import { Ghost } from '../objects/enemies/Ghost';
import { WorldManager } from '../managers/WorldManager';
import { MAP } from '../utils/AssetsGlobals';
import { AssetsLoader } from '../utils/AssetsLoader';
import { AliveEntity } from '../objects/AliveEntity';
import { authenticate } from '../utils/Auth';
import { colyseusSDK } from '../utils/Colyseus';
//import { PhysicsManager } from '../managers/PhysicsManager';


export class Game extends Scene
{   
    static debug = false;
    static graphics: GameObjects.Graphics;
    character:AliveEntity;
    player: Player
    layer: Tilemaps.TilemapLayer;
    backgroundLoop: number;
    delta:number;
    timeElapsed = 0;
    enemy:Ghost
    created = false;
    partitionWidth = 200;

    constructor ()
    {
        super("Game");
    }

    preload ()
    {   
        this.load.setPath('/.proxy/assets');

        AssetsLoader.loadGeneral(this);
        AssetsLoader.loadMap(this)
        AssetsLoader.loadScythe(this);
        AssetsLoader.loadGhost(this)
    }

    async create ()
    {   
        Game.graphics = this.add.graphics();
        Game.graphics.lineStyle(1, 0x13e8e8);
        Game.graphics.depth = 5000;
        this.generateMap();
        WorldManager.segmentMap()
        //this.generatePlayer();
        this.input.setDefaultCursor("url(assets/cursor.png), pointer")
        document.addEventListener('contextmenu', event => event.preventDefault());
        
        const authData = await authenticate(colyseusSDK);
        colyseusSDK.auth.token = authData.token;
        NETManager.scene = this;    
        await NETManager.connect(colyseusSDK);
        
        //this.enemy = new Enemy(this, {x: 320, y: 320, speed: 0.4, id:"ghost"})
    } 
    
    fixCamera(character:AliveEntity){
        this.character = character
        this.cameras.main.zoom = 3;
        this.cameras.main.centerOn(this.character.x, this.character.y)
        this.cameras.main.startFollow(this.character)
    }

    update(time:number, delta:number){
        Game.graphics.clear()
        // if(this.pcControls && this.pcControls.input){
        //     this.pcControls.update();
        //     //this.character.update(delta);
        // }
        WorldManager.mainPlayer?.character.update(delta)
        WorldManager.scytheGirls.forEach(s=>{
            if(s != WorldManager.mainPlayer.character)
            s.update(delta)
        })
        WorldManager.enemies.forEach(e => e.update(delta))
        // WorldManager.players.forEach(c =>{
        //     c!.update(delta)
        // })
        this.delta = delta;
        WorldManager.delta = delta;
        WorldManager.checkCollisions();
    }
    
    generateMap(){
        const map = this.make.tilemap({width:50, height: 50, tileWidth: 16, tileHeight: 16});
        const tiles = map.addTilesetImage(MAP.tilemap, undefined, 16, 16)!;
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
}
