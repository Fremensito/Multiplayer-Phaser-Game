import { Input, Math} from "phaser";
import { Character } from "../objects/sctythe-girl/Character";
import { NETManager } from "../managers/NETManager";
import { CharactersManager } from "../managers/CharactersManager";

export class PCControls{
    character: Character;
    input: Input.InputPlugin;
    private mouseLeft = false;
    Q: Input.Keyboard.Key;
    W: Input.Keyboard.Key;
    netManager:NETManager;

    setInput(){
        this.Q = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.Q)
        this.W = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.W)
    }

    update(){
        if(!this.character.attacking){
            if(Input.Keyboard.JustDown(this.Q) && this.character.abilities.get("Q")!.available){
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

                CharactersManager.useQ(
                    this.character,
                    new Math.Vector2(this.input.mousePointer.worldX, this.input.mousePointer.worldY)
                )
            }
            else if(Input.Keyboard.JustDown(this.W) && this.character.abilities.get("W")!.available){
                NETManager.sendW({
                    x: this.input.mousePointer.worldX,
                    y: this.input.mousePointer.worldY
                })
                // this.character.attacking = true;
                // this.character.abilities.get("W")!.activate();
                // this.character.WAction(this.input.mousePointer);
                // this.character.play({key: "W", repeat: 0});
                
                CharactersManager.useW( 
                    this.character,
                    new Math.Vector2(this.input.mousePointer.worldX, this.input.mousePointer.worldY))
            }
        }

        // if(Input.Keyboard.JustDown(this.W)){
        //     this.character.attacking = true;
        //     this.character.play({key: "W", repeat: 0});
        // }
        
        this.input.on("pointerdown", (p:Input.Pointer) => {
            if(p.button === 0){
                NETManager.sendWalk({
                    x: this.input.mousePointer.worldX,
                    y: this.input.mousePointer.worldY
                });
                CharactersManager.pointerDownMove(
                    this.character,
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
                CharactersManager.pointerDownMove(
                    this.character,
                    new Math.Vector2(this.input.mousePointer.worldX, this.input.mousePointer.worldY))
            }
        })

        this.input.on("pointerup", ()=>{this.mouseLeft = false})
    }
}