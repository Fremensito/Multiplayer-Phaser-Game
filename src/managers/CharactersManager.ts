import { Math } from "phaser";
import { AliveEntity } from "../objects/AliveEntity";

export class CharactersManager{

    PI = Math.PI2/2

    pointerDownMove(character:AliveEntity, vector:Math.Vector2){
        character.idle = false;
        character.changeDirectionInput(vector);
    }
}