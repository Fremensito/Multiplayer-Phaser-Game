import { IRune } from "../interfaces/inventory/Rune";
import { Inventory } from "../UI/inventory/Inventory";
import { InventorySlot } from "../UI/inventory/InventorySlot";

export class InventoryNetManager{
    static inventory:Inventory

    static reallocateRune(rune:IRune, inventorySlot: InventorySlot){
        rune.inventoryColumn = inventorySlot.column;
        rune.inventoryRow = inventorySlot.row
        this.inventory.reallocateRune(rune)
    }
}