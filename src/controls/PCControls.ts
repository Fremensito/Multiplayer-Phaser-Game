import { Input, Math } from "phaser";
import { AliveEntity } from "../objects/AliveEntity";
import { NETManager } from "../managers/NETManager";
import { CharactersManager } from "../managers/CharactersManager";

export class PCControls{
    input: Input.InputPlugin;
    mouseLeft = false;
    Q: Input.Keyboard.Key;
    W: Input.Keyboard.Key;

    constructor(){
        this.Q = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.Q)
        this.W = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.W)
    }

    update(character:AliveEntity, manager: CharactersManager){
        this.input.on("pointerdown", (p:Input.Pointer) => {
            if(p.button === 0){
                NETManager.sendWalk({
                    x: this.input.mousePointer.worldX,
                    y: this.input.mousePointer.worldY
                });
                manager.pointerDownMove(
                    character,
                    new Math.Vector2(this.input.mousePointer.worldX, this.input.mousePointer.worldY))
                this.mouseLeft = true;
            }
        });

        this.input.on("pointermove",  (p:Input.Pointer) => {
            if(this.mouseLeft){
                NETManager.sendWalk({
                    x: this.input.mousePointer.worldX,
                    y: this.input.mousePointer.worldY
                });
                manager.pointerDownMove(
                    character,
                    new Math.Vector2(this.input.mousePointer.worldX, this.input.mousePointer.worldY))
            }
        })

        this.input.on("pointerup", ()=>{this.mouseLeft = false})
    }
}