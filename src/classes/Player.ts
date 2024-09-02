import { AliveEntity } from "../objects/AliveEntity";

export class Player{
    character: AliveEntity;
    constructor(character: AliveEntity){
        this.character = character;
    }
}