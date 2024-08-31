import { GameObjects, Math } from "phaser";

const PI = Math.PI2/2;

export class DirectionAnimator{
    updateBasicAnimation(direction: Math.Vector2, entity: GameObjects.Sprite,
         animations: Array<string>, repeat: number, startFrame: number){
        if(direction.angle() >= PI/4 && direction.angle() < 3*PI/4){
            // Checks if animation is different of which is being played or the animation of "attack" has finished
            // but the attack button is still being pressed
            if(entity.anims.getName() != animations[0]){
                entity.play({key: animations[0], repeat: repeat, startFrame: startFrame});
            }
        }
        if(direction.angle() >= 3*PI/4 && direction.angle() < 5*PI/4 ){
            if(entity.anims.getName() != animations[1]){
                entity.play({key: animations[1], repeat: repeat, startFrame: startFrame});
            }
        }

        if(direction.angle() >= 5*PI/4 && direction.angle() < 7*PI/4){
            if(entity.anims.getName() != animations[2]){
                entity.play({key: animations[2], repeat: repeat, startFrame: startFrame});
            }
        }

        if(direction.angle() >= 7*PI/4 || direction.angle() < PI/4){
            if(entity.anims.getName() != animations[3]){
                entity.play({key: animations[3], repeat: repeat, startFrame: startFrame});
            }
        }
    }
}