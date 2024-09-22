import { GameObjects, Scene } from "phaser";
import { CombatAbility } from "../CombatAbility";
import { IAbility } from "../../../interfaces/Ability";
import { SCYTHE_GIRL } from "../../../utils/AssetsGlobals";
import { NETManager } from "../../../managers/NETManager";
import { drawLines } from "../../../utils/Debugger";

export class QAbility extends CombatAbility{

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
            this.generateAnimations(this.directions.down, SCYTHE_GIRL.QVFX, 0, 6, ability.speed)
            this.generateAnimations(this.directions.right, SCYTHE_GIRL.QVFX, 7, 13, ability.speed)
            this.generateAnimations(this.directions.left, SCYTHE_GIRL.QVFX, 14, 20, ability.speed)
            this.generateAnimations(this.directions.up, SCYTHE_GIRL.QVFX, 21, 27, ability.speed)
            QAbility.animsCreated = true;
        }
    }

    doDamage(direction:string){
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

    debug(){
        if(NETManager.room){
            NETManager.room.state.scytheGirls.forEach(v=>{
                drawLines(v.q.up);
                drawLines(v.q.down);
                drawLines(v.q.right);
                drawLines(v.q.left);
            })
        }
    }
}