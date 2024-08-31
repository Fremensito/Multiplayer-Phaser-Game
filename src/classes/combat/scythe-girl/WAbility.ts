import { Scene } from "phaser";
import { IAbility } from "../../../interfaces/Ability";
import { Enemy } from "../../../objects/Enemy";
import { Character } from "../../../objects/sctythe-girl/Character";
import { WorldManager } from "../../../managers/WorldManager";
import { CombatAbility } from "../CombatAbility";
import SAT from "sat";
import { SCYTHE_GIRL } from "../../../utils/AssetsGlobals";

export class WAbility extends CombatAbility{

    scene: Scene;
    enemiesHit = new Array<Enemy>()
    damage = 10
    character: Character

    constructor(scene:Scene, ability: IAbility, x:number, y: number, texture: string){
        super(scene, ability, x, y, texture)
        this.generateAnimations(SCYTHE_GIRL.WVFX, SCYTHE_GIRL.WVFX, 0, 6, ability.speed)
    }

    clear(){
        this.enemiesHit = [];
    }

    doDamage(character: Character){
        WorldManager.enemies.forEach(e=>{
            if(!this.enemiesHit.includes(e) && (new SAT.Vector(character.x - e.x, character.y -e.y)).len() <= this.range){
                e.getDamageClient(10)
                this.enemiesHit.push(e);
            }
        })
    }
}