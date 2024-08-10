import { IAbility} from "./Ability";

export interface ICharacterClass{
    characterClass: string;
    abilities: Array<IAbility>;
}

export interface ICharacter extends ICharacterClass{
    speed: number;
    x:number;
    y:number;
    id: string;
}
