import { AliveEntity } from "../AliveEntity";
import {Scene, Math} from "phaser";
import { ICharacter } from "../../interfaces/Character";
import { WAbility } from "../../classes/combat/scythe-girl/WAbility";
import { CombatAbility } from "../../classes/combat/CombatAbility";
import { SCYTHE_GIRL } from "../../utils/AssetsGlobals";
import { QSAbility } from "../../classes/combat/skeleton/QSAbility";
import { PCControlsScytheGirl } from "./PCControlsScytheGirl";
import { ScytheGirlManager } from "./ScytheGirlManager";
import { CharacterManagersProvider } from "../../providers/CharacterManagersProvider";
import { CharacterAnimator } from "../../utils/CharacterAnimator";
import { Game } from "../../scenes/Game";
import { NETManager } from "../../managers/NETManager";
import { drawLines } from "../../utils/Debugger";
import { QAbility } from "../../classes/combat/scythe-girl/QAbility";

export class ScytheGirl extends AliveEntity{
    created = false

    QAbility: QAbility;
    WAbility: WAbility;
    QSAbility: QSAbility;
    attackAnimations = {
        front: "sctyhe girl basic front attack", 
        right: "scythe girl basic right attack", 
        left: "scythe girl basic left attack", 
        back: "scythe girl basic back attack"
    }
    walkingAnimations = {
        front: "scythe girl walking front",
        right: "scythe girl walking right",
        left: "scythe girl walking left",
        back: "scythe girl walking back"
    }
    idleAnimations = {
        front: "scythe girl idle front",
        right: "scythe girl idle right",
        left: "scythe girl idle left",
        back: "scythe girl idle back"
    }
    char_class: string;
    character:ICharacter
    delta:number
    name = "character"
    static animationsGenerated = false;
    //rectangle: GameObjects.Rectangle

    WSound;
    QSound;

    //debugMode = false;

    controls:PCControlsScytheGirl|undefined;
    manager:ScytheGirlManager;

    constructor(scene: Scene, data:ICharacter){
        super(scene, data.x, data.y, "player", 0);
        //this.controls = PCControlsProvider.getScytheGirlPcControls(scene.input);
        this.manager = CharacterManagersProvider.getScytheGirlManager();
        this.setPartition()
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
        this.speed =  data.speed
        this.idle = true;
        this.attacking = false;
        scene.add.existing(this)
        this.id = data.id;

        this.pointToMove = new Math.Vector2(0,0)
        this.direction = new Math.Vector2(0,0)

        this.character = data;
        this.generateBasicAnimations(scene, data);
        
        //QAbility.createRight(this);
        this.abilities = new Map<string, CombatAbility>();
        this.abilities.set("Q", new QAbility(scene, data.abilities[0], data.x, data.y, SCYTHE_GIRL.QVFX));
        this.QAbility = this.abilities.get("Q") as QAbility;
        this.abilities.set("W", new WAbility(scene, data.abilities[1], data.x, data.y, SCYTHE_GIRL.WVFX));
        this.WAbility = this.abilities.get("W") as WAbility;

        this.QSAbility = new QSAbility(scene, this.x, this.y)
        
        this.WSound = scene.sound.add(SCYTHE_GIRL.WSound);
        this.WSound.volume = 0.5
        this.QSound = scene.sound.add(SCYTHE_GIRL.QSound)
        this.QSound.volume = 0.5

        //TO DO: quit magic numbers 10, 10 (server side)
        this.generateCollider(data.x - this.boxWidth/2, data.y - this.boxHeight/2, 10, 10)
        //this.generateDebugRect(scene);
    }

