import { GameObjects } from "phaser";
import { IAbility, UIAbility, UIShaders } from "../interfaces/Ability";
import { PI } from "../utils/GameUtils";

export class Ability{
    available: boolean;
    cooldown: number;
    cooldown_time: number;
    mana_cost: number;
    UI: UIAbility;
    shaders: UIShaders;

    constructor(ability: IAbility){
        this.available = true;
        this.cooldown = ability.cooldown;
        this.cooldown_time = -1;
        this.mana_cost = ability.mana_cost;
        this.UI = ability.UI;
    }

    addShaders(slot: GameObjects.Shader, icon: GameObjects.Shader){
        this.shaders = {
            slot: slot,
            icon: icon
        };
    }

    update(delta: number){
        if(!this.available){
            this.cooldown_time += delta;
            this.shaders.icon.setUniform("cooldown_time.value", (this.cooldown_time/this.cooldown)*2*PI)
            this.shaders.slot.setUniform("cooldown_time.value", (this.cooldown_time/this.cooldown)*2*PI)
            if(this.cooldown_time/this.cooldown*2*PI > PI*2){
                this.cooldown_time = -1;
                this.available = true;
            }
        }
    }

    activate(){
        if(this.available){
            this.available = false;
            this.cooldown_time = 0;
        }
    }
}