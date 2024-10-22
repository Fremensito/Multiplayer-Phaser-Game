import { GameObjects, Geom, Input, Scene } from "phaser";
import { SlotShine } from "../pipelines/SlotShine";
import { SlotIcon } from "./SlotIcon";

export class Misc extends SlotIcon{
    
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

    setTint(image: GameObjects.Image){
        image.on("pointerover",() =>{
            (this.slot.getPostPipeline(SlotShine) as SlotShine).brightness = 1.2
        }, this)

        image.on("pointerout",() =>{
            (this.slot.getPostPipeline(SlotShine) as SlotShine).brightness = 1
        }, this)

        image.on("pointerdown", (pointer:Input.Pointer)=>{
            if(pointer.button === 0){
                const tint = 0x9b9797
                this.slot.setTint(tint);
                this.icon.setTint(tint)
                this.icon.scene.time.addEvent({
                    delay: 200,
                    callbackScope: this,
                    callback: ()=>this.icon.clearTint()
                })
                this.slot.scene.time.addEvent({
                    delay: 200,
                    callbackScope: this,
                    callback: ()=>this.slot.clearTint()
                })
            }
        }, this)
    }
}