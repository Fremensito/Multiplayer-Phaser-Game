import { GameObjects, Scene } from "phaser";
import { SlotIcon } from "../../SlotIcon";
import { IRune } from "../../../interfaces/inventory/Rune";
import { GENERAL } from "../../../utils/AssetsGlobals";

export class UIRuneInventory extends SlotIcon{
    container: GameObjects.Container;
    rune:IRune;

    constructor(scene:Scene, slot:string, container: GameObjects.Container){
        super();
        this.container = container
        this.slot = new GameObjects.Image(scene, 0,0, slot)
        this.container.add(this.slot)
        this.slot.setInteractive();
    }

    addIcon(id:number){
        this.icon = new GameObjects.Image(this.slot.scene, 0 ,0, GENERAL.runes, id)
        this.icon.x = this.slot.x;
        this.icon.y = this.slot.y;
        console.log("hola")
        this.container.add(this.icon)
    }
    
    setRune(rune:IRune){
        this.rune = rune
        this.addIcon(rune.id)
    }
}