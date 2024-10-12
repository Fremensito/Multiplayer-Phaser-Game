import { Math, Scene} from "phaser";
import { AliveEntity } from "../AliveEntity";
import { IEnemy } from "../../interfaces/Enemy";
import { HealthBar } from "../../classes/HealthBar";
import { WorldManager } from "../../managers/WorldManager";
import { DamageText } from "../../classes/DamageText";
import SAT from "sat";
import { GHOST } from "../../utils/AssetsGlobals";
import { Animator } from "../../utils/Animator";
import { Game } from "../../scenes/Game";
import { drawLines } from "../../utils/Debugger";
import { NETManager } from "../../managers/NETManager";
import { EnemyStraightAttack } from "../../classes/combat/basic-enemies/EnemyStraightAttack";

export class Ghost extends AliveEntity{
    // getHitAnims = {
    //     front: "ghost get hit front",
    //     right: "ghost get hit right",
    //     left: "ghost get hit left",
    //     back: "ghost get hit back"
    // }
    walkingAnims = {
        front: "ghost walk front",
        right: "ghost walk right",
        left: "ghost walk left",
        back: "ghost walk back"
    }

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
    bassicAttack: EnemyStraightAttack;
    
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
            Animator.generateCharacterAnimations(scene,this.walkingAnims.front, "ghost", 0, 7, 8);
            Animator.generateCharacterAnimations(scene,this.walkingAnims.right,  "ghost", 8, 15, 8);
            Animator.generateCharacterAnimations(scene,this.walkingAnims.left,  "ghost", 16, 23, 8);
            Animator.generateCharacterAnimations(scene,this.walkingAnims.back,  "ghost", 24, 31, 8);

            Animator.generateCharacterAnimations(scene,this.attackAnims.front, GHOST.attack, 0, 6, data.abilities[0].speed)
            Animator.generateCharacterAnimations(scene,this.attackAnims.right,  GHOST.attack, 7, 13, data.abilities[0].speed)
            Animator.generateCharacterAnimations(scene,this.attackAnims.left, GHOST.attack, 14,20, data.abilities[0].speed)
            Animator.generateCharacterAnimations(scene,this.attackAnims.back, GHOST.attack, 21, 27, data.abilities[0].speed)
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
        this.bassicAttack = new EnemyStraightAttack(scene, data.abilities[0], this.x, this.y, GHOST.attackVFX, 
            {
                up: "GhostUp",
                right: "GhostRight",
                down: "GhostDown",
                left: "GhostLeft"
            });
    }

    update(delta: number){
        //this.saveLastPosition();
        this.depth = this.y
        if(!this.attacking)
            this.updateBasicAnimation([this.walkingAnims.front, this.walkingAnims.left, 
            this.walkingAnims.back, this.walkingAnims.right], -1, 1);
        // else
        //     this.updateBasicAnimation([this.attackAnims.front, this.attackAnims.left, this.attackAnims.back, this.attackAnims.right],
        //     0, 0)
        
        if(this.attacking && !this.anims.isPlaying)
            this.attacking = false;
        
        this.updateDirection();
        this.healthBar.update(this.x, this.y - 13)
        if(Game.debug){
            if(NETManager.room, NETManager.room.state.basicMeleeEnemies.get(this.id)){
                Game.graphics.lineStyle(1, 0xff0909);
                drawLines(NETManager.room.state.basicMeleeEnemies.get(this.id)!.box)
                Game.graphics.lineStyle(1, 0x13e8e8);
            }
        }
        this.bassicAttack.update(this)
        this.box.pos.x = (this.x - this.boxWidth/2)
        this.box.pos.y = (this.y - this.boxHeight/2)
        //this.updatePartition()
    }

    getDamageClient(damage:number){
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
}