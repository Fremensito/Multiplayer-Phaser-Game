import { GameObjects, Scene } from "phaser";
import { Health } from "./Health";

export class Profile extends GameObjects.Image{
    health: Health;

    constructor(scene:Scene, x:number, y:number, texture: string, healthTexture: string, fullHealth:number){
        super(scene, x, y, texture)
        this.scale=4;
        this.x += this.width*this.scale/2
        this.y += this.height*this.scale/2
        scene.add.existing(this)
        this.health = new Health(scene, healthTexture, fullHealth);
    }

    // update(delta:number){
    //     this.health.update(delta)
    // }
}