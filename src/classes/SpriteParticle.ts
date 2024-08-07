import { Animations, GameObjects, Scene } from "phaser";

export class SpriteParticle{
    constructor(scene: Scene, x: number, y: number, name: string, texture: string, start:number, end: number, frameRate: number){

        const sprite = scene.add.sprite(x,y, name);

        sprite.anims.create({
            key: name,
            frames: scene.anims.generateFrameNumbers(texture, {
                start: start,
                end: end
            }),
            frameRate: frameRate,
        })
        sprite.anims.play(name);
        sprite.on(Animations.Events.ANIMATION_COMPLETE, ()=>sprite.destroy());
    }
}