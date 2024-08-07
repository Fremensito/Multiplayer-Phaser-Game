import {Input, Physics, Scene, Math } from "phaser";
import { PCControls } from "../controls/PCControls";
import { Ability } from "../classes/Ability";
import { ICharacter } from "../interfaces/Character";

export class Character extends Physics.Arcade.Sprite{
    speed:number;
    idle: boolean;
    attacking: boolean;
    direction = Math.Vector2.ZERO;
    pointToMove = Math.Vector2.ZERO;
    PI = Math.PI2/2;
    attackSpeed: number;
    abilities: Map<string, Ability>;
    attack_animations = ["basic front attack", "basic right attack", "basic left attack", "basic back attack"]
    //TO DO: ADD TEXTURES ANIMATIONS DEPENDING OF THE CHARACTAR CLASS NAME
    char_class: string;

    constructor(scene: Scene, data:ICharacter){
        super(scene, data.x, data.y, "player", 0);
        scene.add.existing(this);
        this.speed = data.speed;
        this.idle = true;
        this.attacking = false;
        scene.physics.add.existing(this)
        this.body?.setSize(20, 20)

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

        this.abilities = new Map<string, Ability>;
        this.abilities.set("Q", new Ability(data.abilities[0]))
        this.abilities.set("W", new Ability(data.abilities[1]))
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

    update(delta: number){
        this.updateDirection();
        if(!this.idle && !this.attacking){
            this.setVelocityX(this.direction.x * this.speed);
            this.setVelocityY(this.direction.y * this.speed);
        }
        else if(this.attacking){
            switch(this.anims.getName()){
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


    changeDirectionInput(p:Input.Pointer){
        if(p.button === 0){
            this.pointToMove.x = p.worldX;
            this.pointToMove.y = p.worldY;
            const direction = new Math.Vector2(p.worldX - this.getCenter().x, p.worldY - this.getCenter().y);
            this.direction = direction.normalize();
        }
    }

    changeDirectionAttack(p:Input.Pointer){
        if(p.button === 0){
            const direction = new Math.Vector2(p.worldX - this.getCenter().x, p.worldY - this.getCenter().y);
            this.direction = direction.normalize();
        }
    }

    WAction(p:Input.Pointer){
        this.changeDirectionInput(p);
        const velocity = this.direction.multiply(new Math.Vector2(5*this.speed, 5 * this.speed));
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