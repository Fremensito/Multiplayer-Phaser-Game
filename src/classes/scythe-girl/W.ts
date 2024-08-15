import { Scene } from "phaser";
import { IAbility } from "../../interfaces/Ability";
import { Ability } from "../Ability";
import { Character } from "../../objects/Character";

export class W extends Ability{
    hitbox: MatterJS.BodyType

    constructor(ability:IAbility, scene:Scene, character: Character){
        super(ability, scene);
        this.scene = scene;
    }
}