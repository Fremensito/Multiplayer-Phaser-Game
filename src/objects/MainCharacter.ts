import { Math, Physics, Scene } from "phaser";
import { Character } from "./sctythe-girl/Character";
import { ICharacter } from "../interfaces/Character";
import { UI } from "../scenes/UI";
import { WorldManager } from "../managers/WorldManager";

export class MainCharacter extends Character{
    constructor(scene: Scene, data:ICharacter){
        super(scene, data)
        const ui = new UI(data.abilities, this);
        scene.game.scene.add("UI", ui, true);

        this.scene.matter.world.on("collisionstart", (event:any)=>{
            for(let i = 0; i < event.pairs.length; i++){
                let pair = event.pairs[i]
                if(pair.bodyA.gameObject instanceof MainCharacter){
                    let character = pair.bodyA.gameObject as Character;
                    let collidedObject = pair.bodyB.gameObject as Physics.Matter.Sprite;
                    this.reactToCollision(character, collidedObject);
                }
                else if(pair.bodyB.gameObject instanceof MainCharacter){
                    let character = pair.bodyB.gameObject as Character;
                    let collidedObject = pair.bodyA.gameObject as Physics.Matter.Sprite;
                    this.reactToCollision(character, collidedObject);
                }
            }
        })

        this.scene.matter.world.on("collisionactive", (event:any)=>{
            for(let i = 0; i < event.pairs.length; i++){
                let pair = event.pairs[i]
                if(pair.bodyA.gameObject instanceof MainCharacter){
                    let character = pair.bodyA.gameObject as Character;
                    let collidedObject = pair.bodyB.gameObject as Physics.Matter.Sprite;
                    this.reactToCollision(character, collidedObject);
                }
                else if(pair.bodyB.gameObject instanceof MainCharacter){
                    let character = pair.bodyB.gameObject as Character;
                    let collidedObject = pair.bodyA.gameObject as Physics.Matter.Sprite;
                    this.reactToCollision(character, collidedObject);
                }
            }
        })
    }

    reactToCollision(character:Character, collidedObject:Physics.Matter.Sprite){
        //let position = {x: this.x, y: this.y}
        console.log(collidedObject)
        console.log(character)
        let new_direction = (new Math.Vector2(character.x-collidedObject.x, character.y - collidedObject.y)).normalize();
        console.log(new_direction)
        console.log(this.x)
        this.x += new_direction.x * this.speed
        console.log(this.x)
        this.y += new_direction.y * this.speed
        console.log("collided")
        //let distance = MatterJS.Vector.magnitude(new_direction);

        // let futureDistance = MatterJS.Vector.magnitude(MatterJS.Vector.sub(collidedObject.body!.position, 
        //     {
        //         x: character.body!.position.x + this.speed * this.direction.x, 
        //         y: character.body!.position.y + this.speed * this.direction.y
        //     }
        // ));
        // if(futureDistance < distance){
            
        // }
    }
}