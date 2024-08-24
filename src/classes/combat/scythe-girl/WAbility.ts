import { Scene } from "phaser";
import { IAbility } from "../../../interfaces/Ability";
import { Enemy } from "../../../objects/Enemy";
import { Character } from "../../../objects/sctythe-girl/Character";
import { WorldManager } from "../../../managers/WorldManager";
import { CombatAbility } from "../CombatAbility";

export class WAbility extends CombatAbility{

    scene: Scene;

    hitbox: MatterJS.BodyType;
    enemiesHit = new Array<Enemy>()
    character:Character
    damage = 10

    constructor(ability:IAbility, scene:Scene, character: Character){
        super(ability)
        this.scene = scene;
        this.createHitbox(character)
        this.addCollisions()
        this.character = character
    }

    createHitbox(character:Character){
        this.hitbox = this.scene.matter.bodies.rectangle(character.x, character.y, this.range*2, this.range*2);
        this.hitbox.label = "W"
        this.addToWorld(this.hitbox)
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

    //TO DO
    //Eliminate unnecesary access to the dictonary
    addCollisions(){
        this.scene.matter.world.on("collisionstart", (event:any)=>{
            for(let i=0; i < event.pairs.length; i++){
                let pair = event.pairs[i]
                if(pair.bodyA.label == "W" && !this.enemiesHit.includes(pair.bodyB.gameObject))
                    this.attack(pair.bodyB)
                else if(pair.bodyB.label == "W" && !this.enemiesHit.includes(pair.bodyA.gameObject))
                    this.attack(pair.bodyA)
            }
        })

        this.scene.matter.world.on("collisionend", (event:any)=>{
            for(let i=0; i <event.pairs.length; i++){
                let pair = event.pairs[i]
                if(pair.bodyA.label == "W"){
                    this.enemiesHit.splice(this.enemiesHit.indexOf(pair.bodyB.gameObject),1)
                }
                else if(pair.bodyB.label == "W"){
                    this.enemiesHit.splice(this.enemiesHit.indexOf(pair.bodyA.gameObject), 1)
                }
            }
        })
    }

    attack(body: any){
        let enemy = WorldManager.enemies.get(body.gameObject.id)!
        this.enemiesHit.push(enemy);
        if(this.character?.anims.getName() == "W" && this.character?.anims.isPlaying)
            enemy.getDamageClient(this.damage);
    }

    doDamage(){
        this.enemiesHit.forEach(e=>e.getDamageClient(this.damage))
    }

    updateW(delta: number){
        super.update(delta);
        this.hitbox.position.x = this.character.x;
        this.hitbox.position.y = this.character.y;
    }

    filterNulls(){
        this.enemiesHit = this.enemiesHit.filter(e=>e != null)
    }
}