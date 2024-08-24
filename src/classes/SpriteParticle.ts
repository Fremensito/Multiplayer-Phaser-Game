import { Animations, GameObjects, Scene } from "phaser";

export class SpriteParticle extends GameObjects.Sprite{
    constructor(scene: Scene, x: number, y: number, name: string, texture: string, start:number, end: number, frameRate: number){

        super(scene, x, y, "W-particles")
        scene.add.existing(this)
        //const sprite = scene.add.sprite(x,y, name);
        
        //this.preFX?.addGlow(0xff4040, 6)
        this.postFX.addGlow(0xff4040, 6)
        
        this.anims.create({
            key: name,
            frames: scene.anims.generateFrameNumbers(texture, {
                start: start,
                end: end
            }),
            frameRate: frameRate,
        })
        this.anims.play(name);
        this.on(Animations.Events.ANIMATION_COMPLETE, ()=>this.destroy());
    }
}