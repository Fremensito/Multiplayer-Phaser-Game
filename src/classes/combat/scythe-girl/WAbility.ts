import { Scene } from "phaser";
import { IAbility } from "../../../interfaces/Ability";
import { Ghost } from "../../../objects/enemies/Ghost";
import { CharacterAbility } from "../CharacterAbility";
import { SCYTHE_GIRL } from "../../../utils/AssetsGlobals";
import { Animator } from "../../../utils/Animator";

export class WAbility extends CharacterAbility{

    enemiesHit = new Array<Ghost>()
    damage = 10
    static animsCreated = false;

    constructor(scene:Scene, ability: IAbility, x:number, y: number, texture: string){
        super(scene, ability, x, y, texture)

        if(!WAbility.animsCreated){
            Animator.generateAbilityAnimations(this.scene, SCYTHE_GIRL.WVFX, SCYTHE_GIRL.WVFX, 0, 6, ability.speed)
            WAbility.animsCreated = true;
        }
    }

    clear(){
        this.enemiesHit = [];
    }

    // doDamage(character: AliveEntity){
    //     WorldManager.enemies.forEach(e=>{
    //         if(!this.enemiesHit.includes(e) && (new SAT.Vector(character.x - e.x, character.y -e.y)).len() <= this.range){
    //             e.getDamageClient(10)
    //             this.enemiesHit.push(e);
    //         }
    //     })
    // }
}