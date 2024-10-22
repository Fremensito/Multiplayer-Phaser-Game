import { GameObjects, Input, Math, Scene } from "phaser";
import { SlotIcon } from "../../SlotIcon";
import { IRune } from "../../../interfaces/inventory/Rune";
import { GENERAL } from "../../../utils/AssetsGlobals";
import { InventoryNetManager } from "../../../managers/InventoryNetManager";
import { InventorySlot } from "../InventorySlot";

export class UIRuneInventory extends SlotIcon{
    container: GameObjects.Container;
    rune:IRune|null = null;
    column: number;
    row: number;

    constructor(scene:Scene, slot:string, container: GameObjects.Container, column:number, row:number){
        super();
        this.column = column;
        this.row = row
        this.container = container
        this.slot = new InventorySlot(scene, 0,0, slot);
        (this.slot as InventorySlot).row = this.row;
        (this.slot as InventorySlot).column = this.column;
        this.container.add(this.slot)
        this.slot.setInteractive({dropZone:true});
    }

    addIcon(id:number){
        this.icon = new GameObjects.Image(this.slot.scene, 0 ,0, GENERAL.runes, id);
        this.icon.x = this.slot.x;
        this.icon.y = this.slot.y;
        this.icon.setInteractive({draggable:true})

        this.icon.on("drag", this.setDrag, this)

        this.icon.on("dragend", this.setDragEnd, this)

        this.icon.on("drop",this.setDrop, this)
        this.container.add(this.icon)
    }

    setDrag(pointer: Input.Pointer){
        this.icon!.x = this.container.pointToContainer(new Math.Vector2(pointer.x, pointer.y)).x;
        this.icon!.y = this.container.pointToContainer(new Math.Vector2(pointer.x, pointer.y)).y;
    }

    setDragEnd(pointer:Input.Pointer, dragX:number, dragY:number, dropped:boolean){
        if(!dropped){
            this.icon!.x = this.slot.x;
            this.icon!.y = this.slot.y;
        }
    }

    setDrop(pointer:Input.Pointer, target:GameObjects.GameObject){
        if(target == this.slot){
            this.icon!.x = this.slot.x;
            this.icon!.y = this.slot.y;
        }
        else{
            this.icon?.removeListener("drop")
            this.icon?.removeListener("drag")
            this.icon?.removeListener("dragend")
            this.icon?.destroy();
            InventoryNetManager.reallocateRune(this.rune!, target as InventorySlot)
            this.rune = null;
        }
    }
    
    setRune(rune:IRune){
        this.rune = rune
        this.addIcon(rune.id)
    }
}