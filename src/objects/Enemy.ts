import { Math, Scene } from "phaser";
import { AliveEntity } from "./AliveEntity";
import { IEnemy } from "../interfaces/Enemy";
import { HealthBar } from "../classes/HealthBar";
import { WorldManager } from "../managers/WorldManager";
import { DamageText } from "../classes/DamageText";

export class Enemy extends AliveEntity{
    healthBar: HealthBar
    bodyWidth: number
    bodyHeight: number
    name = "ghost"
    constructor(scene:Scene, data:IEnemy){
        super(scene.matter.world, data.x, data.y, "ghost", 0, {label:"ghost"})
        scene.add.existing(this)
        this.speed = data.speed;
        this.idle = true;
        this.attacking = false;
        this.health = 10;
        this.healthBar = new HealthBar(scene, data.x, data.y - 13, 100);

        this.pointToMove = new Math.Vector2(0,0);
        this.direction = new Math.Vector2(0,1);
        // this.setSensor(true)

        this.generateAnimations("ghost walk front", "ghost", 0, 7, 8);
        this.generateAnimations("ghost walk right",  "ghost", 8, 15, 8);
        this.generateAnimations("ghost walk left",  "ghost", 16, 23, 8);
        this.generateAnimations("ghost walk back",  "ghost", 24, 31, 8);

        this.setBody({width:10, height:20})
        this.bodyHeight=20;
        this.bodyWidth=10;
        this.setSensor(true)

        scene.time.addEvent({
            callback: this.randomMovement,
            loop: true,
            repeat: -1,
            delay: 5000,
            callbackScope: this
        })

        WorldManager.enemies.set("hello", this)
        this.setCollisionCategory(WorldManager.categories.enemies);
        //this.setCollidesWith(WorldManager.categories.abilities)
        this.setCollisionGroup(WorldManager.collideGroups.enemies);
    }

    update(delta: number){
        this.depth = this.y
        this.updateBasicAnimation(["ghost walk front", "ghost walk left", "ghost walk back", "ghost walk right"], -1, 1);
        this.updateDirection();
        if(!this.idle && !this.attacking){
            this.setVelocityX(this.direction.x * this.speed);
            this.setVelocityY(this.direction.y * this.speed);
        }
        else{
            this.setVelocity(0,0)
        }
        if(this.checkPositionGoal()){
            this.idle = true;
            this.setVelocity(0,0);
        }
        this.healthBar.update(this.x, this.y - 13)
    }

    getDamage(damage:number){
        //console.log("got damage")
        new DamageText(this.scene, this.x, this.y, damage)
        this.healthBar.quantity -= damage
    }

    randomMovement(){
        if(Math.Between(1, 10) > 2){
            this.idle = false
            let x = Math.Between(280, 400)
            let y = Math.Between(280, 400)
            this.changeDirectionInput(new Math.Vector2(x,y))
        }
    }
}