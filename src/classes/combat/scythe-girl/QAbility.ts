import { GameObjects, Scene } from "phaser";
import { CharacterAbility } from "../CharacterAbility";
import { IAbility } from "../../../interfaces/Ability";
import { SCYTHE_GIRL } from "../../../utils/AssetsGlobals";
import { NETManager } from "../../../managers/NETManager";
import { drawLines } from "../../../utils/Debugger";
import { Game } from "../../../scenes/Game";
import { AliveEntity } from "../../../objects/AliveEntity";
import { Animator } from "../../../utils/Animator";

export class QAbility extends CharacterAbility{

    static animsCreated = false;
    directions = {
        up: "QUp",
        right: "QRight",
        down: "QDown",
        left: "QLeft"
    }

    attackWidth = 32

    graphics: GameObjects.Graphics;

    constructor(scene:Scene, ability: IAbility, x:number, y: number, texture: string){
        super(scene, ability, x, y, texture)
        if(!QAbility.animsCreated){
            Animator.generateAbilityAnimations(this.scene, this.directions.down, SCYTHE_GIRL.QVFX, 0, 6, ability.speed)
            Animator.generateAbilityAnimations(this.scene, this.directions.right, SCYTHE_GIRL.QVFX, 7, 13, ability.speed)
            Animator.generateAbilityAnimations(this.scene, this.directions.left, SCYTHE_GIRL.QVFX, 14, 20, ability.speed)
            Animator.generateAbilityAnimations(this.scene, this.directions.up, SCYTHE_GIRL.QVFX, 21, 27, ability.speed)
            QAbility.animsCreated = true;
        }
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
        super.updatePosition(x, y)
    }

    update(delta:number, entity: AliveEntity){
        super.update(delta, entity)
        if(Game.debug)
            this.debug(entity.id)
    }

    debug(id:string){
        if(NETManager.room){
            let character = NETManager.room.state.scytheGirls.get(id)!
            if(character){
                drawLines(character.q.up);
                drawLines(character.q.down);
                drawLines(character.q.right);
                drawLines(character.q.left);
            }
        }
    }
}