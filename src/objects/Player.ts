import {Input, Physics, Scene, Math } from "phaser";
import { PCControls } from "../controls/PCControls";


export class Player extends Physics.Arcade.Sprite{
    speed:number;
    idle: boolean;
    attacking: boolean;
    /*directions = {
        up:  {x:0, y:1},
        right: {x:1, y: 0},
        down: {x:0, y: -1},
        left: {x: -1, y: 0}
    }*/
    direction = Math.Vector2.ZERO;
    pointToMove = Math.Vector2.ZERO;
    PI = Math.PI2/2;
    attackSpeed: number

    constructor(scene:Scene,x:number,y:number){
        super(scene, x, y, "player", 0);
        scene.add.existing(this);
        this.speed = 2300;
        this.idle = true;
        this.attacking = false;
        this.attackSpeed = 8
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

        this.generateAnimations("basic front attack", "player basic attack", 0, 4, this.attackSpeed);
        this.generateAnimations("basic right attack", "player basic attack", 5, 9, this.attackSpeed);
        this.generateAnimations("basic left attack", "player basic attack", 10, 14, this.attackSpeed);
        this.generateAnimations("basic back attack", "player basic attack", 15, 19, this.attackSpeed);

        this.generateAnimations("W", "player w", 0, 4, 12)
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
            this.setVelocityX(this.direction.x * delta/1000 * this.speed);
            this.setVelocityY(this.direction.y * delta/1000 * this.speed);
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
        else if(PCControls.Q.isDown && !this.anims.isPlaying){
            this.updateBasicAnimation([
                "basic front attack",
                "basic left attack",
                "basic back attack",
                "basic right attack"
            ], 0)
        }
        else if(!this.anims.isPlaying)
            this.attacking = false;
    }

    updateBasicAnimation(animations: Array<string>, repeat: number){
        if(this.direction.angle() >= this.PI/4 && this.direction.angle() < 3*this.PI/4){
            // Checks if animation is different of which is being played or the animation of "attack" has finished
            // but the attack button is still being pressed
            if(this.anims.getName() != animations[0] || (this.anims.getName() == animations[0] && !this.anims.isPlaying)){
                this.play({key: animations[0], repeat: repeat, startFrame:1});
                if(this.attacking){
                    this.changeDirectionInput(PCControls.input.mousePointer)
                }
            }
        }
        if(this.direction.angle() >= 3*this.PI/4 && this.direction.angle() < 5*this.PI/4 ){
            if(this.anims.getName() != animations[1] || (this.anims.getName() == animations[1] && !this.anims.isPlaying)){
                this.play({key: animations[1], repeat: repeat, startFrame:1});
                if(this.attacking){
                    this.changeDirectionInput(PCControls.input.mousePointer)
                }
            }
        }

        if(this.direction.angle() >= 5*this.PI/4 && this.direction.angle() < 7*this.PI/4){
            if(this.anims.getName() != animations[2] || (this.anims.getName() == animations[2] && !this.anims.isPlaying)){
                this.play({key: animations[2], repeat: repeat, startFrame:1});
                if(this.attacking){
                    this.changeDirectionInput(PCControls.input.mousePointer)
                }
            }
        }

        if(this.direction.angle() >= 7*this.PI/4 || this.direction.angle() < this.PI/4){
            if(this.anims.getName() != animations[3] || (this.anims.getName() == animations[3] && !this.anims.isPlaying)){
                this.play({key: animations[3], repeat: repeat, startFrame:1});
                if(this.attacking){
                    this.changeDirectionInput(PCControls.input.mousePointer)
                }
            }
        }
    }

    updateMovement(){
        if(!this.idle)
            this.updateBasicAnimation(["walk front", "walk left", "walk back", "walk right"], -1);
        else
            this.updateBasicAnimation(["idle front", "idle left", "idle back", "idle right"], -1)
    }


    changeDirectionInput(p:Input.Pointer){
        if(p.button === 0){
            this.pointToMove.x = p.worldX;
            this.pointToMove.y = p.worldY;
            const direction = new Math.Vector2(p.worldX - this.getCenter().x, p.worldY - this.getCenter().y);
            this.direction = direction.normalize();
        }
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