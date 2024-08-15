import { Scene } from "phaser";
import { IAbility } from "../../interfaces/Ability";
import { Ability } from "../Ability";
import { Character } from "../../objects/Character";
import { Enemy } from "../../objects/Enemy";
import { WorldManager } from "../../managers/WorldManager";

export class Q extends Ability{

    right: MatterJS.BodyType;
    down: MatterJS.BodyType;
    left: MatterJS.BodyType;
    up: MatterJS.BodyType;
    offset = 14
    scene: Scene;
    enemiesToHit = Array<Enemy>
    directions = {
        up: "QUp",
        right: "QRight",
        down: "QDown",
        left: "QLeft"
    }

    enemiesUp = new Array<Enemy>
    enemiesRight = new Array<Enemy>
    enemiesDown = new Array<Enemy>
    enemiesLeft = new Array<Enemy>

    constructor(ability:IAbility, scene:Scene, character: Character){
        super(ability, scene)
        this.scene = scene
        this.createRight(character)
        this.createDown(character)
        this.createLeft(character)
        this.createUp(character)
        this.addCollisions();
    }

    createRight(character:Character){
        //this.right = this.scene.matter.bodies.rectangle(character.x + 13, character.y, 15, 30)
        this.right = this.scene.matter.bodies.rectangle(character.x + this.offset, character.y, 16, 30);
        this.right.label = this.directions.right
        this.addToWorld(this.right)
    }

    createDown(character:Character){
        this.down = this.scene.matter.bodies.rectangle(character.x, character.y+this.offset, 30, 16);
        this.down.label = this.directions.down
        this.addToWorld(this.down)
    }

    createLeft(character: Character){
        this.left = this.scene.matter.bodies.rectangle(character.x - this.offset, character.y, 16,30)
        this.left.label = this.directions.left;
        this.addToWorld(this.left)
    }

    createUp(character:Character){
        this.up = this.scene.matter.bodies.rectangle(character.x, character.y - this.offset, 30, 16)
        this.up.label = this.directions.up;
        this.addToWorld(this.up)
    }

    addToWorld(hitbox: MatterJS.BodyType){
        hitbox.isSensor = true;
        hitbox.frictionAir = 0;
        hitbox.friction = 0;
        hitbox.frictionStatic = 0;
        hitbox.collisionFilter = {
            category: WorldManager.categories.abilities,
            mask: WorldManager.categories.enemies,
            group: -1
        }
        this.scene.matter.world.add(hitbox)
    }

    addCollisions(){
        this.scene.matter.world.on("collisionstart", (event:any)=>{
            for(let i = 0; i < event.pairs.length; i++){
                let pair = event.pairs[i]
                if(pair.bodyA.label == this.directions.up || pair.bodyB.label == this.directions.up){
                    if(pair.bodyA.label == this.directions.up)
                        this.enemiesUp.push(pair.bodyB.gameObject)
                    else
                        this.enemiesUp.push(pair.bodyA.gameObject)
                }
                else if(pair.bodyA.label == this.directions.right || pair.bodyB.label == this.directions.right){
                    if(pair.bodyA.label == this.directions.right)
                        this.enemiesRight.push(pair.bodyB.gameObject)
                    else
                        this.enemiesRight.push(pair.bodyA.gameObject)
                }
                else if(pair.bodyA.label == this.directions.down || pair.bodyB.label == this.directions.down){
                    if(pair.bodyA.label == this.directions.down)
                        this.enemiesDown.push(pair.bodyB.gameObject)
                    else
                        this.enemiesDown.push(pair.bodyA.gameObject)
                }
                else if(pair.bodyA.label == this.directions.left || pair.bodyB.label == this.directions.left){
                    if(pair.bodyA.label == this.directions.left)
                        this.enemiesLeft.push(pair.bodyB.gameObject)
                    else
                        this.enemiesLeft.push(pair.bodyA.gameObject)
                }
                //console.log(pair.bodyA.label, pair.bodyB.label)
            }
        })

        this.scene.matter.world.on("collisionend", (event:any)=>{
            for(let i = 0; i < event.pairs.length; i++){
                let pair = event.pairs[i]
                //console.log(pair)
                if(pair.bodyA.label == this.directions.up || pair.bodyB.label == this.directions.up){
                    if(pair.bodyA.label == this.directions.up)
                        this.enemiesUp.splice(this.enemiesUp.indexOf(pair.bodyB.gameObject), 1)
                    else
                        this.enemiesUp.splice(this.enemiesUp.indexOf(pair.bodyA.gameObject), 1)
                }
                else if(pair.bodyA.label == this.directions.right || pair.bodyB.label == this.directions.right){
                    if(pair.bodyA.label == this.directions.right)
                        this.enemiesRight.splice(this.enemiesRight.indexOf(pair.bodyB.gameObject), 1)
                    else
                        this.enemiesRight.splice(this.enemiesRight.indexOf(pair.bodyA.gameObject), 1)
                }
                else if(pair.bodyA.label == this.directions.down || pair.bodyB.label == this.directions.down){
                    if(pair.bodyA.label == this.directions.down)
                        this.enemiesDown.splice(this.enemiesDown.indexOf(pair.bodyB.gameObject), 1)
                    else
                        this.enemiesDown.splice(this.enemiesDown.indexOf(pair.bodyA.gameObject), 1)
                }
                else if(pair.bodyA.label == this.directions.left || pair.bodyB.label == this.directions.left){
                    if(pair.bodyA.label == this.directions.left)
                        this.enemiesLeft.splice(this.enemiesLeft.indexOf(pair.bodyB.gameObject), 1)
                    else
                        this.enemiesLeft.splice(this.enemiesLeft.indexOf(pair.bodyA.gameObject), 1)
                }
                //console.log(pair.bodyA.label, pair.bodyB.label)
            }
        })
    }

    updateQ(character: Character){
        this.right.position.x = character.x + this.offset;
        this.right.position.y = character.y;

        this.down.position.x = character.x;
        this.down.position.y = character.y + this.offset;

        this.left.position.x = character.x - this.offset;
        this.left.position.y = character.y;

        this.up.position.x = character.x;
        this.up.position.y = character.y - this.offset;
    }
}