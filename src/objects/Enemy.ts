import { FX, Math, Physics, Scene, Scenes} from "phaser";
import { AliveEntity } from "./AliveEntity";
import { IEnemy } from "../interfaces/Enemy";
import { HealthBar } from "../classes/HealthBar";
import { WorldManager } from "../managers/WorldManager";
import { DamageText } from "../classes/DamageText";
import { Game } from "../scenes/Game";

export class Enemy extends AliveEntity{
    static animationsGenerated = false;
    getHitAnims = {
        front: "ghost get hit front",
        right: "ghost get hit right",
        left: "ghost get hit left",
        back: "ghost get hit back"
    }
    getHit
    healthBar: HealthBar
    name = "ghost"
    destroyed = false;
    
    constructor(scene:Scene, data:IEnemy){
        super(scene.matter.world, data.x, data.y, "ghost", 0, {
            label:"ghost",
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
        })
        this.id = data.id;
        this.pointToMove = new Math.Vector2(data.pointToMoveX, data.pointToMoveY);
        this.direction = new Math.Vector2(data.directionX, data.directionY)
        scene.add.existing(this)
        this.speed = data.speed;
        this.idle = false;
        this.attacking = false;
        this.healthBar = new HealthBar(scene, data.x, data.y - 13, data.health);
        // this.setSensor(true)

        if(!Enemy.animationsGenerated){
            this.generateAnimations("ghost walk front", "ghost", 0, 7, 8);
            this.generateAnimations("ghost walk right",  "ghost", 8, 15, 8);
            this.generateAnimations("ghost walk left",  "ghost", 16, 23, 8);
            this.generateAnimations("ghost walk back",  "ghost", 24, 31, 8);

            this.generateAnimations(this.getHitAnims.front, Game.ghostSprites.ghostGetHit, 0, 1, 6)
            this.generateAnimations(this.getHitAnims.right,  Game.ghostSprites.ghostGetHit, 2, 3, 6)
            this.generateAnimations(this.getHitAnims.left, Game.ghostSprites.ghostGetHit, 4,5, 6)
            this.generateAnimations(this.getHitAnims.back, Game.ghostSprites.ghostGetHit, 6, 6, 6)
            Enemy.animationsGenerated=true
        }

        this.getHit = scene.sound.add("getHit");
        this.getHit.volume = 0.5

        this.setBody({width:10, height:20})
        this.setSensor(true)

        //this.preFX?.addShadow(1, 1, undefined, 10, 0xf10023);
        //this.postFX.addGlow(0xffffff, 3)
        //this.preFX?.addGlow(0xff4040, 6)
        //this.postFX.addGlow(0xff4040, 6)
        this.setCollisionCategory(WorldManager.categories.enemies);
        //this.setCollidesWith(WorldManager.categories.abilities)
        this.setCollisionGroup(WorldManager.collideGroups.enemies);
    }

    update(delta: number){
        this.depth = this.y
        if(!this.anims.getName().includes("ghost get hit")){
            this.updateBasicAnimation(["ghost walk front", "ghost walk left", "ghost walk back", "ghost walk right"], -1, 1);
        }else if(!this.anims.isPlaying)
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

    getDamageClient(damage:number){
        //console.log("got damage")
        this.updateBasicAnimation([
            this.getHitAnims.front, 
            this.getHitAnims.left, 
            this.getHitAnims.back, 
            this.getHitAnims.right],
            0,
            0
        )
        new DamageText(this.scene, this.x, this.y, damage)
        this.getHit.play();
    }

    getDamage(health:number){
        this.healthBar.quantity = health;
        if(this.healthBar.quantity <=0 ){
           this.die();
        }
    }

    die(){
        this.scene.matter.world.remove(this)
        this.scene.time.addEvent({
            callback: ()=>{
                this.healthBar.destroy();
                console.log(WorldManager.enemies.delete(this.id))
                this.destroy()
            },
            loop: false,
            delay: 100,
            callbackScope:this
        })
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