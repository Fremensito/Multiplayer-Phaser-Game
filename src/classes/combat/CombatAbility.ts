import { GameObjects, Scene } from "phaser";
import { IAbility } from "../../interfaces/Ability";
import { PI } from "../../utils/GameUtils";

export class CombatAbility extends GameObjects.Sprite{
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

    generateAnimations(name: string, texture: string, start:number, end: number, speed: number){
        this.scene.anims.create({
            key: name,
            frames: this.scene.anims.generateFrameNumbers(texture, {
                start: start,
                end: end
            }),
            frameRate: speed,
            showOnStart: true,
            hideOnComplete: true,
        })
    }

    updatePosition(x:number, y:number){
        this.x = x;
        this.y = y;
    }
}