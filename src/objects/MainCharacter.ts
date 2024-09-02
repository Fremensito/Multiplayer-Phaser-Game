import { Scene} from "phaser";
import { Character } from "./sctythe-girl/ScytheGirl";
import { ICharacter } from "../interfaces/Character";
import { UI } from "../scenes/UI";

export class MainCharacter extends Character{
    constructor(scene: Scene, data:ICharacter){
        super(scene, data)
        const ui = new UI(data.abilities, this);
        scene.game.scene.add("UI", ui, true);

        this.postFX.addGlow(0x4b9f04, 2)
    }
}