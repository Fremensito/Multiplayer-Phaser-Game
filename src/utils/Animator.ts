import { Scene } from "phaser";

export class Animator{
    static generateCharacterAnimations(scene:Scene, name: string, texture: string, start:number, end: number, frameRate: number){
        scene.anims.create({
            key: name,
            frames: scene.anims.generateFrameNumbers(texture, {
                start: start,
                end: end
            }),
            frameRate: frameRate,
        })
    }

    static generateAbilityAnimations(scene: Scene, name: string, texture: string, start:number, end: number, speed: number){
        scene.anims.create({
            key: name,
            frames: scene.anims.generateFrameNumbers(texture, {
                start: start,
                end: end
            }),
            frameRate: speed,
            showOnStart: true,
            hideOnComplete: true,
        })
    }
}