import { Math } from "phaser";
import { SlotIcon } from "./SlotIcon";
import { Vector2 } from "../interfaces/Vector2";

export class HorizontalContainer{
    width: number;
    height: number;
    spacing = 0;
    private center: Vector2;
    elements: Array<SlotIcon>

    constructor(width:number, height: number, center: Vector2, spacing = 0){
        this.width = width;
        this.height = height;
        this.center = center;
        this.spacing = spacing;
    }

    addElements(elements: Array<SlotIcon>){
        this.elements = elements;
        let element:SlotIcon;
        for(let i:number = 0; i < elements.length; i++){
            element = this.elements[i]
            this.setElement(element, i)
        };
    }

    setElement(element: SlotIcon, index: number){
        if(element.icon){
            element.icon.x = (this.center.x - this.width/2 + element.slot.displayWidth/2) + element.slot.displayWidth*index + this.spacing*index*element.slot.scale
            element.icon.y = this.center.y;
        }
        element.slot.x = (this.center.x - this.width/2 + element.slot.displayWidth/2) + element.slot.displayWidth*index + this.spacing*index*element.slot.scale
        element.slot.y = this.center.y;
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