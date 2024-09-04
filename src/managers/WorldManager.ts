import { Player } from "../classes/Player";
import { SAliveEntity } from "../interfaces/SAliveEntity";
import { Enemy } from "../objects/Enemy";
import { NETManager } from "./NETManager";
import SAT from "sat";
import { Math as PMath} from "phaser";
import { AliveEntity } from "../objects/AliveEntity";
import { ScytheGirl } from "../objects/sctythe-girl/ScytheGirl";

export class WorldManager{

    static width = 200

    static delta = 0;

    static mainPlayer: Player;
    static enemies = new Map<string, Enemy>();
    static scytheGirls = new Map<string, ScytheGirl>();
    static aliveEntities = new Map<string, SAliveEntity>();
    static mapPartitions = new Map<string, Array<AliveEntity>>()

    static segmentMap(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                this.mapPartitions.set(j.toString()+ "-" +i.toString(), new Array<AliveEntity>())
            }
        }
        console.log("partitions", this.mapPartitions)
    }

    static checkCollisions(){
        let count = 0;
        if(NETManager.room){
            let player = this.mainPlayer?.character
            //console.log(player?.partition)
            if(player){
                //console.log(player.partition)
                this.mapPartitions.get(player.partition)?.forEach(e=>{
                    if((e instanceof Enemy) && SAT.testPolygonPolygon(e.box.toPolygon(), player.box.toPolygon())){
                        count++;
                        player.saveLastPosition()
                        let new_direction = (new PMath.Vector2(player.x-e.x, player.y - e.y)).normalize();
                        player.x += new_direction.x * player.speed * this.delta
                        player.y += new_direction.y * player.speed * this.delta
                        player.box.pos.x = player.x;
                        player.box.pos.y = player.y;
                        player.updatePartition()
                    }
                })
            }
        }
    }
}