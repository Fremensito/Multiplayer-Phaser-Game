import { ICharacter } from "../interfaces/Character";
import { Game } from "../scenes/Game";
import { Math as PMath, Scenes } from "phaser";
import { Vector2 } from "../interfaces/Vector2";
import { IEnemy } from "../interfaces/Enemy";
import { WorldManager } from "./WorldManager";
import { Ghost } from "../objects/enemies/Ghost";
import { Client, Room } from "colyseus.js";
import { SAliveEntity } from "../interfaces/SAliveEntity";
import { RoomState } from "../schemas/RoomState";
import { Player } from "../classes/Player";
import { UI } from "../scenes/UI";
import { PCControlsProvider } from "../providers/PCControlsProvider";
import { CharacterManagersProvider } from "../providers/CharacterManagersProvider";
import { ScytheGirlNetManager } from "../objects/sctythe-girl/ScytheGirlNetManager";
import { CharactersProvider } from "../providers/CharactersProvider";

export class NETManager{

    //private static client = new Client("/.proxy/websocket");
    static room: Room<RoomState>;
    static numberOfPlayers = 0;
    static scene:Game;
    static blocked = false;
    static ping = 0;
    static action = "";
    static pingStart: number;

    // static async login(button:Element){
    //     try {
    //         const userdata = await this.client.auth.signInWithProvider('discord');
    //         button.textContent = "REGISTERED!!!"
    //         console.log(userdata);
        
    //     } catch (e: any) {
    //         console.error(e.message);
    //     }
    // }
    
    static async connect(colyseusSDK:Client){
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.getPing,
            callbackScope: this,
            loop: true
        })
        this.room =  await colyseusSDK.join<RoomState>("my_room");
        
        this.room.state.scytheGirls.onAdd((character, sessionID:string)=>{
            character.onChange(()=>{
                if(character.id != this.room.sessionId){
                    let interpolationFactor = 0.7
                    let player = WorldManager.scytheGirls.get(character.id)!;
                    player.idle = character.idle
                    player.x = PMath.Linear(player.x, character.x, interpolationFactor)
                    player.y = PMath.Linear(player.y, character.y, interpolationFactor)
                    player.health = character.health;
                }
            })
        })

        this.room.state.scytheGirls.onRemove((player:SAliveEntity, sessionID: string)=>{
            this.deletePlayer(sessionID)
        })

        this.room.state.enemies.onAdd(e=>{
            e.onChange(()=>{
                if(WorldManager.enemies.get(e.id)){
                    let interpolationFactor = 0.7
                    let enemy = WorldManager.enemies.get(e.id)!
                    enemy.getDamage(e.health)
                    enemy.saveLastPosition()
                    enemy.x = PMath.Linear(enemy.x, e.x, interpolationFactor)
                    enemy.y = PMath.Linear(enemy.y, e.y, interpolationFactor)
                    enemy.idle = e.idle;
                    enemy.updatePartition()
                }
            })
        })

        //this.socket.on("ping", ()=>{this.ping = this.scene.time.now - this.pingStart})
        this.room.onMessage("update", (data: {characters:Array<ICharacter>, enemies: Array<IEnemy>})=>{
            data.characters.forEach(c => {
                this.addPlayer(c)
                if(c.id == this.room.sessionId){
                    let character = WorldManager.scytheGirls.get(this.room.sessionId)!
                    character.controls = PCControlsProvider.getScytheGirlPcControls(this.scene.input)
                    WorldManager.mainPlayer = new Player(character, true);
                    this.scene.game.scene.add("UI", new UI(c.abilities, WorldManager.mainPlayer.character), true);
                    this.scene.fixCamera(WorldManager.mainPlayer.character);
                }
            })
            console.log(data.enemies)
            data.enemies.forEach(e => this.addEnemy(e))
            console.log(WorldManager.enemies)
        })

        this.room.onMessage("pe", (character:ICharacter)=>{
            this.addPlayer(character)
        })

        this.room.onMessage("wk", (data: {id:string, direction: PMath.Vector2})=>{
            this.receiveWalk(data.id, data.direction);
        });
        
        //Needed to update the direction of the enemy
        this.room.onMessage("em", (data: {id: string, vector: PMath.Vector2})=>{
            this.receiveEnemyMovement(data.id, data.vector);
        });

        this.room.onMessage("ping",()=>{
            this.ping = this.scene.time.now-this.pingStart;
        })

        this.room.onMessage("ed", (data: {id:string, damage:number})=>{
            console.log(data)
            WorldManager.enemies.get(data.id)!.getDamageClient(data.damage)
        })

        ScytheGirlNetManager.set(this.room)
    }

    static getPing(){
        this.pingStart = this.scene.time.now
        this.room.send("ping")
    }

    static addPlayer(character:ICharacter){
        console.log(CharactersProvider.callbacks[character.characterClass])
        if(!WorldManager.scytheGirls.get(character.id)){
            WorldManager.scytheGirls.set(character.id, CharactersProvider.callbacks[character.characterClass](this.scene, character))
        }
    }
    
    static addEnemy(enemy:IEnemy){
        if(!WorldManager.enemies.get(enemy.id)){
            let worldEnemy = new Ghost(this.scene, enemy)
            WorldManager.enemies.set(enemy.id, worldEnemy)
            // console.log(WorldManager.mapParitions.get(
            //     {
            //         x:Math.floor(worldEnemy.x/WorldManager.width), 
            //         y: Math.floor(worldEnemy.y/WorldManager.width)
            //     }))
            WorldManager.mapPartitions.get(
                    Math.floor(worldEnemy.x/WorldManager.width).toString() + "-"+
                    Math.floor(worldEnemy.y/WorldManager.width).toString()
                )?.push(worldEnemy)
        }
    }

    static deletePlayer(id:string){
        //console.log("hello")
        this.scene.events.once(Scenes.Events.POST_UPDATE, ()=>{
            let player = WorldManager.scytheGirls.get(id)
            WorldManager.scytheGirls.delete(id);
            WorldManager.aliveEntities.delete(id);
            player!.destroyAbilities();
            player!.destroy();
        })
    }

    private static receiveWalk(id: string, direction: PMath.Vector2){
        this.action = "Walk";
        if(id != this.room.sessionId)
           CharacterManagersProvider.getScytheGirlManager().pointerDownMove(WorldManager.scytheGirls.get(id)!, direction)
    }

    private static receiveEnemyMovement(id:string, vector:PMath.Vector2){
        if(WorldManager.enemies.has(id)){
            WorldManager.enemies.get(id)!.idle = false;
            WorldManager.enemies.get(id)!.changeDirectionInput(vector);
            WorldManager.enemies.get(id)!.update(this.scene.delta)
        }
    }

    static sendWalk(direction: Vector2){
        if(!this.blocked){
            this.room.send("wk", direction);
            this.blocked = true;
            this.scene.time.delayedCall(16, ()=>this.blocked=false)
        }
    }
}