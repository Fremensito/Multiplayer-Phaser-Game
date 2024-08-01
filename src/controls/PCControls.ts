import { Input, Scene } from "phaser";
import { Player } from "../objects/Player";

export class PCControls{
    static player: Player;
    static input: Input.InputPlugin;
    
    public static update(delta: number){
        this.input.on("pointerdown", (p:Input.Pointer) => {this.player.idle = false, this.player.move(p, delta);})
        this.input.on("pointermove",  (p:Input.Pointer) => {
            this.player.move(p, delta)
        })
        this.input.on("pointerup", ()=>{this.player.setVelocity(0,0), this.player.idle = true})
        this.input.mousePointer.active = false;
    }
}