import { GameObjects, Scene } from "phaser";
import { UIRuneInventory } from "./runes/UIRuneInventory";
import { HorizontalContainer } from "../HorizontalContainer";
import { UI } from "../../utils/AssetsGlobals";
import { IRune } from "../../interfaces/inventory/Rune";
import { InventoryNetManager } from "../../managers/InventoryNetManager";

export class Inventory extends GameObjects.Container{

    rows = new Map<number, HorizontalContainer>();
    spacing = 2;
    hcWidth = 188;
    hcHeight = 36;
    runes: Array<IRune>;

    constructor(scene:Scene, runes:Array<IRune>){
        super(scene, 0, 0)
        InventoryNetManager.inventory = this
        this.runes = runes;
        this.addSlotsRow()
        this.addSlotsRow()
        this.addSlotsRow()
        this.scale = 2;
        this.x = (scene.game.config.width as number - this.hcWidth)
        this.y = (300)
        this.loadRunes();
    }

    addSlotsRow(){
        const elements = new Array<UIRuneInventory>();
        for(let i = 0; i < 5; i++){
            let element = new UIRuneInventory(this.scene, UI.runesSlot, this, i, this.rows.size);
            elements.push(element);
        }
        let horizontalContainer = new HorizontalContainer(this.hcWidth, this.hcHeight, 
            {
                x: 0, 
                y: this.spacing * this.rows.size + this.hcHeight*this.rows.size
            }, 
            this.spacing);
        horizontalContainer.addElements(elements)
        this.rows.set(this.rows.size, horizontalContainer)
    }

    loadRunes(){
        this.runes.forEach(r=>{
            (this.rows.get(r.inventoryRow)?.elements[r.inventoryColumn] as UIRuneInventory).setRune(r)
        })
    }

    reallocateRune(rune:IRune){
        console.log(rune);
        (this.rows.get(rune.inventoryRow)?.elements[rune.inventoryColumn]as UIRuneInventory).setRune(rune)
    }
}