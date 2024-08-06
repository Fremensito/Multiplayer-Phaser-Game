import { Player } from "../classes/Player";
import { ICharacter } from "../interfaces/Character";

const abilities = [
    {
        name: "basic attack",
        cooldown: 3,
        speed: 8,
        mana_cost: 0,
        UI: {
            abilityWidth: 32,
            abilityHeight: 32,
            slotResource: "ui/hability.png",
            iconResource: "ui/scythe_hability.png"
        }
    },
]


const character:ICharacter = {
    speed: 40,
    x: 0,
    y: 0,
    abilities: abilities,
    characterClass: "scythe-girl"
}

export class NETManager{
    
    static getPlayer(userName: string, password: string):Player{
        return new Player(character);
    };
}