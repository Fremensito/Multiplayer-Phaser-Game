import { IAbility } from "../../../interfaces/Ability";
import { Character } from "../../../objects/sctythe-girl/Character";
import { WorldManager } from "../../../managers/WorldManager";
import { CombatAbility } from "../CombatAbility";
import SAT from "sat";

export class QAbility extends CombatAbility{

    width = 30;
    directions = {
        up: "QUp",
        right: "QRight",
        down: "QDown",
        left: "QLeft"
    }

    constructor(ability: IAbility){
        super(ability)

    }

    doDamage(direction:string, character:Character){
        switch(direction){
            case this.directions.up:
                WorldManager.enemies.forEach(e=>{
                    if(e.y <= character.y && (new SAT.Vector(e.x - character.x, e.y - character.y)).len() <= this.range)
                        e.getDamageClient(10);
                })
                break;
            
            case this.directions.right:
                WorldManager.enemies.forEach(e=>{
                    if(e.x >= character.x && (new SAT.Vector(e.x - character.x, e.y - character.y)).len() <= this.range)
                        e.getDamageClient(10);
                })
                break;
            
            case this.directions.down:
                WorldManager.enemies.forEach(e=>{
                    if(e.y >= character.y && (new SAT.Vector(e.x - character.x, e.y - character.y)).len() <= this.range)
                        e.getDamageClient(10);
                })
                break;
            
            case this.directions.left:
                WorldManager.enemies.forEach(e=>{
                    if(e.x <= character.x && (new SAT.Vector(e.x - character.x, e.y - character.y)).len() <= this.range)
                        e.getDamageClient(10);
                })
                break;
        }
    }
}