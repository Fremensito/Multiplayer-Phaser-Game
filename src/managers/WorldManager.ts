import { Player } from "../classes/Player";
import { SAliveEntity } from "../interfaces/SAliveEntity";
import { Enemy } from "../objects/Enemy";
import { Character } from "../objects/sctythe-girl/Character";
import { NETManager } from "./NETManager";
import SAT from "sat";
import { Math as PMath} from "phaser";
import { AliveEntity } from "../objects/AliveEntity";

export class WorldManager{

    static width = 200

    static categories ={
        abilities: 1,
        enemies: 2,
        characters: 4,
    }

    static collideGroups = {
        abilities: 1,
        enemies: 2,
        objects: 4
    }

    static delta = 0;

    static mainPlayer: Player;
    static players = new Map<string, Character>();
    static enemies = new Map<string, Enemy>();
    static aliveEntities = new Map<string, SAliveEntity>();
    static mapParitions = new Map<string, Array<AliveEntity>>()

    static segmentMap(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                this.mapParitions.set(j.toString()+i.toString(), new Array<AliveEntity>())
            }
        }
        console.log("partitions", this.mapParitions)
    }

    static checkCollisions(){
        if(NETManager.room){
            let player = this.players.get(NETManager.room.sessionId)

            if(player){
                this.mapParitions.get(Math.floor(player.x/this.width).toString()+ Math.floor(player.y/this.width).toString())?.forEach(e=>{
                    if(!(e instanceof Character) && SAT.testPolygonPolygon(e.box.toPolygon(), player.box.toPolygon())){
                        let new_direction = (new PMath.Vector2(player.x-e.x, player.y - e.y)).normalize();
                        player.x += new_direction.x * player.speed * this.delta
                        player.y += new_direction.y * player.speed * this.delta
                        console.log("collisioning")
                    }
                })
            }

            // this.mapParitions.forEach(p => {
            //     p.forEach(a => {
            //         if(a instanceof Enemy){
            //             p.forEach(aa => {
            //                 if(a != aa && SAT.testPolygonPolygon(a.box.toPolygon(), aa.box.toPolygon())){
            //                     let new_direction = (new PMath.Vector2(a.x - aa.x, a.y-aa.y)).normalize()
            //                     a.x += new_direction.x*a.speed*this.delta;
            //                     a.y += new_direction.y*a.speed*this.delta;
            //                 }
            //             })
            //         }
            //     })
            // })
        }
    }
}