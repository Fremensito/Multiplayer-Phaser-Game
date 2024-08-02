import { Input } from "phaser";
import { Player } from "../objects/Player";

export class PCControls{
    static player: Player;
    static input: Input.InputPlugin;
    private static mouseLeft = false;
    static Q: Input.Keyboard.Key;

    public static setInput(){
        this.Q = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.Q)
    }
    
    public static update(){

        if(Input.Keyboard.JustDown(this.Q)){
            this.player.attacking = true;
            this.player.updateBasicAnimation([
                "basic front attack",
                "basic left attack",
                "basic back attack",
                "basic right attack"
            ], 0)
        }
        
        this.input.on("pointerdown", (p:Input.Pointer) => {
            this.player.idle = false;
            this.player.changeDirectionInput(p);
            this.mouseLeft = true
        });

        this.input.on("pointermove",  (p:Input.Pointer) => {
            this.player.changeDirectionInput(p)
            if(this.mouseLeft)
                this.player.idle = false;
        })

        this.input.on("pointerup", ()=>{this.player.setVelocity(0,0), this.player.idle = true, this.mouseLeft = false})
    }
}