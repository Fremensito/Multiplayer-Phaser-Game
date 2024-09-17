import { Room } from "colyseus.js";
import { RoomState } from "../../schemas/RoomState";
import {Math as PMath} from "phaser"
import { NETManager } from "../../managers/NETManager";
import { CharacterManagersProvider } from "../../providers/CharacterManagersProvider";
import { WorldManager } from "../../managers/WorldManager";
import { Vector2 } from "../../interfaces/Vector2";
import { Commands } from "../../interfaces/Commands";

export class ScytheGirlNetManager{
    static commands:Commands = {
        generate: "gsg",
        q: "sgq",
        w: "sgw",
    }

    static set(room:Room<RoomState>){
        room.onMessage(this.commands.q, (data: {id:string, direction: PMath.Vector2, weaponDirection:string})=>{
            this.receiveQ(data.id, data.direction, data.weaponDirection)
        });
        
        room.onMessage(this.commands.w, (data: { id: string, direction: PMath.Vector2})=>{
            this.receiveW(data.id, data.direction)
        })
    }

    private static receiveQ(id: string, direction: PMath.Vector2, weaponDirection: string){
        NETManager.action= "Q";
        if(id != NETManager.room.sessionId)
            CharacterManagersProvider.getScytheGirlManager().useQ(WorldManager.scytheGirls.get(id)!, direction)
    }

    private static receiveW(id: string, direction: PMath.Vector2){
        NETManager.action = "W";
        if(id != NETManager.room.sessionId)
            CharacterManagersProvider.getScytheGirlManager().useW(WorldManager.scytheGirls.get(id)!, direction)
    }

    static sendQ(direction: Vector2, weaponDirection: string){
        NETManager.room.send(this.commands.q, {direction: direction, weaponDirection: weaponDirection})
    }

    static sendW(direction:Vector2){
        NETManager.room.send(this.commands.w, direction)
    } 
}