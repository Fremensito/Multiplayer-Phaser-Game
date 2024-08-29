import { Physics, Scene, Math } from "phaser";
import { Character } from "./sctythe-girl/Character";
import { ICharacter } from "../interfaces/Character";
import { UI } from "../scenes/UI";
import { NETManager } from "../managers/NETManager";

export class MainCharacter extends Character{
    constructor(scene: Scene, data:ICharacter){
        super(scene, data)
        const ui = new UI(data.abilities, this);
        scene.game.scene.add("UI", ui, true);

        this.postFX.addGlow(0x4b9f04, 2)
    }

    // chooseCharacter(pair: any){
    //     if(pair.bodyA.label == "character" && pair.bodyA.gameObject.id == NETManager.room.sessionId
    //         && pair.bodyB.label != "character"
    //     ){
    //         let character = pair.bodyA.gameObject as Character;
    //         let collidedObject = pair.bodyB.gameObject as Physics.Matter.Sprite;
    //         this.reactToCollision(character, collidedObject);
    //     }
    //     else if(pair.bodyB.label == "character" && pair.bodyB.gameObject.id == NETManager.room.sessionId
    //         && pair.bodyA.label != "character"
    //     ){
    //         let character = pair.bodyB.gameObject as Character;
    //         let collidedObject = pair.bodyA.gameObject as Physics.Matter.Sprite;
    //         this.reactToCollision(character, collidedObject);
    //     }
    // }

    // reactToCollision(character:Character, collidedObject:Physics.Matter.Sprite){
    //     console.log(character.id, NETManager.room.sessionId)
    //     if(this.id == NETManager.room.sessionId){
    //         console.log(character.x, character.y)
    //         let new_direction = (new Math.Vector2(character.x-collidedObject.x, character.y - collidedObject.y)).normalize();
    //         this.x += new_direction.x * this.speed
    //         this.y += new_direction.y * this.speed
    //     }
    // }
}