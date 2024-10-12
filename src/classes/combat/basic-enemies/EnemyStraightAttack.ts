import { GameObjects, Scene } from "phaser";
import { NETManager } from "../../../managers/NETManager";
import { AliveEntity } from "../../../objects/AliveEntity";
import { Game } from "../../../scenes/Game";
import { drawLines } from "../../../utils/Debugger";
import { IAbility, StraighAttackDirections } from "../../../interfaces/Ability";
import { Animator } from "../../../utils/Animator";

export class EnemyStraightAttack extends GameObjects.Sprite{
    static animsCreated = false;
    directions: StraighAttackDirections

    constructor(scene: Scene, ability: IAbility,x:number, y: number, texture: string, directions: StraighAttackDirections){
        super(scene, x, y, texture)
        this.directions = directions
        if(!EnemyStraightAttack.animsCreated){
            Animator.generateAbilityAnimations(scene, this.directions.down, texture, 0, 6, ability.speed)
            Animator.generateAbilityAnimations(scene, this.directions.right, texture, 7, 13, ability.speed)
            Animator.generateAbilityAnimations(scene, this.directions.left, texture, 14, 20, ability.speed)
            Animator.generateAbilityAnimations(scene, this.directions.up, texture, 21, 27, ability.speed)
            EnemyStraightAttack.animsCreated = true;
        }
        this.depth = 4000
        scene.add.existing(this)
    }

    attack(direction:string){
        switch(direction){
            case this.directions.up:
                this.play({key: this.directions.up, repeat: 0, startFrame: 0})
                break;
            
            case this.directions.right:
                this.play({key: this.directions.right, repeat: 0, startFrame: 0})
                break;
            
            case this.directions.down:
                this.play({key: this.directions.down, repeat: 0, startFrame: 0})
                break;
            
            case this.directions.left:
                this.play({key: this.directions.left, repeat: 0, startFrame: 0})
                break;
        }
    }

    updatePosition(x:number, y:number){
        this.x = x;
        this.y = y;
    }
    
    update(entity: AliveEntity){
        this.updatePosition(entity.x, entity.y)
        if(Game.debug){
            this.debug(entity.id)
        }
    }

    debug(id:string){
        if(NETManager.room){
            let enemy = NETManager.room.state.basicMeleeEnemies.get(id)!
            if(enemy){
                drawLines(enemy.ability.up);
                drawLines(enemy.ability.down);
                drawLines(enemy.ability.right);
                drawLines(enemy.ability.left);
            }
        }
    }
}