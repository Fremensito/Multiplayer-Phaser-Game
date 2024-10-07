import { NETManager } from "../../../managers/NETManager";
import { AliveEntity } from "../../../objects/AliveEntity";
import { Game } from "../../../scenes/Game";
import { drawLines } from "../../../utils/Debugger";

export class EnemyStraightAttack{
    update(entity: AliveEntity){
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