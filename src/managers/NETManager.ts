import { io, Socket } from "socket.io-client";
import { Player } from "../classes/Player";
import { IAbility } from "../interfaces/Ability";
import { ICharacter } from "../interfaces/Character";
import { Character } from "../objects/Character";
import { Game } from "../scenes/Game";
import { Math } from "phaser";
import { CharactersManager } from "./CharactersManager";
import { Action } from "../interfaces/Action";
import { Vector2 } from "../interfaces/Vector2";

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
        }
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
        }
    },
]


const character:ICharacter = {
    speed: 40,
    x: 0,
    y: 0,
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

    static getPlayer(userName: string, password: string):Player{
        return new Player(character);
    };
    
    static connect(){
        this.players = new Map<string,Character>;   
        this.socket = io("https://www.exhausteddevs.lol:443");
        this.socket.on("update", (characters: Array<Array<string|ICharacter>>)=>{
            characters.forEach(c => {
                this.addPlayer(c[1] as ICharacter)
            })
        })
        this.socket.on("pe",(m:ICharacter) => this.addPlayer(m))
        this.socket.on("wk", (id:string, direction: Math.Vector2) => this.receiveWalk(id, direction))
        this.socket.on("q", (id:string,direction: Math.Vector2) => this.receiveQ(id, direction))
        this.socket.on("w", (id:string,direction: Math.Vector2) => this.receiveW(id, direction))
        this.numberOfPlayers++;
    }

    static addPlayer(character:ICharacter){
        if(!this.players.get(character.id)){
            this.players.set(character.id, new Character(this.scene, character))
            this.numberOfPlayers++;
        }
        //this.scene.add.existing(this.players.get(id)!)
    }

    static update(){
        this.players.forEach((c)=>{
            c.update()
        })
    }

    private static receiveWalk(id: string, direction: Math.Vector2){
        CharactersManager.pointerDownMove(this.players.get(id)!, direction)
    }

    private static receiveQ(id: string, direction: Math.Vector2){
        CharactersManager.useQ(this.players.get(id)!, direction)
    }

    private static receiveW(id: string, direction: Math.Vector2){
        CharactersManager.useW(this.players.get(id)!, direction)
    }

    static sendWalk(direction: Vector2){
        if(!this.blocked){
            this.socket.emit("wk", {x: direction.x, y: direction.y})
            this.blocked = true;
            this.scene.time.delayedCall(100, ()=>this.blocked=false)
        }
    }

    static sendQ(direction: Vector2){
        this.socket.emit("q", {x: direction.x, y:direction.y})
    }

    static sendW(direction:Vector2){
        this.socket.emit("w", {x: direction.x, y:direction.y})
    }
}