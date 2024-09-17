import { GameObjects, Math, Scene } from "phaser";
import SAT from "sat";

export class QSAbility{

    hitbox: SAT.Polygon
    graphics: GameObjects.Graphics;
    scene:Scene
    lastRot = 0;

    constructor(scene:Scene, x:number, y:number){
        this.hitbox = new SAT.Box(new SAT.Vector(x, y-2), 48, 4).toPolygon();
        let points = this.hitbox.calcPoints;
        this.hitbox.setPoints([
            new SAT.Vector(points[0].x, points[0].y -2),
            new SAT.Vector(points[1].x, points[1].y -2),
            new SAT.Vector(points[2].x, points[2].y -2),
            new SAT.Vector(points[3].x, points[3].y -2)
        ])
        this.graphics = scene.add.graphics();
        this.graphics.depth = 5000;
        this.scene = scene;
    }

    debug(x:number, y:number){
        this.graphics.clear()
        this.graphics.lineStyle(1, 0xff4c4a);
        //console.log(this.scene.input.mousePointer.position.angle())
        this.hitbox.pos.x = x;
        this.hitbox.pos.y = y;
        let direction = new Math.Vector2(this.scene.input.mousePointer.worldX-x, this.scene.input.mousePointer.worldY -y).normalize()
        // let hitbox = this.hitbox.toPolygon()
        // let points = hitbox.calcPoints;
        // hitbox.setPoints([
        //     new SAT.Vector(points[0].x, points[0].y -2),
        //     new SAT.Vector(points[1].x, points[1].y -2),
        //     new SAT.Vector(points[2].x, points[2].y -2),
        //     new SAT.Vector(points[3].x, points[3].y -2)
        // ])
        this.hitbox.setAngle(direction.angle())
        this.drawLines(this.hitbox, this.hitbox.calcPoints);
    }

    drawLines(hitbox:SAT.Polygon, points: SAT.Vector[]){
        this.graphics.lineBetween(
           hitbox.pos.x + points[0].x, 
           hitbox.pos.y + points[0].y, 
           hitbox.pos.x + points[1].x, 
           hitbox.pos.y + points[1].y
        );

        this.graphics.lineBetween(
           hitbox.pos.x + points[1].x, 
           hitbox.pos.y + points[1].y, 
           hitbox.pos.x + points[2].x,
           hitbox.pos.y + points[2].y
        );

        this.graphics.lineBetween(
           hitbox.pos.x + points[2].x, 
           hitbox.pos.y + points[2].y, 
           hitbox.pos.x + points[3].x, 
           hitbox.pos.y + points[3].y
        );

        this.graphics.lineBetween(
           hitbox.pos.x + points[3].x, 
           hitbox.pos.y + points[3].y, 
           hitbox.pos.x + points[0].x, 
           hitbox.pos.y + points[0].y
        );
    }
}