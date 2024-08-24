import { GameObjects} from "phaser";
import { IAbility, IUIAbility, UIShaders } from "../interfaces/Ability";
import { PI } from "../utils/GameUtils";

export class UIAbility{

    UI: IUIAbility;
    shaders: UIShaders;

    constructor(ability: IAbility){
        this.UI = ability.UI;
    }

    addShaders(slot: GameObjects.Shader, icon: GameObjects.Shader){
        this.shaders = {
            slot: slot,
            icon: icon
        };
    }

    update(available: boolean, cooldown: number, cooldowntime:number){
        this.shaders.icon.setUniform("cooldown_time.value", (cooldowntime/cooldown)*2*PI)
        this.shaders.slot.setUniform("cooldown_time.value", (cooldowntime/cooldown)*2*PI)
    }
}