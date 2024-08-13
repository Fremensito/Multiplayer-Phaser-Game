import {Input, Physics, Scene, Math, Animations, GameObjects } from "phaser";
import { Ability } from "../classes/Ability";
import { ICharacter } from "../interfaces/Character";
import { SpriteParticle } from "../classes/SpriteParticle";
import { NETManager } from "../managers/NETManager";

export class Character extends Physics.Matter.Sprite{
    speed:number;
    idle: boolean;
    attacking: boolean;
    direction:Math.Vector2;
    pointToMove: Math.Vector2;
    PI = Math.PI2/2;
    attackSpeed: number;
    abilities: Map<string, Ability>;
    attack_animations = ["basic front attack", "basic right attack", "basic left attack", "basic back attack"]
    //TO DO: ADD TEXTURES ANIMATIONS DEPENDING OF THE CHARACTAR CLASS NAME
    char_class: string;
    character:ICharacter
    delta:number
    //rectangle: GameObjects.Rectangle

    constructor(scene: Scene, data:ICharacter){
        super(scene.matter.world, data.x, data.y, "player", 0);
        scene.add.existing(this);
        this.speed = data.speed;
        this.idle = true;
        this.attacking = false;
        scene.add.existing(this)

        this.pointToMove = new Math.Vector2(0,0)
        this.direction = new Math.Vector2(0,0)

        this.character = data;
        
        if(NETManager.numberOfPlayers == 0){
            this.generateAnimations("walk front", "player", 0, 5, 8);
            this.generateAnimations("walk right",  "player", 6, 11, 8);
            this.generateAnimations("walk left",  "player", 12, 17, 8);
            this.generateAnimations("walk back",  "player", 18, 23, 8);

            this.generateAnimations("idle front", "player idle", 0, 1, 2);
            this.generateAnimations("idle right", "player idle", 2, 3, 2);
            this.generateAnimations("idle left", "player idle", 4 ,5 ,2);
            this.generateAnimations("idle back", "player idle", 6, 7, 2);

            this.generateAnimations(this.attack_animations[0], "player basic attack", 0, 4, data.abilities[0].speed);
            this.generateAnimations(this.attack_animations[1], "player basic attack", 5, 9, data.abilities[0].speed);
            this.generateAnimations(this.attack_animations[2], "player basic attack", 10, 14, data.abilities[0].speed);
            this.generateAnimations(this.attack_animations[3], "player basic attack", 15, 19, data.abilities[0].speed);

            this.generateAnimations("W", "player w", 0, 4, data.abilities[1].speed)
        }

        this.abilities = new Map<string, Ability>;
        this.abilities.set("Q", new Ability(data.abilities[0], scene))
        this.abilities.set("W", new Ability(data.abilities[1], scene))

        this.on(Animations.Events.ANIMATION_UPDATE, (a:Animations.Animation, f:Animations.AnimationFrame)=>{
            if(this.anims.getName() == "W"){
                switch(f.index){
                    case 2: new SpriteParticle(scene, this.x, this.y, "particle" + f.index, "W-particles", 0, 1, 
                        8
                    ); break;

                    case 3: new SpriteParticle(scene, this.x, this.y, "particle" + f.index, "W-particles", 2, 3, 
                        8
                    ); break;

                    case 4: new SpriteParticle(scene, this.x, this.y, "particle" + f.index, "W-particles", 4, 5, 
                        8
                    ); break;

                    case 5: new SpriteParticle(scene, this.x, this.y, "particle" + f.index, "W-particles", 6, 7, 
                        8
                    ); break;
                }
            }
        })

        // this.rectangle = scene.add.rectangle(data.x, data.y, 5, 15, 0xff0000, 0xffffff)
        // this.rectangle.setStrokeStyle(1, 0xffffff)
    }

    generateAnimations(name: string, texture: string, start:number, end: number, frameRate: number){
        this.scene.anims.create({
            key: name,
            frames: this.scene.anims.generateFrameNumbers(texture, {
                start: start,
                end: end
            }),
            frameRate: frameRate,
        })
    }

