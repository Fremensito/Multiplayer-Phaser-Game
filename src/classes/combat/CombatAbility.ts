import { IAbility } from "../../interfaces/Ability";
import { PI } from "../../utils/GameUtils";

export class CombatAbility{
    available: boolean;
    cooldown: number;
    cooldowntime: number;
    mana_cost: number;
    particlesSprite: string;
    range: number;
    debugMode = false;

    constructor(ability: IAbility){
        this.available = true;
        this.cooldown = ability.cooldown;
        this.cooldowntime = -1;
        this.mana_cost = ability.mana_cost;
        this.particlesSprite = ability.particlesSprite;
        this.range = ability.range;
    }

    update(delta: number){
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

    destroy(){}
}