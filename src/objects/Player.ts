import { GameObjects, Physics, Scene } from "phaser";


export class Player extends Physics.Arcade.Sprite{
    speed:number;
    idle: boolean;
    directions = {
        up:  {x:0, y:1},
        right: {x:1, y: 0},
        down: {x:0, y: -1},
        left: {x: -1, y: 0}
    }

    constructor(scene:Scene,x:number,y:number){
        super(scene, x, y, "player", 0);
        scene.add.existing(this);
        this.speed = 1800;
        this.idle = true;
        scene.physics.add.existing(this)
    }

    something(){
       
    }
}