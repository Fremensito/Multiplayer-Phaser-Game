import { GameObjects, Math as PMath} from "phaser";
import { WorldManager } from "../managers/WorldManager";
import { CombatAbility } from "../classes/combat/CombatAbility";
import SAT from "sat";

export class AliveEntity extends GameObjects.Sprite{
    speed:number;
    idle: boolean;
    attacking: boolean;
    direction:PMath.Vector2;
    pointToMove: PMath.Vector2
    PI = PMath.PI2/2;
    health: number;
    id:string;

    //For client collision prediction
    boxHeight: number;
    boxWidth: number;
    boxRect: GameObjects.Rectangle;

    debugMode = false;
    box: SAT.Box;
    partition: string;
    lastPosition =  {x: 0, y:0}
    abilities?: Map<string, CombatAbility>;
    mainPlayer = false;

    generateCollider(x:number, y:number, width: number, height: number){
        this.boxHeight = width;
        this.boxWidth = height;
        this.box = new SAT.Box(new SAT.Vector(x, y), this.boxWidth, this.boxHeight)
    }

    setPartition(){
        WorldManager.mapPartitions.get(Math.floor(this.x/WorldManager.width).toString() + "-" +  
            Math.floor(this.y/WorldManager.width).toString())?.push(this)

        this.partition = Math.floor(this.x/WorldManager.width).toString() + "-" +  
            Math.floor(this.y/WorldManager.width).toString();
    }

    saveLastPosition(){
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
    }

    updatePartition(){
        let entities = WorldManager.mapPartitions.get(
            Math.floor(this.lastPosition.x/WorldManager.width).toString() + "-" +
            Math.floor(this.lastPosition.y/WorldManager.width).toString()
        );
        entities?.splice(entities.indexOf(this), 1)
        this.setPartition();
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

    changeDirectionInput(vector:PMath.Vector2){
        this.pointToMove.x = vector.x;
        this.pointToMove.y = vector.y;
        const direction = new PMath.Vector2(vector.x - this.getCenter().x, vector.y - this.getCenter().y);
        this.direction = direction.normalize();
    }

    changeDirectionAttack(vector:PMath.Vector2){
        const direction = new PMath.Vector2(vector.x - this.getCenter().x, vector.y - this.getCenter().y);
        this.direction = direction.normalize();
    }

     //Updates the direction to the last point indicated by cursor
    updateDirection(){
        const direction = new PMath.Vector2(this.pointToMove.x - this.getCenter().x, this.pointToMove.y - this.getCenter().y);
        this.direction = direction.normalize();
    }

    //Checks if the player arrived to the position of the cursor
    checkPositionGoal(){
        return(
            (this.x >=this.pointToMove.x -2 && this.x <= this.pointToMove.x +2) &&
            (this.y >=this.pointToMove.y -2 && this.y <= this.pointToMove.y +2)
        );
    }

    update(delta:number){
    }

    getDamageClient(damage:number){}

    getDamage(health:number){}
}