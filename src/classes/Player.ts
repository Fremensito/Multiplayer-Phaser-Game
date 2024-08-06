import { ICharacter } from "../interfaces/Character";

export class Player{
    character: ICharacter

    constructor(character: ICharacter){
        this.character = character;
    }
}