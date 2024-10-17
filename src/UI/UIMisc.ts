import { GameObjects, Geom, Scene } from "phaser";

export class Misc{
    slot: GameObjects.Shader
    icon: GameObjects.Image

    setAssets(scene:Scene, shader:GameObjects.Shader, icon:string){
        this.slot = shader
        this.icon = new GameObjects.Image(scene, 0, 0, icon)

        //this.slot.scale = 2
        this.icon.scale = 2

        console.log(this.slot.getBounds())
        this.slot.setInteractive(new Geom.Rectangle((64-36)/2, (64-36)/2, 36, 36), Geom.Rectangle.Contains)
        //this.icon.setInteractive()
        
        this.setTint(this.slot)
        //this.setTint(this.icon)


        //scene.add.existing(this.slot)
        scene.add.existing(this.icon)
    }

    setTint(image: GameObjects.Image|GameObjects.Shader){
        image.on("pointerover",() =>{
            this.slot.setUniform("brightness.value", 1.2)
        }, this)

        image.on("pointerout",() =>{
            this.slot.setUniform("brightness.value", 1.0)
        }, this)
    }
}