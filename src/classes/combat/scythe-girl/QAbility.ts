import { IAbility } from "../../../interfaces/Ability";
import { Character } from "../../../objects/sctythe-girl/Character";
import { WorldManager } from "../../../managers/WorldManager";
import { CombatAbility } from "../CombatAbility";
import SAT from "sat";
import { Scene } from "phaser";
import { SCYTHE_GIRL } from "../../../utils/AssetsGlobals";

export class QAbility extends CombatAbility{

    width = 30;
    directions = {
        up: "QUp",
        right: "QRight",
        down: "QDown",
        left: "QLeft"
    }

    constructor(scene:Scene, ability: IAbility, x:number, y: number, texture: string){
        super(scene, ability, x, y, texture)
        this.generateAnimations(this.directions.down, SCYTHE_GIRL.QVFX, 0, 6, ability.speed)
        this.generateAnimations(this.directions.right, SCYTHE_GIRL.QVFX, 7, 13, ability.speed)
        this.generateAnimations(this.directions.left, SCYTHE_GIRL.QVFX, 14, 20, ability.speed)
        this.generateAnimations(this.directions.up, SCYTHE_GIRL.QVFX, 21, 27, ability.speed)
    }

    doDamage(direction:string, character:Character){
        switch(direction){
            case this.directions.up:
                this.play({key: this.directions.up, repeat: 0, startFrame: 0})
                WorldManager.enemies.forEach(e=>{
                    if(e.y <= character.y && (new SAT.Vector(e.x - character.x, e.y - character.y)).len() <= this.range)
                        e.getDamageClient(10);
                })
                break;
            
            case this.directions.right:
                this.play({key: this.directions.right, repeat: 0, startFrame: 0})
                WorldManager.enemies.forEach(e=>{
                    if(e.x >= character.x && (new SAT.Vector(e.x - character.x, e.y - character.y)).len() <= this.range)
                        e.getDamageClient(10);
                })
                break;
            
            case this.directions.down:
                this.play({key: this.directions.down, repeat: 0, startFrame: 0})
                WorldManager.enemies.forEach(e=>{
                    if(e.y >= character.y && (new SAT.Vector(e.x - character.x, e.y - character.y)).len() <= this.range)
                        e.getDamageClient(10);
                })
                break;
            
            case this.directions.left:
                this.play({key: this.directions.left, repeat: 0, startFrame: 0})
                WorldManager.enemies.forEach(e=>{
                    if(e.x <= character.x && (new SAT.Vector(e.x - character.x, e.y - character.y)).len() <= this.range)
                        e.getDamageClient(10);
                })
                break;
        }
    }
}