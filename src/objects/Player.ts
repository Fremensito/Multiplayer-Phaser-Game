import {Input, Physics, Scene, Math } from "phaser";


export class Player extends Physics.Arcade.Sprite{
    speed:number;
    idle: boolean;
    directions = {
        up:  {x:0, y:1},
        right: {x:1, y: 0},
        down: {x:0, y: -1},
        left: {x: -1, y: 0}
    }
    direction = Math.Vector2.ZERO;
    pointToMove = Math.Vector2.ZERO;
    PI = Math.PI2/2;

    constructor(scene:Scene,x:number,y:number){
        super(scene, x, y, "player", 0);
        scene.add.existing(this);
        this.speed = 2300;
        this.idle = true;
        scene.physics.add.existing(this)
        this.body?.setSize(20, 20)

        this.generateAnimations("walk front", 0, 5);
        this.generateAnimations("walk right", 6, 11);
        this.generateAnimations("walk left", 12, 17);
        this.generateAnimations("walk back", 18, 23);
    }

    generateAnimations(name: string, start:number, end: number){
        this.scene.anims.create({
            key: name,
            frames: this.scene.anims.generateFrameNumbers("player", {
                start: start,
                end: end
            }),
            frameRate: 8,
        })
    }

    update(delta: number){
        this.updateDirection();
        if(!this.idle){
            this.setVelocityX(this.direction.x * delta/1000 * this.speed);
            this.setVelocityY(this.direction.y * delta/1000 * this.speed);
            this.updateWalkingAnimation();
        }
        if(this.checkPositionGoal()){
            this.idle = true;
            this.setVelocity(0,0);
        }

    }

    updateWalkingAnimation(){
        if(this.direction.angle() >= this.PI/4 && this.direction.angle() < 3*this.PI/4){
            if(this.anims.getName() != "walk front"){
                this.play({key: "walk front", repeat: -1});
            }
        }
        if(this.direction.angle() >= 3*this.PI/4 && this.direction.angle() < 5*this.PI/4){
            if(this.anims.getName() != "walk left"){
                this.play({key: "walk left", repeat: -1});
            }
        }

        if(this.direction.angle() >= 5*this.PI/4 && this.direction.angle() < 7*this.PI/4){
            if(this.anims.getName() != "walk back"){
                this.play({key: "walk back", repeat: -1});
            }
        }

        if(this.direction.angle() >= 7*this.PI/4 || this.direction.angle() < this.PI/4){
            if(this.anims.getName() != "walk right"){
                this.play({key: "walk right", repeat: -1});
            }
        }
    }

    changeDirectionInput(p:Input.Pointer){
        if(!this.idle && p.button === 0){
            this.pointToMove.x = p.worldX;
            this.pointToMove.y = p.worldY;
            const direction = new Math.Vector2(p.worldX - this.getCenter().x, p.worldY - this.getCenter().y);
            this.direction = direction.normalize();
        }
    }

    updateDirection(){
        const direction = new Math.Vector2(this.pointToMove.x - this.getCenter().x, this.pointToMove.y - this.getCenter().y);
        this.direction = direction.normalize();
    }

    checkPositionGoal(){
        return(
            (this.x >=this.pointToMove.x -2 && this.x <= this.pointToMove.x +2) &&
            (this.y >=this.pointToMove.y -2 && this.y <= this.pointToMove.y +2)
        );
    }
}