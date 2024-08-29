import { FX, Math, Scene} from "phaser";
import { AliveEntity } from "./AliveEntity";
import { IEnemy } from "../interfaces/Enemy";
import { HealthBar } from "../classes/HealthBar";
import { WorldManager } from "../managers/WorldManager";
import { DamageText } from "../classes/DamageText";
import { Game } from "../scenes/Game";
import SAT from "sat";

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
    box: SAT.Box;
    
    constructor(scene:Scene, data:IEnemy){
        super(scene, data.x, data.y, "ghost", 0)
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
        
        this.boxWidth = 5;
        this.boxHeight = 10;
        this.box = new SAT.Box(new SAT.Vector(data.x - this.boxWidth/2, data.y - this.boxHeight/2), this.boxWidth, this.boxHeight)
        this.generateDebugRect(scene)
        //this.preFX?.addShadow(1, 1, undefined, 10, 0xf10023);
        //this.postFX.addGlow(0xffffff, 3)
        //this.preFX?.addGlow(0xff4040, 6)
        //this.postFX.addGlow(0xff4040, 6)
        this.box.pos.x = (this.x - this.boxWidth/2)
        this.box.pos.y = (this.y - this.boxHeight/2)
    }

    update(delta: number){
        this.depth = this.y
        if(!this.anims.getName().includes("ghost get hit")){
            this.updateBasicAnimation(["ghost walk front", "ghost walk left", "ghost walk back", "ghost walk right"], -1, 1);
        }else if(!this.anims.isPlaying)
            this.updateBasicAnimation(["ghost walk front", "ghost walk left", "ghost walk back", "ghost walk right"], -1, 1);
        this.updateDirection();
        if(!this.idle && !this.attacking){
            this.x += this.speed*this.direction.x*delta
            this.y += this.speed*this.direction.y*delta
        }
        // else{
        //     this.setVelocity(0,0)
        // }
        if(this.checkPositionGoal()){
            this.idle = true;
            // this.setVelocity(0,0);
        }
        this.healthBar.update(this.x, this.y - 13)
        this.debug();
        this.box.pos.x = (this.x - this.boxWidth/2)
        this.box.pos.y = (this.y - this.boxHeight/2)
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
                this.boxRect.destroy();
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