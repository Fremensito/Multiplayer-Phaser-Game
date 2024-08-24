import { Scene } from "phaser";
import { Character } from "./sctythe-girl/Character";
import { ICharacter } from "../interfaces/Character";

export class MainCharacter extends Character{
    constructor(scene: Scene, data:ICharacter){
        super(scene, data)
    }
}