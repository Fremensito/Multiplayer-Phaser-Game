import { Math } from "phaser";
import { UIShaders } from "../interfaces/Ability";
import { Misc } from "./UIMisc";
import { UIAbility } from "./UIAbility";

export class HorizontalContainer{
    width: number;
    height: number;
    private center: Math.Vector2;
    private elements: Array<UIAbility>|Array<Misc>

    constructor(width:number, height: number, center: Math.Vector2){
        this.width = width;
        this.height = height;
        this.center = center;
    }

    addElements(elements: Array<UIAbility>|Array<Misc>){
        this.elements = elements;
        let element:UIAbility|Misc;
        for(let i:number = 0; i < elements.length; i++){
            element = this.elements[i]

            //element.icon.setOrigin(0,0);
            element.icon.x = this.width/elements.length*i + this.center.x - this.width/elements.length;
            element.icon.y = this.center.y;

            //element.slot.setOrigin(0,0.5);
            element.slot.x = this.width/elements.length*i + this.center.x - this.width/elements.length;
            element.slot.y = this.center.y;
        };
    }

    move(center: Math.Vector2){
        this.elements.forEach(e =>{
            e.icon.x += center.x - this.center.x;
            e.icon.y = center.y;
            e.slot.x += center.x - this.center.x;
            e.slot.y = center.y;
        })
        this.center = center;
    }

    update(){

    }
}