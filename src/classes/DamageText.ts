import { GameObjects, Scene } from "phaser"

export class DamageText extends GameObjects.Text{
    constructor(scene:Scene, x: number, y: number, damage:number){
        super(scene, x-3.5, y-10, damage.toString(), { 
            fontFamily: 'InTheDarkness, "Goudy Bookletter 1911", Times, serif' ,
            color: "#fbf236",
            fontSize: 7
        })

        this.depth = 2000
        this.setResolution(3)
        this.scene.add.existing(this)

        this.scene.tweens.add({
            targets:this,
            y: {from: this.y, to: this.y - 20},
            duration: 500,
            onComplete: ()=>this.destroy()
        })
    }
}