import { Input } from "phaser";
import { Character } from "../objects/Character";

export class PCControls{
    static character: Character;
    static input: Input.InputPlugin;
    private static mouseLeft = false;
    static Q: Input.Keyboard.Key;
    static W: Input.Keyboard.Key;

    public static setInput(){
        this.Q = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.Q)
        this.W = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.W)
    }
    
    public static update(){

        if(Input.Keyboard.JustDown(this.Q)){
            this.character.attacking = true;
            this.character.updateBasicAnimation([
                "basic front attack",
                "basic left attack",
                "basic back attack",
                "basic right attack"
            ], 0)
        }

        if(Input.Keyboard.JustDown(this.W)){
            this.character.attacking = true;
            this.character.play({key: "W", repeat: 0});
        }
        
        this.input.on("pointerdown", (p:Input.Pointer) => {
            this.character.idle = false;
            this.character.changeDirectionInput(p);
            this.mouseLeft = true;
        });

        this.input.on("pointermove",  (p:Input.Pointer) => {
            this.character.changeDirectionInput(p)
            if(this.mouseLeft)
                this.character.idle = false;
        })

        this.input.on("pointerup", ()=>{this.character.setVelocity(0,0), this.character.idle = true, this.mouseLeft = false})
    }
}