    update(delta:number){
        this.updateDirection();
        if(!this.idle && !this.attacking){
            this.setVelocityX(this.direction.x * this.speed);
            this.setVelocityY(this.direction.y * this.speed);
            // this.speed = 40;
            // this.x += this.speed*this.direction.x*delta/1000
            // this.y += this.speed*this.direction.y*delta/1000
        }
        else if(this.attacking){
            switch(this.anims.getName()){
                case "W": 
                    if(!this.anims.isPlaying){
                        this.idle = true;
                        this.attacking = false;
                    }
                    break;
                case this.attack_animations[0]:
                case this.attack_animations[1]:
                case this.attack_animations[2]:
                case this.attack_animations[3]: this.setVelocity(0,0); break;
            }
        }
        else{
            this.setVelocity(0,0)
        }
        if(this.checkPositionGoal()){
            this.idle = true;
            this.setVelocity(0,0);
        }
        if(!this.attacking)
            this.updateMovement()
        else if(!this.anims.isPlaying)
            this.attacking = false;

        // console.log("speed: " + this.speed)
        console.log(this.x, this.y)
        //console.log(this.scene.anims.get("W").duration, 1/12*5*1000)
        // console.log(this.direction)
        //NETManager.sendState(this.idle, this.direction)
    }

    updateBasicAnimation(animations: Array<string>, repeat: number, startFrame: number){
        if(this.direction.angle() >= this.PI/4 && this.direction.angle() < 3*this.PI/4){
            // Checks if animation is different of which is being played or the animation of "attack" has finished
            // but the attack button is still being pressed
            if(this.anims.getName() != animations[0]){
                this.play({key: animations[0], repeat: repeat, startFrame: startFrame});
            }
        }
        if(this.direction.angle() >= 3*this.PI/4 && this.direction.angle() < 5*this.PI/4 ){
            if(this.anims.getName() != animations[1]){
                this.play({key: animations[1], repeat: repeat, startFrame: startFrame});
            }
        }

        if(this.direction.angle() >= 5*this.PI/4 && this.direction.angle() < 7*this.PI/4){
            if(this.anims.getName() != animations[2]){
                this.play({key: animations[2], repeat: repeat, startFrame: startFrame});
            }
        }

        if(this.direction.angle() >= 7*this.PI/4 || this.direction.angle() < this.PI/4){
            if(this.anims.getName() != animations[3]){
                this.play({key: animations[3], repeat: repeat, startFrame: startFrame});
            }
        }
    }

    updateMovement(){
        if(!this.idle)
            this.updateBasicAnimation(["walk front", "walk left", "walk back", "walk right"], -1, 1);
        else
            this.updateBasicAnimation(["idle front", "idle left", "idle back", "idle right"], -1, 1)
    }


    changeDirectionInput(vector:Math.Vector2){
        this.pointToMove.x = vector.x;
        this.pointToMove.y = vector.y;
        const direction = new Math.Vector2(vector.x - this.getCenter().x, vector.y - this.getCenter().y);
        this.direction = direction.normalize();
    }

    changeDirectionAttack(vector:Math.Vector2){
        const direction = new Math.Vector2(vector.x - this.getCenter().x, vector.y - this.getCenter().y);
        this.direction = direction.normalize();
    }

    WAction(vector:Math.Vector2){
        this.changeDirectionInput(vector);
        // this.speed = 3*this.speed;
        const velocity = this.direction.multiply(new Math.Vector2(3*this.speed, 3*this.speed));
        this.setVelocity(velocity.x, velocity.y)
    }

    //Updates the direction to the last point indicated by cursor
    updateDirection(){
        const direction = new Math.Vector2(this.pointToMove.x - this.getCenter().x, this.pointToMove.y - this.getCenter().y);
        this.direction = direction.normalize();
    }

    //Checks if the player arrived to the position of the cursor
    checkPositionGoal(){
        return(
            (this.x >=this.pointToMove.x -2 && this.x <= this.pointToMove.x +2) &&
            (this.y >=this.pointToMove.y -2 && this.y <= this.pointToMove.y +2)
        );
    }
}