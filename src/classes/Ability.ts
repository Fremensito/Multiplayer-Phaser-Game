import { GameObjects } from "phaser";
import { IAbility, UIAbility, UIShaders } from "../interfaces/Ability";

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
            icon: icon,
        };
    }

    /*createShader(resource: string): GameObjects.Shader{
        const shader = 
    }*/

    activate(){
        if(this.available){
            this.available = false;
            this.cooldown_time = 0;
        }
    }
}