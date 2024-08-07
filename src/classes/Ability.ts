import { GameObjects, Scene } from "phaser";
import { IAbility, UIAbility, UIShaders } from "../interfaces/Ability";
import { PI } from "../utils/GameUtils";

export class Ability extends GameObjects.Sprite{
    available: boolean;
    cooldown: number;
    cooldown_time: number;
    mana_cost: number;
    particlesSprite: string;
    UI: UIAbility;
    shaders: UIShaders;

    constructor(ability: IAbility, scene:Scene){
        super(scene, 0,0, "W-particles");
        this.visible = false;
        this.available = true;
        this.cooldown = ability.cooldown;
        this.cooldown_time = -1;
        this.mana_cost = ability.mana_cost;
        this.particlesSprite = ability.particlesSprite;
        this.UI = ability.UI;
    }

    addShaders(slot: GameObjects.Shader, icon: GameObjects.Shader){
        this.shaders = {
            slot: slot,
            icon: icon
        };
    }

    update(delta: number, frame:number){
        if(!this.available){
            this.cooldown_time += delta;
            this.shaders.icon.setUniform("cooldown_time.value", (this.cooldown_time/this.cooldown)*2*PI)
            this.shaders.slot.setUniform("cooldown_time.value", (this.cooldown_time/this.cooldown)*2*PI)
            if(this.cooldown_time/this.cooldown*2*PI > PI*2){
                this.cooldown_time = -1;
                this.available = true;
            }
        }
        if(this.particlesSprite){

        }
    }

    activate(){
        if(this.available){
            this.available = false;
            this.cooldown_time = 0;
        }
    }
}