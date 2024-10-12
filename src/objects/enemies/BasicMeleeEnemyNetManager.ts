import { Room } from "colyseus.js";
import { RoomState } from "../../schemas/RoomState";
import { BasicMeleeEnemyManager } from "./BasicMeleeEnemyManager";

export class BasicMeleeEnemyNetManager{
    private static commands = {
        basicMeleeAttack: "basicMeleeAttack",
    }

    static set(room:Room<RoomState>){
        room.onMessage(this.commands.basicMeleeAttack, (data: {id: string, direction: string})=>{
            BasicMeleeEnemyManager.attack(data.id, data.direction)
        })
    }
}