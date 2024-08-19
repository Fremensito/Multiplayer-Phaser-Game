import { Math } from "phaser";
import { Character } from "../objects/Character";
import { NETManager } from "./NETManager";
import { QAbility } from "../classes/scythe-girl/QAbility";
import { WAbility } from "../classes/scythe-girl/WAbility";

export class CharactersManager{

    static PI = Math.PI2/2

    static useQ(character:Character, vector:Math.Vector2){
        character.attacking = true;
        character.idle = false;
        character.abilities.get("Q")!.activate();
        character.changeDirectionAttack(vector);
        if(character.character.id == NETManager.id)
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
            NETManager.sendQ(character.direction, (character.abilities.get("Q") as QAbility).directions.down);
            (character.abilities.get("Q") as QAbility).enemiesDown.forEach(e => e.getDamageClient(10))
        }else
        if(character.direction.angle() >= 3*this.PI/4 && character.direction.angle() < 5*this.PI/4 ){
            NETManager.sendQ(character.direction,  (character.abilities.get("Q") as QAbility).directions.left);
            (character.abilities.get("Q") as QAbility).enemiesLeft.forEach(e => e.getDamageClient(10))
        }else
        if(character.direction.angle() >= 5*this.PI/4 && character.direction.angle() < 7*this.PI/4){
            (character.abilities.get("Q") as QAbility).enemiesUp.forEach(e => e.getDamageClient(10))
            NETManager.sendQ(character.direction,  (character.abilities.get("Q") as QAbility).directions.up)
        }else
        if(character.direction.angle() >= 7*this.PI/4 || character.direction.angle() < this.PI/4){
            NETManager.sendQ(character.direction,  (character.abilities.get("Q") as QAbility).directions.right);
            (character.abilities.get("Q") as QAbility).enemiesRight.forEach(e => e.getDamageClient(10))
        }
    }

    static useW(character:Character, vector:Math.Vector2){
        character.attacking = true;
        character.idle = false;
        character.abilities.get("W")!.activate();
        character.WAction(vector)
        character.play({key: "W", repeat: 0});
        (character.abilities.get("W") as WAbility).doDamage();
    }

    static pointerDownMove(character:Character, vector:Math.Vector2){
        character.idle = false;
        character.changeDirectionInput(vector);
    }
}