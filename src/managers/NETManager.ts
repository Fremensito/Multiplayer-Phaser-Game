import { Player } from "../classes/Player";
import { IAbility } from "../interfaces/Ability";
import { ICharacter } from "../interfaces/Character";

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
    characterClass: "scythe-girl"
}

export class NETManager{
    static getPlayer(userName: string, password: string):Player{
        return new Player(character);
    };
}