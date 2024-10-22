import { GameObjects, Input, Math, Scene } from "phaser";
import { SlotIcon } from "../../SlotIcon";
import { IRune } from "../../../interfaces/inventory/Rune";
import { GENERAL } from "../../../utils/AssetsGlobals";

export class UIRuneInventory extends SlotIcon{
    container: GameObjects.Container;
    rune:IRune;
    column: number;
    row: number;

    constructor(scene:Scene, slot:string, container: GameObjects.Container){
        super();
        this.container = container
        this.slot = new GameObjects.Image(scene, 0,0, slot)
        this.container.add(this.slot)
        this.slot.setInteractive({dropZone:true});
    }

    addIcon(id:number){
        this.icon = new GameObjects.Image(this.slot.scene, 0 ,0, GENERAL.runes, id)
        this.icon.x = this.slot.x;
        this.icon.y = this.slot.y;
        this.icon.setInteractive({draggable:true})
        
        this.icon.on("drag", (pointer: Input.Pointer)=>{
            this.icon.x = this.container.pointToContainer(new Math.Vector2(pointer.x, pointer.y)).x;
            this.icon.y = this.container.pointToContainer(new Math.Vector2(pointer.x, pointer.y)).y;
        }, this)
        this.icon.on("drop",(pointer:Input.Pointer, target:GameObjects.GameObject)=>{
            console.log(target)
        })
        this.container.add(this.icon)
    }
    
    setRune(rune:IRune){
        this.rune = rune
        this.addIcon(rune.id)
    }
}