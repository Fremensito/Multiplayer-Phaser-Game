import { GameObjects, Scene } from "phaser";
import { IAbility } from "../../interfaces/Ability";
import { PI } from "../../utils/GameUtils";
import { AliveEntity } from "../../objects/AliveEntity";

export class CharacterAbility extends GameObjects.Sprite{
    available: boolean;
    cooldown: number;
    cooldowntime: number;
    mana_cost: number;
    range: number;
    debugMode = false;

    constructor(scene:Scene, ability: IAbility, x:number, y: number, texture: string){
        super(scene, x, y, texture)
        this.available = true;
        this.cooldown = ability.cooldown;
        this.cooldowntime = -1;
        this.mana_cost = ability.mana_cost;
        this.range = ability.range;
        this.visible = false;
        this.depth = 4000
        scene.add.existing(this)
    }

    update(delta: number, entity:AliveEntity){
        if(!this.available){
            this.cooldowntime += delta;
            if(this.cooldowntime/this.cooldown*2*PI > PI*2){
                this.cooldowntime = -1;
                this.available = true;
            }
        }
    }

    activate(){
        if(this.available){
            this.available = false;
            this.cooldowntime = 0;
        }
    }

    updatePosition(x:number, y:number){
        this.x = x;
        this.y = y;
    }
}