import { Math } from "phaser";
import { Character } from "../objects/Character";
import { Q } from "../classes/scythe-girl/Q";
import { NETManager } from "./NETManager";

export class CharactersManager{

    static PI = Math.PI2/2

    static useQ(character:Character, vector:Math.Vector2){
        character.attacking = true;
        character.idle = false;
        character.abilities.get("Q")!.activate();
        character.changeDirectionAttack(vector);
        this.doQDamage(character)
        character.updateBasicAnimation([
            "basic front attack",
            "basic left attack",
            "basic back attack",
            "basic right attack"
        ], 0, 1)
    }

    static doQDamage(character:Character){
        if(character.direction.angle() >= this.PI/4 && character.direction.angle() < 3*this.PI/4){
            // Checks if animation is different of which is being played or the animation of "attack" has finished
            // but the attack button is still being pressed
            //(character.abilities.get("Q") as Q).enemiesDown.forEach(e => e.getDamage(10))
           NETManager.sendQ(character.direction, (character.abilities.get("Q") as Q).directions.down)
        }else
        if(character.direction.angle() >= 3*this.PI/4 && character.direction.angle() < 5*this.PI/4 ){
            //(character.abilities.get("Q") as Q).enemiesLeft.forEach(e => e.getDamage(10))
            NETManager.sendQ(character.direction, (character.abilities.get("Q") as Q).directions.left)
        }else
        if(character.direction.angle() >= 5*this.PI/4 && character.direction.angle() < 7*this.PI/4){
            //(character.abilities.get("Q") as Q).enemiesUp.forEach(e => e.getDamage(10))
            NETManager.sendQ(character.direction, (character.abilities.get("Q") as Q).directions.up)
        }else
        if(character.direction.angle() >= 7*this.PI/4 || character.direction.angle() < this.PI/4){
            //(character.abilities.get("Q") as Q).enemiesRight.forEach(e => e.getDamage(10))
            NETManager.sendQ(character.direction, (character.abilities.get("Q") as Q).directions.right)
        }
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