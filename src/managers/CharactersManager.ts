import { Animations, Math } from "phaser";
import { Character } from "../objects/Character";

export class CharactersManager{
    static useQ(character:Character, vector:Math.Vector2){
        character.attacking = true;
        character.idle = false;
        character.abilities.get("Q")!.activate();
        character.changeDirectionAttack(vector)
        character.updateBasicAnimation([
            "basic front attack",
            "basic left attack",
            "basic back attack",
            "basic right attack"
        ], 0, 1)
    }

    static useW(character:Character, vector:Math.Vector2){
        character.attacking = true;
        character.idle = false;
        character.abilities.get("W")!.activate();
        character.WAction(vector)
        character.play({key: "W", repeat: 0});
    }

    static pointerDownMove(character:Character, vector:Math.Vector2){
        character.idle = false;
        character.changeDirectionInput(vector);
    }
}