import { Input, Scene } from "phaser";
import { Player } from "../objects/Player";

export class PCControls{
    player: Player;
    W: Input.Keyboard.Key;
    
    constructor(player: Player, scene: Scene){
        this.player  = player;
        this.W = scene.input.keyboard!.addKey(Input.Keyboard.KeyCodes.W);
    }
    
    checkInput(scene: Scene){
        if(Input.Keyboard.JustDown(this.W)){
            
        }
    }
}