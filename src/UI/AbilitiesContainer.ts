import { Math } from "phaser";
import { UIShaders } from "../interfaces/Ability";

export class AbilitiesContainer{
    width: number;
    height: number;
    private center: Math.Vector2;
    private elements: Array<UIShaders>

    constructor(width:number, height: number, center: Math.Vector2){
        this.width = width;
        this.height = height;
        this.center = center;
    }

    addElements(elements: Array<UIShaders>){
        this.elements = elements;
        let element:UIShaders;
        for(let i:number = -2; i < 0; i++){
            element = this.elements[2 + i]

            element.icon.setOrigin();
            element.icon.x = this.center.x + this.width/2*i;
            element.icon.y = this.center.y;

            element.slot.setOrigin();
            element.slot.x = this.center.x + this.width/2*i;
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