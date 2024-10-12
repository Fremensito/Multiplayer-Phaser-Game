import { GameObjects, Scene } from "phaser"
import { IAbility, StraightAttackDirections } from "../../../interfaces/Ability"
import { Animator } from "../../../utils/Animator"

export class StraightDirectionAttacks {

    static generateAnimations(scene:Scene, directions:StraightAttackDirections, texture:string, frames:number, ability:IAbility){
        let currentFrames = 0
        Animator.generateAbilityAnimations(scene, directions.down, texture, currentFrames, currentFrames+(frames-1), ability.speed)
        currentFrames += frames
        Animator.generateAbilityAnimations(scene, directions.right, texture, currentFrames, currentFrames+(frames-1), ability.speed)
        currentFrames += frames
        Animator.generateAbilityAnimations(scene, directions.left, texture, currentFrames, currentFrames+(frames-1), ability.speed)
        currentFrames += frames
        Animator.generateAbilityAnimations(scene, directions.up, texture, currentFrames, currentFrames+(frames-1), ability.speed)
    }

    static attack(direction:string, directions: StraightAttackDirections, sprite: GameObjects.Sprite){
        switch(direction){
            case directions.up:
                sprite.play({key: directions.up, repeat: 0, startFrame: 0})
                break;
            
            case directions.right:
                sprite.play({key: directions.right, repeat: 0, startFrame: 0})
                break;
            
            case directions.down:
                sprite.play({key: directions.down, repeat: 0, startFrame: 0})
                break;
            
            case directions.left:
                sprite.play({key: directions.left, repeat: 0, startFrame: 0})
                break;
        }
    }
}