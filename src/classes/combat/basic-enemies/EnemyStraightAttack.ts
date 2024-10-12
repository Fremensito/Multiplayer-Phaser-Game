import { GameObjects, Scene } from "phaser";
import { NETManager } from "../../../managers/NETManager";
import { AliveEntity } from "../../../objects/AliveEntity";
import { Game } from "../../../scenes/Game";
import { drawLines } from "../../../utils/Debugger";
import { IAbility, StraightAttackDirections } from "../../../interfaces/Ability";
import { StraightDirectionAttacks } from "../utils/StraightDirectionAttacks";

export class EnemyStraightAttack extends GameObjects.Sprite{
    static animsCreated = false;
    directions: StraightAttackDirections

    constructor(scene: Scene, ability: IAbility,x:number, y: number, texture: string, frames:number, directions: StraightAttackDirections){
        super(scene, x, y, texture)
        this.directions = directions
        if(!EnemyStraightAttack.animsCreated){
            StraightDirectionAttacks.generateAnimations(scene, directions, texture, frames, ability)
            EnemyStraightAttack.animsCreated = true;
        }
        this.depth = 4000
        scene.add.existing(this)
    }

    attack(direction:string){
        StraightDirectionAttacks.attack(direction, this.directions, this)
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