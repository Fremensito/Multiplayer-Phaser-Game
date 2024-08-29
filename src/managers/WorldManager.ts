import { Player } from "../classes/Player";
import { SAliveEntity } from "../interfaces/SAliveEntity";
import { Enemy } from "../objects/Enemy";
import { Character } from "../objects/sctythe-girl/Character";
import { NETManager } from "./NETManager";
import SAT from "sat";
import { Math } from "phaser";

export class WorldManager{

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

    static checkCollisions(){
        if(NETManager.room){
            let player = this.players.get(NETManager.room.sessionId)!

            this.enemies.forEach(e=>{
                if(SAT.testPolygonPolygon(e.box.toPolygon(), player.box.toPolygon())){
                    let new_direction = (new Math.Vector2(player.x-e.x, player.y - e.y)).normalize();
                    player.x += new_direction.x * player.speed * this.delta
                    player.y += new_direction.y * player.speed * this.delta
                    console.log("collisioning")
                }
            })
        }
    }
}