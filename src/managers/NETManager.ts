import { io, Socket } from "socket.io-client";
import { IAbility } from "../interfaces/Ability";
import { ICharacter } from "../interfaces/Character";
import { Character } from "../objects/Character";
import { Game } from "../scenes/Game";
import { Math } from "phaser";
import { CharactersManager } from "./CharactersManager";
import { Vector2 } from "../interfaces/Vector2";
import { IEnemy } from "../interfaces/Enemy";
import { WorldManager } from "./WorldManager";
import { Enemy } from "../objects/Enemy";

const abilities: Array<IAbility> = [
    {
        name: "basic attack",
        cooldown: 1000,
        speed: 8,
        mana_cost: 0,
        particlesSprite: "",
        UI: {
            abilityWidth: 32,
            abilityHeight: 32,
            slotResource: "ui/hability.png",
            iconResource: "ui/scythe_hability.png"
        },
        range:20
    },
    {
        name: "W",
        cooldown: 3000,
        speed: 12,
        mana_cost: 0,
        particlesSprite: "W-particles.png",
        UI: {
            abilityWidth: 32,
            abilityHeight: 32,
            slotResource: "ui/W-slot.png",
            iconResource: "ui/W-icon.png"
        },
        range:26
    },
]


const character:ICharacter = {
    speed: 0.6,
    x: 280,
    y: 280,
    abilities: abilities,
    characterClass: "scythe-girl",
    id: "testeo",
}

export class NETManager{

    private static socket: Socket;
    static players = new Map<string, Character>;
    static numberOfPlayers = 0;
    static scene:Game;
    static blocked = false;
    static ping = 100;
    static action = "";
    static id: string;
    static pingStart: number;
    
    static connect(){
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.getPing,
            callbackScope: this,
            loop: true
        })
        this.players = new Map<string,Character>;   
        this.socket = io("http://localhost:3000");
        this.socket.on("connect", ()=>this.id = this.socket.id!)
        this.socket.on("ping", ()=>{this.ping = this.scene.time.now - this.pingStart})
        this.socket.on("update", (characters: Array<ICharacter>, enemies:Array<IEnemy>)=>{
            characters.forEach(c => {
                this.addPlayer(c)
                if(c.id == this.id){
                    this.scene.generateMainPlayer(WorldManager.players.get(c.id)!);
                }
            })

            enemies.forEach(e => this.addEnemy(e))
        })
        this.socket.on("disconnected", (id:string)=>this.deletePlayer(id))
        this.socket.on("pe",(m:ICharacter) => this.addPlayer(m))
        this.socket.on("wk", (id:string, direction: Math.Vector2) => this.receiveWalk(id, direction))
        this.socket.on("em", (id:string, vector:Math.Vector2)=> this.receiveEnemyMovement(id, vector))
        this.socket.on("ed", (damage:number, id:string) => WorldManager.enemies.get(id)?.getDamage(damage))
        this.socket.on("q", (id:string,direction: Math.Vector2) => this.receiveQ(id, direction))
        this.socket.on("w", (id:string,direction: Math.Vector2) => this.receiveW(id, direction))
        this.socket.on("state", (id:string, position:Vector2)=>this.receiveState(id, position))
        this.numberOfPlayers++;
    }

    static getPing(){
        this.pingStart = this.scene.time.now
        this.scene.time.delayedCall(
            this.ping/2,
            ()=>this.socket.emit("ping"),
            [],
            this
        )
    }

    static addPlayer(character:ICharacter){
        if(!WorldManager.players.get(character.id)){
            WorldManager.players.set(character.id, new Character(this.scene, character))
        }
    }
    
    static addEnemy(enemy:IEnemy){
        if(!WorldManager.enemies.get(enemy.id)){
            WorldManager.enemies.set(enemy.id, new Enemy(this.scene, enemy))
        }
    }

    static deletePlayer(id:string){
        //console.log("hello")
        let player = WorldManager.players.get(id)
        player!.destroy();
        WorldManager.players.delete(id)
    }

    static update(){
        this.players.forEach((c)=>{
            c.update(this.scene.delta)
        })
    }

    private static receiveWalk(id: string, direction: Math.Vector2){
        this.action = "Walk";
        if(id != this.id)
            CharactersManager.pointerDownMove(WorldManager.players.get(id)!, direction)
    }

    private static receiveQ(id: string, direction: Math.Vector2){
        this.action = "Q";
        if(id != this.id)
            CharactersManager.useQ(WorldManager.players.get(id)!, direction)
    }

    private static receiveW(id: string, direction: Math.Vector2){
        this.action = "W";
        if(id != this.id)
            CharactersManager.useW(WorldManager.players.get(id)!, direction)
    }

    private static receiveState(id:string, position:Vector2){
        if(id == this.socket.id){
            console.log({x:this.scene.character.x, y:this.scene.character.y}, position)
            this.scene.character.x = position.x;
            this.scene.character.y = position.y;
            console.log("adjusted")
        }
    }

    private static receiveEnemyMovement(id:string, vector:Math.Vector2){
        WorldManager.enemies.get(id)!.changeDirectionInput(vector);
        WorldManager.enemies.get(id)!.idle = false;
    }

    static sendWalk(direction: Vector2){
        if(!this.blocked){
            this.scene.time.delayedCall(
                this.ping/2,
                ()=>this.socket.emit("wk", {x: direction.x, y: direction.y}, {x: this.scene.character.x, y:this.scene.character.y}),
                [],
                this
            )
            this.blocked = true;
            this.scene.time.delayedCall(100, ()=>this.blocked=false)
        }
    }

    static sendQ(direction: Vector2, weaponDirection: string){
        this.scene.time.delayedCall(
            this.ping/2,
            () => this.socket.emit("q", {x: direction.x, y:direction.y}, weaponDirection),
            [],
            this
        )
    }

    static sendW(direction:Vector2){
        this.scene.time.delayedCall(
            this.ping/2,
            ()=>{this.socket.emit("w", {x: direction.x, y:direction.y}), console.log("W")},
            [],
            this
        )
    }

    static sendState(idle: boolean, direction: Vector2){
        this.socket.emit("state", idle, direction)
    }
}