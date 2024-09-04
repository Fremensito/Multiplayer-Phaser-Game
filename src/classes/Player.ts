import { AliveEntity } from "../objects/AliveEntity";

export class Player{
    character: AliveEntity;
    constructor(character: AliveEntity, mainPlayer: boolean){
        this.character = character;
        this.character.mainPlayer = mainPlayer;
    }
}