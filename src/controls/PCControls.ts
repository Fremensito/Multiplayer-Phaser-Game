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

        if(!this.character.attacking){
            if(Input.Keyboard.JustDown(this.Q) && this.character.abilities.get("Q")!.available){
                this.character.attacking = true;
                this.character.abilities.get("Q")!.activate();
                this.character.changeDirectionAttack(this.input.mousePointer)
                this.character.updateBasicAnimation([
                    "basic front attack",
                    "basic left attack",
                    "basic back attack",
                    "basic right attack"
                ], 0, 1)
            }
            else if(Input.Keyboard.JustDown(this.W) && this.character.abilities.get("W")!.available){
                this.character.attacking = true;
                this.character.abilities.get("W")!.activate();
                this.character.WAction(this.input.mousePointer)
                this.character.play({key: "W", repeat: 0});
            }
        }

        // if(Input.Keyboard.JustDown(this.W)){
        //     this.character.attacking = true;
        //     this.character.play({key: "W", repeat: 0});
        // }
        
        this.input.on("pointerdown", (p:Input.Pointer) => {
            this.character.idle = false;
            this.character.changeDirectionInput(p);
            this.mouseLeft = true;
        });

        this.input.on("pointermove",  (p:Input.Pointer) => {
            if(this.mouseLeft){
                this.character.changeDirectionInput(p);
                this.character.idle = false;
            }
        })

        this.input.on("pointerup", ()=>{this.mouseLeft = false})
    }
}