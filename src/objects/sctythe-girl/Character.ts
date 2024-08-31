import {Scene, Math, GameObjects} from "phaser";
import { ICharacter } from "../../interfaces/Character";
import { AliveEntity } from "../AliveEntity";
import { QAbility } from "../../classes/combat/scythe-girl/QAbility";
import { WAbility } from "../../classes/combat/scythe-girl/WAbility";
import { CombatAbility } from "../../classes/combat/CombatAbility";
import SAT from "sat";
import { SCYTHE_GIRL } from "../../utils/AssetsGlobals";

export class Character extends AliveEntity{
    speed:number;
    idle: boolean;
    attacking: boolean;
    direction:Math.Vector2;
    pointToMove: Math.Vector2;
    boxRect: GameObjects.Rectangle;

    PI = Math.PI2/2;
    created = false

    abilities?: Map<string, CombatAbility>;
    QAbility: QAbility;
    WAbility: WAbility;
    attack_animations = ["basic front attack", "basic right attack", "basic left attack", "basic back attack"]
    //TO DO: ADD TEXTURES ANIMATIONS DEPENDING OF THE CHARACTAR CLASS NAME
    char_class: string;
    character:ICharacter
    delta:number
    name = "character"
    static animationsGenerated = false;
    //rectangle: GameObjects.Rectangle

    WSound;
    QSound;

    debugMode = false;

    constructor(scene: Scene, data:ICharacter){
        super(scene, data.x, data.y, "player", 0);
        this.speed =  data.speed
        this.idle = true;
        this.attacking = false;
        scene.add.existing(this)
        this.id = data.id;

        this.pointToMove = new Math.Vector2(0,0)
        this.direction = new Math.Vector2(0,0)

        this.character = data;
        
        if(!Character.animationsGenerated){
            this.generateAnimations("walk front", SCYTHE_GIRL.walking, 0, 5, 8);
            this.generateAnimations("walk right",   SCYTHE_GIRL.walking, 6, 11, 8);
            this.generateAnimations("walk left",   SCYTHE_GIRL.walking, 12, 17, 8);
            this.generateAnimations("walk back",   SCYTHE_GIRL.walking, 18, 23, 8);

            this.generateAnimations("idle front", SCYTHE_GIRL.idle, 0, 1, 2);
            this.generateAnimations("idle right", SCYTHE_GIRL.idle, 2, 3, 2);
            this.generateAnimations("idle left", SCYTHE_GIRL.idle, 4 ,5 ,2);
            this.generateAnimations("idle back", SCYTHE_GIRL.idle, 6, 7, 2);

            this.generateAnimations(this.attack_animations[0], SCYTHE_GIRL.Q, 0, 6, data.abilities[0].speed);
            this.generateAnimations(this.attack_animations[1], SCYTHE_GIRL.Q, 7, 13, data.abilities[0].speed);
            this.generateAnimations(this.attack_animations[2], SCYTHE_GIRL.Q, 14, 20, data.abilities[0].speed);
            this.generateAnimations(this.attack_animations[3], SCYTHE_GIRL.Q, 21, 27, data.abilities[0].speed);

            this.generateAnimations("W", SCYTHE_GIRL.W, 0, 4, data.abilities[1].speed)
            Character.animationsGenerated = true
        }

        //QAbility.createRight(this);
        this.abilities = new Map<string, CombatAbility>();
        this.abilities.set("Q", new QAbility(scene, data.abilities[0], data.x, data.y, SCYTHE_GIRL.QVFX));
        this.QAbility = this.abilities.get("Q") as QAbility;
        this.abilities.set("W", new WAbility(scene, data.abilities[1], data.x, data.y, SCYTHE_GIRL.WVFX));
        this.WAbility = this.abilities.get("W") as WAbility;
        
        this.WSound = scene.sound.add(SCYTHE_GIRL.WSound);
        this.WSound.volume = 0.5
        this.QSound = scene.sound.add(SCYTHE_GIRL.QSound)
        this.QSound.volume = 0.5

        this.boxHeight = 10;
        this.boxWidth = 10;
        this.box = new SAT.Box(new SAT.Vector(data.x - this.boxWidth/2, data.y - this.boxHeight/2), this.boxWidth, this.boxHeight)
        this.generateDebugRect(scene);
    }


    update(delta:number){
        this.depth = this.y
        this.updateDirection();
        if(!this.idle && !this.attacking){
            this.x += this.speed*this.direction.x*delta
            this.y += this.speed*this.direction.y*delta
            // this.speed = 40;
            // this.x += this.speed*this.direction.x*delta/1000
            // this.y += this.speed*this.direction.y*delta/1000
        }
        else if(this.attacking){
            switch(this.anims.getName()){
                case "W": 
                    if(!this.anims.isPlaying){
                        this.WAbility.clear();
                        this.idle = true;
                        this.attacking = false;
                    }
                    else if(!this.checkPositionGoal()){
                        this.x += this.speed*this.direction.x*delta*3
                        this.y += this.speed*this.direction.y*delta*3
                    }

                    if(this.anims.isPlaying){
                        this.WAbility.doDamage(this)
                    }
                    
                    break;
                case this.attack_animations[0]:
                case this.attack_animations[1]:
                case this.attack_animations[2]:
                case this.attack_animations[3]: //this.setVelocity(0,0); break;
            }
        }
        // else{
        //     this.setVelocity(0,0)
        // }
        if(this.checkPositionGoal()){
            this.idle = true;
            // this.setVelocity(0,0);
        }
        if(!this.attacking)
            this.updateMovement()
        else if(!this.anims.isPlaying)
            this.attacking = false;

        this.QAbility.updatePosition(this);
        this.WAbility.updatePosition(this);
        this.QAbility.update(delta)
        this.WAbility.update(delta)
        //this.WAbility.updateW(delta);
        // console.log("speed: " + this.speed)
        // console.log(this.x, this.y)
        //console.log(this.scene.anims.get("W").duration, 1/12*5*1000)
        // console.log(this.direction)
        //NETManager.sendState(this.idle, this.direction)
        //this.debug();
        this.box.pos.x = (this.x - this.boxWidth/2)
        this.box.pos.y = (this.y - this.boxHeight/2)
    }

    updateMovement(){
        if(!this.idle)
            this.updateBasicAnimation(["walk front", "walk left", "walk back", "walk right"], -1, 1);
        else
            this.updateBasicAnimation(["idle front", "idle left", "idle back", "idle right"], -1, 1)
    }

    changeDirectionAttack(vector: Math.Vector2): void {
        super.changeDirectionAttack(vector)
        this.QSound.play();
    }

    WAction(vector:Math.Vector2){
        this.changeDirectionInput(vector);
        //this.speed = 3*this.speed;
        this.WSound.play()
    }

    destroyAbilities(){
        this.abilities!.forEach(a => a.destroy());
        delete this.abilities;
    }
}