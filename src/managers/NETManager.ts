import { ICharacter } from "../interfaces/Character";
import { Character } from "../objects/sctythe-girl/Character";
import { Game } from "../scenes/Game";
import { Math, Scenes } from "phaser";
import { CharactersManager } from "./CharactersManager";
import { Vector2 } from "../interfaces/Vector2";
import { IEnemy } from "../interfaces/Enemy";
import { WorldManager } from "./WorldManager";
import { Enemy } from "../objects/Enemy";
import { Client, Room } from "colyseus.js";
import { SAliveEntity } from "../interfaces/SAliveEntity";
import { RoomState } from "../schemas/RoomState";
import { MainCharacter } from "../objects/MainCharacter";

export class NETManager{

    private static client = new Client("ws://localhost:2567");
    static room: Room<RoomState>;
    static numberOfPlayers = 0;
    static scene:Game;
    static blocked = false;
    static ping = 100;
    static action = "";
    static pingStart: number;
    
    static async connect(){
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.getPing,
            callbackScope: this,
            loop: true
        })

        this.room = await this.client.join("my_room");
        
        this.room.state.characters.onAdd((character, sessionID:string)=>{
            WorldManager.aliveEntities.set(character.id, character)
            character.onChange(()=>{
                if(character.id != this.room.sessionId && WorldManager.players.get(character.id)){
                    let interpolationFactor = 0.2
                    let player = WorldManager.players.get(character.id)!;
                    player.x = Math.Linear(player.x, character.x, interpolationFactor)
                    player.y = Math.Linear(player.y, character.y, interpolationFactor)
                    player.health = character.health;
                }
            })
        })

        this.room.state.characters.onRemove((player:SAliveEntity, sessionID: string)=>{
            this.deletePlayer(sessionID)
        })

        this.room.state.enemies.onAdd(e=>{
            e.onChange(()=>{
                if(WorldManager.enemies.get(e.id)){
                    let interpolationFactor = 0.2
                    let enemy = WorldManager.enemies.get(e.id)!
                    enemy.getDamage(e.health)
                    enemy.x = Math.Linear(enemy.x, e.x, interpolationFactor)
                    enemy.y = Math.Linear(enemy.y, e.y, interpolationFactor)
                }
            })
        })

        //this.socket.on("ping", ()=>{this.ping = this.scene.time.now - this.pingStart})
        this.room.onMessage("update", (data: {characters:Array<ICharacter>, enemies: Array<IEnemy>})=>{
            data.characters.forEach(c => {
                this.addPlayer(c)
                if(c.id == this.room.sessionId){
                    this.scene.generateMainPlayer(WorldManager.players.get(c.id)!);
                }
            })
            console.log(data.enemies)
            data.enemies.forEach(e => this.addEnemy(e))
            console.log(WorldManager.enemies)
        })

        this.room.onMessage("pe", (character:ICharacter)=>{
            this.addPlayer(character)
        })

        this.room.onMessage("wk", (data: {id:string, direction: Math.Vector2})=>{
            this.receiveWalk(data.id, data.direction);
        });
        
        this.room.onMessage("em", (data: {id: string, vector: Math.Vector2})=>{
            this.receiveEnemyMovement(data.id, data.vector);
        });
        
        this.room.onMessage("q", (data: {id:string, direction: Math.Vector2, weaponDirection:string})=>{
            this.receiveQ(data.id, data.direction, data.weaponDirection)
        });
        
        this.room.onMessage("w", (data: { id: string, direction: Math.Vector2})=>{
            this.receiveW(data.id, data.direction)
        })

        this.room.onMessage("ping",()=>{
            this.ping = this.scene.time.now-this.pingStart;
        })

        this.numberOfPlayers++;
    }

    static getPing(){
        this.pingStart = this.scene.time.now
        this.room.send("ping")
    }

    static addPlayer(character:ICharacter){
        if(!WorldManager.players.get(character.id) && character.id != this.room.sessionId){
            WorldManager.players.set(character.id, new Character(this.scene, character))
        }
        else if(!WorldManager.players.get(character.id) && character.id == this.room.sessionId){
            WorldManager.players.set(character.id, new MainCharacter(this.scene, character))
        }
    }
    
    static addEnemy(enemy:IEnemy){
        if(!WorldManager.enemies.get(enemy.id)){    
            WorldManager.enemies.set(enemy.id, new Enemy(this.scene, enemy))
        }
    }

    static deletePlayer(id:string){
        //console.log("hello")
        this.scene.events.once(Scenes.Events.POST_UPDATE, ()=>{
            let player = WorldManager.players.get(id)
            WorldManager.players.delete(id);
            WorldManager.aliveEntities.delete(id);
            player!.destroyAbilities();
            player!.destroy();
        })
    }

    private static receiveWalk(id: string, direction: Math.Vector2){
        this.action = "Walk";
        if(id != this.room.sessionId)
            CharactersManager.pointerDownMove(WorldManager.players.get(id)!, direction)
    }

    private static receiveQ(id: string, direction: Math.Vector2, weaponDirection: string){
        console.log(direction)
        this.action = "Q";
        if(id != this.room.sessionId)
            CharactersManager.useQ(WorldManager.players.get(id)!, direction)
    }

    private static receiveW(id: string, direction: Math.Vector2){
        this.action = "W";
        if(id != this.room.sessionId)
            CharactersManager.useW(WorldManager.players.get(id)!, direction)
    }

    private static receiveEnemyMovement(id:string, vector:Math.Vector2){
        if(WorldManager.enemies.get(id) != undefined){
            WorldManager.enemies.get(id)!.idle = false;
            WorldManager.enemies.get(id)!.changeDirectionInput(vector);
            WorldManager.enemies.get(id)!.update(this.scene.delta)
        }
    }

    static sendWalk(direction: Vector2){
        if(!this.blocked){
            this.room.send("wk", direction);
            this.blocked = true;
            this.scene.time.delayedCall(100, ()=>this.blocked=false)
        }
    }

    static sendQ(direction: Vector2, weaponDirection: string){
        this.room.send("q", {direction: direction, weaponDirection: weaponDirection})
    }

    static sendW(direction:Vector2){
        this.room.send("w", direction)
    }
    
}