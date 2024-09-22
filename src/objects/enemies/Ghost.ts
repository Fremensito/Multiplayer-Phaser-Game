import { Math, Scene} from "phaser";
import { AliveEntity } from "../AliveEntity";
import { IEnemy } from "../../interfaces/Enemy";
import { HealthBar } from "../../classes/HealthBar";
import { WorldManager } from "../../managers/WorldManager";
import { DamageText } from "../../classes/DamageText";
import SAT from "sat";
import { GHOST } from "../../utils/AssetsGlobals";
import { CharacterAnimator } from "../../utils/CharacterAnimator";
import { Game } from "../../scenes/Game";
import { drawLines } from "../../utils/Debugger";
import { NETManager } from "../../managers/NETManager";

export class Ghost extends AliveEntity{
    static animationsGenerated = false;
    // getHitAnims = {
    //     front: "ghost get hit front",
    //     right: "ghost get hit right",
    //     left: "ghost get hit left",
    //     back: "ghost get hit back"
    // }
    attackAnims = {
        front: "ghost attack front",
        right: "ghost attack right",
        left: "ghost attack left",
        back: "ghost attack back"
    }
    getHit
    healthBar: HealthBar
    name = "ghost"
    destroyed = false;
    box: SAT.Box;
    
    constructor(scene:Scene, data:IEnemy){
        super(scene, data.x, data.y, "ghost", 0)
        this.lastPosition.x = this.x
        this.lastPosition.y = this.y
        this.id = data.id;
        this.pointToMove = new Math.Vector2(data.pointToMoveX, data.pointToMoveY);
        this.direction = new Math.Vector2(data.directionX, data.directionY)
        scene.add.existing(this)
        this.speed = data.speed;
        this.idle = false;
        this.attacking = false;
        this.healthBar = new HealthBar(scene, data.x, data.y - 13, data.health);
        // this.setSensor(true)

        if(!Ghost.animationsGenerated){
            CharacterAnimator.generateAnimations(scene,"ghost walk front", "ghost", 0, 7, 8);
            CharacterAnimator.generateAnimations(scene,"ghost walk right",  "ghost", 8, 15, 8);
            CharacterAnimator.generateAnimations(scene,"ghost walk left",  "ghost", 16, 23, 8);
            CharacterAnimator.generateAnimations(scene,"ghost walk back",  "ghost", 24, 31, 8);

            // CharacterAnimator.generateAnimations(scene,this.getHitAnims.front, GHOST.getHit, 0, 1, 6)
            // CharacterAnimator.generateAnimations(scene,this.getHitAnims.right,  GHOST.getHit, 2, 3, 6)
            // CharacterAnimator.generateAnimations(scene,this.getHitAnims.left, GHOST.getHit, 4,5, 6)
            // CharacterAnimator.generateAnimations(scene,this.getHitAnims.back, GHOST.getHit, 6, 6, 6)
            Ghost.animationsGenerated=true
        }

        this.getHit = scene.sound.add(GHOST.getHit);
        this.getHit.volume = 0.5

        //TO DO: quit magic numbers 5, 10 (server side)
        this.generateCollider(data.x - this.boxWidth/2, data.y - this.boxHeight/2, 5, 10)

        // this.generateDebugRect(scene)
        //this.preFX?.addShadow(1, 1, undefined, 10, 0xf10023);
        //this.postFX.addGlow(0xffffff, 3)
        //this.preFX?.addGlow(0xff4040, 6)
        //this.postFX.addGlow(0xff4040, 6)
        this.box.pos.x = (this.x - this.boxWidth/2)
        this.box.pos.y = (this.y - this.boxHeight/2)
    }

    update(delta: number){
        //this.saveLastPosition();
        this.depth = this.y
        if(!this.anims.getName().includes("ghost get hit")){
            this.updateBasicAnimation(["ghost walk front", "ghost walk left", "ghost walk back", "ghost walk right"], -1, 1);
        }else if(!this.anims.isPlaying)
            this.updateBasicAnimation(["ghost walk front", "ghost walk left", "ghost walk back", "ghost walk right"], -1, 1);
        this.updateDirection();
        // if(!this.idle && !this.attacking){
        //     // this.x += this.speed*this.direction.x*delta
        //     // this.y += this.speed*this.direction.y*delta
        // }
        // else{
        //     this.setVelocity(0,0)
        // }
        // if(this.checkPositionGoal()){
        //     this.idle = true;
        //     // this.setVelocity(0,0);
        // }
        this.healthBar.update(this.x, this.y - 13)
        if(Game.debug){
            if(NETManager.room, NETManager.room.state.enemies.get(this.id)){
                Game.graphics.lineStyle(1, 0xff0909);
                drawLines(NETManager.room.state.enemies.get(this.id)!.box)
                Game.graphics.lineStyle(1, 0x13e8e8);
            }
        }
        this.box.pos.x = (this.x - this.boxWidth/2)
        this.box.pos.y = (this.y - this.boxHeight/2)
        //this.updatePartition()
    }

    getDamageClient(damage:number){
        //console.log("got damage")
        // this.updateBasicAnimation([
        //     this.getHitAnims.front, 
        //     this.getHitAnims.left, 
        //     this.getHitAnims.back, 
        //     this.getHitAnims.right],
        //     0,
        //     0
        // )
        this.setTintFill(0xfafafa);
        this.scene.time.addEvent({
            delay: 100,
            callbackScope: this,
            callback: ()=>this.clearTint()
        })
        new DamageText(this.scene, this.x, this.y, Math.RoundTo(damage))
        this.getHit.play();
    }

    getDamage(health:number){
        this.healthBar.quantity = health;
        if(this.healthBar.quantity <=0 ){
           this.die();
        }
    }

    die(){
        this.scene.time.addEvent({
            callback: ()=>{
                this.healthBar.destroy();
                //console.log(WorldManager.enemies.delete(this.id))
                this.destroy()
                let entities = WorldManager.mapPartitions.get(this.partition)
                entities?.splice(entities.indexOf(this), 1)
                WorldManager.enemies.delete(this.id)
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