import { Math } from "phaser";
import { Character } from "../objects/sctythe-girl/Character";
import { NETManager } from "./NETManager";
import { QAbility } from "../classes/combat/scythe-girl/QAbility";
import { SCYTHE_GIRL } from "../utils/AssetsGlobals";

export class CharactersManager{

    static PI = Math.PI2/2

    static useQ(character:Character, vector:Math.Vector2){
        console.log(character.id, NETManager.room.sessionId)
        character.attacking = true;
        character.idle = false;
        character.abilities!.get("Q")!.activate();

        //Because of net desync
        if(character.id == NETManager.room.sessionId)
            character.changeDirectionAttack(vector);
        else{
            character.direction = new Math.Vector2(vector.x, vector.y)
            console.log(character.direction)
        }

        this.selectQDirection(character)
        console.log(character.direction)
        character.updateBasicAnimation([
            "basic front attack",
            "basic left attack",
            "basic back attack",
            "basic right attack"
        ], 0, 0)
    }

    static selectQDirection(character:Character){
        let q = (character.abilities!.get("Q") as QAbility);
        if(character.direction.angle() >= this.PI/4 && character.direction.angle() < 3*this.PI/4){
            // Checks if animation is different of which is being played or the animation of "attack" has finished
            // but the attack button is still being pressed
            if(character.id == NETManager.room.sessionId)
                NETManager.sendQ(character.direction, q.directions.down);
            q.doDamage(q.directions.down, character);
        }else
        if(character.direction.angle() >= 3*this.PI/4 && character.direction.angle() < 5*this.PI/4 ){
            if(character.id == NETManager.room.sessionId)
                NETManager.sendQ(character.direction, q.directions.left);
            q.doDamage(q.directions.left, character);
        }else
        if(character.direction.angle() >= 5*this.PI/4 && character.direction.angle() < 7*this.PI/4){
            if(character.id == NETManager.room.sessionId)
                NETManager.sendQ(character.direction, q.directions.up);
            q.doDamage(q.directions.up, character);
        }else
        if(character.direction.angle() >= 7*this.PI/4 || character.direction.angle() < this.PI/4){
            if(character.id == NETManager.room.sessionId)
                NETManager.sendQ(character.direction, q.directions.right);
            q.doDamage(q.directions.right, character);
        }
    }

    static useW(character:Character, vector:Math.Vector2){
        character.attacking = true;
        character.idle = false;
        character.abilities!.get("W")!.activate();
        character.abilities!.get("W")!.play({key: SCYTHE_GIRL.WVFX, repeat: 0, startFrame: 0});
        character.WAction(vector)
        character.play({key: "W", repeat: 0});
    }

    static pointerDownMove(character:Character, vector:Math.Vector2){
        character.idle = false;
        character.changeDirectionInput(vector);
    }
}