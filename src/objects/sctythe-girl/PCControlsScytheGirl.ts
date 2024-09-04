import { Input, Math} from "phaser";
import { ScytheGirl } from "./ScytheGirl";
import { NETManager } from "../../managers/NETManager";
import { PCControls } from "../../controls/PCControls";
import { ScytheGirlManager } from "./ScytheGirlManager";

export class PCControlsScytheGirl extends PCControls{
    netManager:NETManager;

    constructor(input: Input.InputPlugin){
        super(input)
    }

    updateScytheGirl(character:ScytheGirl, manager: ScytheGirlManager){
        if(!character.attacking){
            if(Input.Keyboard.JustDown(this.Q) && character.abilities!.get("Q")!.available){
                // NETManager.sendQ({
                //     x: this.input.mousePointer.worldX,
                //     y: this.input.mousePointer.worldY
                // })
                // this.character.attacking = true;
                // this.character.abilities.get("Q")!.activate();
                // this.character.changeDirectionAttack(new Math.Vector2(this.input.mousePointer.worldX, this.input.mousePointer.worldY))
                // this.character.updateBasicAnimation([
                //     "basic front attack",
                //     "basic left attack",
                //     "basic back attack",
                //     "basic right attack"
                // ], 0, 1)

                manager.useQ(
                    character,
                    new Math.Vector2(this.input.mousePointer.worldX, this.input.mousePointer.worldY)
                )
            }
            else if(Input.Keyboard.JustDown(this.W) && character.abilities!.get("W")!.available){
                NETManager.sendW({
                    x: this.input.mousePointer.worldX,
                    y: this.input.mousePointer.worldY
                })
                // this.character.attacking = true;
                // this.character.abilities.get("W")!.activate();
                // this.character.WAction(this.input.mousePointer);
                // this.character.play({key: "W", repeat: 0});
                
                manager.useW( 
                    character,
                    new Math.Vector2(this.input.mousePointer.worldX, this.input.mousePointer.worldY))
            }
        }

        // if(Input.Keyboard.JustDown(this.W)){
        //     this.character.attacking = true;
        //     this.character.play({key: "W", repeat: 0});
        // }
        
        super.update(character, manager)
    }
}