    generateBasicAnimations(scene: Scene, data:ICharacter){

        if(!ScytheGirl.animationsGenerated){
            CharacterAnimator.generateAnimations(scene,this.walkingAnimations.front, SCYTHE_GIRL.walking, 0, 5, 8);
            CharacterAnimator.generateAnimations(scene,this.walkingAnimations.right, SCYTHE_GIRL.walking, 6, 11, 8);
            CharacterAnimator.generateAnimations(scene,this.walkingAnimations.left, SCYTHE_GIRL.walking, 12, 17, 8);
            CharacterAnimator.generateAnimations(scene,this.walkingAnimations.back, SCYTHE_GIRL.walking, 18, 23, 8);

            CharacterAnimator.generateAnimations(scene,this.idleAnimations.front, SCYTHE_GIRL.idle, 0, 1, 2);
            CharacterAnimator.generateAnimations(scene,this.idleAnimations.right, SCYTHE_GIRL.idle, 2, 3, 2);
            CharacterAnimator.generateAnimations(scene,this.idleAnimations.left, SCYTHE_GIRL.idle, 4 ,5 ,2);
            CharacterAnimator.generateAnimations(scene,this.idleAnimations.back, SCYTHE_GIRL.idle, 6, 7, 2);

            CharacterAnimator.generateAnimations(scene, this.attackAnimations.front, SCYTHE_GIRL.Q, 0, 6, data.abilities[0].speed);
            CharacterAnimator.generateAnimations(scene, this.attackAnimations.right, SCYTHE_GIRL.Q, 7, 13, data.abilities[0].speed);
            CharacterAnimator.generateAnimations(scene, this.attackAnimations.left, SCYTHE_GIRL.Q, 14, 20, data.abilities[0].speed);
            CharacterAnimator.generateAnimations(scene, this.attackAnimations.back, SCYTHE_GIRL.Q, 21, 27, data.abilities[0].speed);

            CharacterAnimator.generateAnimations(scene, "W", SCYTHE_GIRL.W, 0, 4, data.abilities[1].speed)
            ScytheGirl.animationsGenerated = true
        }
    }


    update(delta:number){
        super.update(delta);
        this.saveLastPosition()
        if(this.controls)
            this.controls.updateScytheGirl(this, this.manager)
        this.updateDirection();
        if(!this.idle && !this.attacking){
            if(this.mainPlayer){
                this.x += this.speed*this.direction.x*delta
                this.y += this.speed*this.direction.y*delta
            }
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
                        if(this.mainPlayer){
                            this.x += this.speed*this.direction.x*delta*3
                            this.y += this.speed*this.direction.y*delta*3
                        }
                    }

                    // if(this.anims.isPlaying){
                    //     this.WAbility.doDamage(this)
                    // }
                    
                    break;
                // case this.attackAnimations[0]:
                // case this.attackAnimations[1]:
                // case this.attackAnimations[2]:
                // case this.attackAnimations[3]: //this.setVelocity(0,0); break;
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
        
        this.depth = this.y
        this.QAbility.updatePosition(this.x, this.y);
        if(Game.debug){
            this.QAbility.debug();
            if(NETManager.room && NETManager.room.state.scytheGirls.get(this.id)){
                Game.graphics.lineStyle(1, 0xff0909);
                drawLines(NETManager.room.state.scytheGirls.get(this.id)!.box)
                Game.graphics.lineStyle(1, 0x13e8e8);
            }
        }
        this.WAbility.updatePosition(this.x, this.y);
        this.QAbility.update(delta)
        this.WAbility.update(delta)
        //¡this.QSAbility.debug(this.x, this.y);
        //this.WAbility.updateW(delta);
        // console.log("speed: " + this.speed)
        //console.log(this.x, this.y)
        //console.log(this.scene.anims.get("W").duration, 1/12*5*1000)
        // console.log(this.direction)
        //NETManager.sendState(this.idle, this.direction)
        //this.debug();
        this.updatePartition()
        this.box.pos.x = (this.x - this.boxWidth/2)
        this.box.pos.y = (this.y - this.boxHeight/2)
    }

    updateMovement(){
        if(!this.idle){
            this.updateBasicAnimation([this.walkingAnimations.front, this.walkingAnimations.left, 
                this.walkingAnimations.back, this.walkingAnimations.right], -1, 1);
        }
        else {
            this.updateBasicAnimation([this.idleAnimations.front, this.idleAnimations.left, 
                this.idleAnimations.back, this.idleAnimations.right], -1, 1)
        }
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