import { GameObjects, Math as PMath, Scene } from "phaser";
import { WorldManager } from "../managers/WorldManager";
import { ScytheGirl } from "./sctythe-girl/ScytheGirl";
import { CombatAbility } from "../classes/combat/CombatAbility";
import { drawLines } from "../utils/Debugger";
import { NETManager } from "../managers/NETManager";
import { Enemy } from "./Enemy";
import { Game } from "../scenes/Game";

export class AliveEntity extends GameObjects.Sprite{
    speed:number;
    idle: boolean;
    attacking: boolean;
    direction:PMath.Vector2;
    pointToMove: PMath.Vector2
    PI = PMath.PI2/2;
    health: number;
    id:string;
    boxHeight: number;
    boxWidth: number;
    boxRect: GameObjects.Rectangle;
    debugMode = false;
    box: SAT.Box;
    partition: string;
    lastPosition =  {x: 0, y:0}
    abilities?: Map<string, CombatAbility>;
    mainPlayer = false;

    // generateDebugRect(scene: Scene){
    //     this.boxRect = new GameObjects.Rectangle(scene, this.x, this.y, this.boxWidth, this.boxHeight)
    //     this.boxRect.setStrokeStyle(1, 0xee0000);
    // }

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

    // debug(){
    //     // if(!this.debugMode){
    //     //     this.scene.add.existing(this.boxRect)
    //     //     this.debugMode = true;
    //     // }
    //     // this.boxRect.x = this.x;
    //     // this.boxRect.y = this.y;
    //     // this.boxRect.depth = 3000;
    //     if(NETManager.room){
    //         Game.graphics.lineStyle(1, 0xff0909);
    //         if(this instanceof Enemy)
    //             drawLines(NETManager.room.state.enemies.get(this.id)!.box)
    //         else if(this instanceof ScytheGirl){
    //             drawLines(NETManager.room.state.scytheGirls.get(this.id)!.box)
    //         }
    //         Game.graphics.lineStyle(1, 0xff4c4a);
    //     }
    // }
}