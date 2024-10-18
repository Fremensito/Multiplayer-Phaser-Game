import { GameObjects, Geom, Scene } from "phaser";
import { SlotShine } from "../pipelines/SlotShine";

export class Misc{
    slot: GameObjects.Image
    icon: GameObjects.Image

    setAssets(scene:Scene, slot:string, icon:string){
        this.slot = new GameObjects.Image(scene, 0, 0, slot)
        this.icon = new GameObjects.Image(scene, 0, 0, icon)

        this.slot.scale = 2
        this.slot.setPostPipeline(SlotShine)
        //console.log(this.slot.postPipelines)
        this.icon.scale = 2

        //this.slot.setInteractive(new Geom.Rectangle((64-36)/2, (64-36)/2, 36, 36), Geom.Rectangle.Contains)
        this.slot.setInteractive()
        //this.icon.setInteractive()
        
        this.setTint(this.slot)
        //this.setTint(this.icon)

        scene.add.existing(this.slot)
        scene.add.existing(this.icon)
    }

    setTint(image: GameObjects.Image|GameObjects.Shader){
        image.on("pointerover",() =>{
            (this.slot.getPostPipeline(SlotShine) as SlotShine).brightness = 1.2
        }, this)

        image.on("pointerout",() =>{
            (this.slot.getPostPipeline(SlotShine) as SlotShine).brightness = 1
        }, this)
    }
}