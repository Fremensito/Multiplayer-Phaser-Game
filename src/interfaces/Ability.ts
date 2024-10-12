import { GameObjects } from "phaser";

export interface IUIAbility{
    abilityWidth: number;
    abilityHeight: number
    slotResource: string;
    iconResource: string;
}

export interface IAbility{
    name: string;
    cooldown: number;
    speed: number;
    mana_cost: number;
    particlesSprite: string;
    sprite: string;
    range: number;
    UI: IUIAbility;
}

export interface UIShaders{
    icon: GameObjects.Shader;
    slot: GameObjects.Shader;
}

export interface StraighAttackDirections{
    down:string;
    right:string;
    left:string;
    up:string;
}
