import { Math } from "phaser";
import { CharactersManager } from "../../managers/CharactersManager";
import { ScytheGirl } from "./ScytheGirl";
import { NETManager } from "../../managers/NETManager";
import { SCYTHE_GIRL } from "../../utils/AssetsGlobals";
import { ScytheGirlNetManager } from "./ScytheGirlNetManager";
import { QAbility } from "../../classes/combat/scythe-girl/QAbility";

export class ScytheGirlManager extends CharactersManager{
    useQ(character:ScytheGirl, vector:Math.Vector2){
        //console.log(character.id, NETManager.room.sessionId)
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
        //console.log(character.direction)
        character.updateBasicAnimation([
            character.attackAnimations.front,
            character.attackAnimations.left,
            character.attackAnimations.back,
            character.attackAnimations.right
        ], 0, 0)
    }

    selectQDirection(character:ScytheGirl){
        let q = (character.abilities!.get("Q") as QAbility);
        if(character.direction.angle() >= this.PI/4 && character.direction.angle() < 3*this.PI/4){
            // Checks if animation is different of which is being played or the animation of "attack" has finished
            // but the attack button is still being pressed
            if(character.id == NETManager.room.sessionId)
                ScytheGirlNetManager.sendQ(character.direction, q.directions.down);
            q.doDamage(q.directions.down);
        }else
        if(character.direction.angle() >= 3*this.PI/4 && character.direction.angle() < 5*this.PI/4 ){
            if(character.id == NETManager.room.sessionId)
                ScytheGirlNetManager.sendQ(character.direction, q.directions.left);
            q.doDamage(q.directions.left);
        }else
        if(character.direction.angle() >= 5*this.PI/4 && character.direction.angle() < 7*this.PI/4){
            if(character.id == NETManager.room.sessionId)
                ScytheGirlNetManager.sendQ(character.direction, q.directions.up);
            q.doDamage(q.directions.up);
        }else
        if(character.direction.angle() >= 7*this.PI/4 || character.direction.angle() < this.PI/4){
            if(character.id == NETManager.room.sessionId)
                ScytheGirlNetManager.sendQ(character.direction, q.directions.right);
            q.doDamage(q.directions.right);
        }
    }

    useW(character:ScytheGirl, vector:Math.Vector2){
        character.attacking = true;
        character.idle = false;
        character.abilities!.get("W")!.activate();
        character.abilities!.get("W")!.play({key: SCYTHE_GIRL.WVFX, repeat: 0, startFrame: 0});
        character.WAction(vector)
        character.play({key: "W", repeat: 0});
    }
}