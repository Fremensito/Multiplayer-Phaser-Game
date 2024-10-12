import { IAbility } from "./Ability";

export interface IEnemy{
    speed: number;
    x:number;
    y:number;
    pointToMoveX: number;
    pointToMoveY: number;
    directionX: number;
    directionY:number;
    velocityX:number;
    velocityY:number;
    health: number;
    abilities: Array<IAbility>;
    id: string;
}