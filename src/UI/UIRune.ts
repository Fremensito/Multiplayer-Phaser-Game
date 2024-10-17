import { GameObjects, Scene } from "phaser";
import { InformationText } from "./InformationText";

export class UIRune extends GameObjects.Image{
    scaleFactor = 4;

    runeName: InformationText
    nameY = 46
    nameWidth = 50
    
    runeDescription: InformationText
    descriptionY = 63
    descriptionWidth = 40
    descriptionHeight = 20

    constructor(scene: Scene, x:number, y:number, texture:string){
        super(scene, x, y, texture)
        this.scale = this.scaleFactor;
        scene.add.existing(this)
        this.generateText(scene, "Dragons Breath", "DMG: + 3")
    }

    generateText(scene: Scene, name:string, description:string){
        this.runeName = new InformationText(scene, 0, 
            this.getTopCenter().y + this.nameY*this.scale, this.nameWidth*this.scale, name)
        this.runeName.x = this.x - this.runeName.width/2;
        
        
        this.runeDescription = new InformationText(scene, 0, 
            this.getTopCenter().y + this.descriptionY*this.scale, this.descriptionWidth*this.scale, description)
        this.runeDescription.x = this.x - this.runeDescription.width/2
    }
}