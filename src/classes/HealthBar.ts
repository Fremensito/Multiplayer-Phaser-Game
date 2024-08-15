import { GameObjects, Scene } from "phaser";

export class HealthBar extends GameObjects.Rectangle{

    quantity:number

    constructor(scene: Scene, x:number, y:number, quantity:number){
        super(scene, x, y, quantity/10, 1, 0xff0000)
        this.quantity = quantity
        scene.add.existing(this)
        this.depth = 1000
    }

    update(x:number, y:number){
        this.width = this.quantity/10
        this.x = x;
        this.y = y;
    }
}