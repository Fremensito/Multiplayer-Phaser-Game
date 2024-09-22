import { Scene } from "phaser";
import { ScytheGirl } from "../objects/sctythe-girl/ScytheGirl";
import { ICharacter } from "../interfaces/Character";
import { classes } from "../utils/Classes";

export class CharactersProvider{

    static callbacks = {
        [classes.scytheGirl] : this.generateScytheGirl
    }

    private static generateScytheGirl(scene: Scene, data: ICharacter){
        return new ScytheGirl(scene, data)
    }
}