import { WorldManager } from "../../managers/WorldManager";
import { Ghost } from "./Ghost";

export class BasicMeleeEnemyManager{
    static attack(id:string, direction:string){
        //console.log(direction)
        const enemy = WorldManager.enemies.get(id)! as Ghost
        enemy.attacking = true;
        switch(direction){
            case enemy.bassicAttack.directions.up:
                enemy.play(enemy.attackAnims.back);break;
            case enemy.bassicAttack.directions.right:
                enemy.play(enemy.attackAnims.right);break;
            case enemy.bassicAttack.directions.down:
                enemy.play(enemy.attackAnims.front);break;
            case enemy.bassicAttack.directions.left:
                enemy.play(enemy.attackAnims.left);break;
        }
        enemy.bassicAttack.attack(direction)
    }
}