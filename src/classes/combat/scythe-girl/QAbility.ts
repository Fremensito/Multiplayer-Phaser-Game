import { Scene } from "phaser";
import { CharacterAbility } from "../CharacterAbility";
import { IAbility } from "../../../interfaces/Ability";
import { SCYTHE_GIRL } from "../../../utils/AssetsGlobals";
import { NETManager } from "../../../managers/NETManager";
import { drawLines } from "../../../utils/Debugger";
import { Game } from "../../../scenes/Game";
import { AliveEntity } from "../../../objects/AliveEntity";
import { StraightDirectionAttacks } from "../utils/StraightDirectionAttacks";

export class QAbility extends CharacterAbility{

    static animsCreated = false;
    directions = {
        up: "QUp",
        right: "QRight",
        down: "QDown",
        left: "QLeft"
    }

    attackWidth = 32
    frames = 7

    constructor(scene:Scene, ability: IAbility, x:number, y: number, texture: string){
        super(scene, ability, x, y, texture)
        if(!QAbility.animsCreated){
            StraightDirectionAttacks.generateAnimations(this.scene, this.directions, SCYTHE_GIRL.QVFX, this.frames, ability)
            QAbility.animsCreated = true;
        }
    }

    attack(direction:string){
        StraightDirectionAttacks.attack(direction, this.directions, this)
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