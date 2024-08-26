import { Player } from "../classes/Player";
import { SAliveEntity } from "../interfaces/SAliveEntity";
import { Enemy } from "../objects/Enemy";
import { Character } from "../objects/sctythe-girl/Character";

export class WorldManager{

    static categories ={
        abilities: 1,
        enemies: 2,
        characters: 4,
    }

    static collideGroups = {
        abilities: 1,
        enemies: 2
    }


    static mainPlayer: Player;
    static players = new Map<string, Character>();
    static enemies = new Map<string, Enemy>();
    static aliveEntities = new Map<string, SAliveEntity>();

    // static setCollisionsScytheQ(scene: Scene){
    //     scene.matter.world.on("collisionstart", (event:any)=>{
    //         for(let i = 0; i < event.pairs.length; i++){
    //             let pair = event.pairs[i]
    //             //console.log(pair)
    //             if(pair ){
                    
    //             }
    //             console.log(pair.bodyA.label, pair.bodyB.label)
    //         }
    //     })

    //     scene.matter.world.on("collisionend", ()=>{
    //         console.log("bye")
    //     })
    // }
}