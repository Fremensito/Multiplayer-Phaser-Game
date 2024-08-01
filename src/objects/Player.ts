import { GameObjects, Input, Physics, Scene, Math } from "phaser";


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

    move(p:Input.Pointer, delta: number){
        if(!this.idle && p.button === 0){
            const direction = new Math.Vector2(p.worldX - this.getCenter().x, p.worldY - this.getCenter().y);
            direction.normalize()
            this.setVelocity(direction.x*delta/1000*this.speed, direction.y*delta/1000*this.speed)
        }
    }
}