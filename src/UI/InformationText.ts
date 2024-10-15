import { GameObjects, Scene } from "phaser";

export class InformationText extends GameObjects.Text{
    constructor(scene:Scene, x:number, y:number, maxWidth: number, text:string){
        super(scene, x, y, text, 
            {fontFamily: 'InTheDarkness, "Goudy Bookletter 1911", Times, serif' ,
            color: "#fbf236",
            fontSize: 14, 
            resolution:2, 
            align: "center",
            wordWrap: {width: maxWidth}
            }
        )
        this.scene.add.existing(this)
    }
}