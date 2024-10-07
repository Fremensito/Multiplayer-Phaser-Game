import { Scene } from "phaser";
import { IAbility } from "../../../interfaces/Ability";
import { Ghost } from "../../../objects/enemies/Ghost";
import { WorldManager } from "../../../managers/WorldManager";
import { CombatAbility } from "../CombatAbility";
import SAT from "sat";
import { SCYTHE_GIRL } from "../../../utils/AssetsGlobals";
import { AliveEntity } from "../../../objects/AliveEntity";

export class WAbility extends CombatAbility{

    scene: Scene;
    enemiesHit = new Array<Ghost>()
    damage = 10
    static animsCreated = false;

    constructor(scene:Scene, ability: IAbility, x:number, y: number, texture: string){
        super(scene, ability, x, y, texture)

        if(!WAbility.animsCreated){
            this.generateAnimations(SCYTHE_GIRL.WVFX, SCYTHE_GIRL.WVFX, 0, 6, ability.speed)
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