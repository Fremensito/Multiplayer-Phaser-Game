import { GameObjects, Scene } from "phaser";

export class Health extends GameObjects.Sprite{
    animation = "health"
    fullHealth: number

    constructor(scene:Scene, texture: string, fullHealth: number){
        super(scene, 0, 0, texture, 0)
        this.fullHealth = fullHealth
        this.scale = 4;
        this.x += this.width*this.scale/2 + 35*4
        this.y += this.height*this.scale/2 + 24*4
        scene.anims.create({
            key: this.animation,
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 0,
                end: 4
            }),
            frameRate: 7,
            repeat: -1
        })
        this.anims.play(this.animation)
        scene.add.existing(this)
    }

    update(delta:number, currentHealth: number){
        if(currentHealth >= 0)
            this.setCrop(0,0, (this.width/this.fullHealth)*currentHealth,5)
        else
            this.setCrop(0,0,0,0)
    }
}