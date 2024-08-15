import { Math, Physics } from "phaser";

export class AliveEntity extends Physics.Matter.Sprite{
    speed:number;
    idle: boolean;
    attacking: boolean;
    direction:Math.Vector2;
    pointToMove: Math.Vector2
    PI = Math.PI2/2;
    health: number;

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