import { IAbility } from "../../../interfaces/Ability";
import { WorldManager } from "../../../managers/WorldManager";
import { CombatAbility } from "../CombatAbility";
import SAT from "sat";
import { GameObjects, Scene } from "phaser";
import { SCYTHE_GIRL } from "../../../utils/AssetsGlobals";

export class QAbility extends CombatAbility{

    directions = {
        up: "QUp",
        right: "QRight",
        down: "QDown",
        left: "QLeft"
    }

    attackWidth = 32
    up: SAT.Box;
    right: SAT.Box;
    down: SAT.Box;
    left: SAT.Box;

    graphics: GameObjects.Graphics;

    constructor(scene:Scene, ability: IAbility, x:number, y: number, texture: string){
        super(scene, ability, x, y, texture)
        this.generateAnimations(this.directions.down, SCYTHE_GIRL.QVFX, 0, 6, ability.speed)
        this.generateAnimations(this.directions.right, SCYTHE_GIRL.QVFX, 7, 13, ability.speed)
        this.generateAnimations(this.directions.left, SCYTHE_GIRL.QVFX, 14, 20, ability.speed)
        this.generateAnimations(this.directions.up, SCYTHE_GIRL.QVFX, 21, 27, ability.speed)

        //this.graphics = scene.add.graphics();
        this.up = new SAT.Box(new SAT.Vector(x - this.attackWidth/2, y-this.range), this.attackWidth, this.range)
        this.down = new SAT.Box(new SAT.Vector(x- this.width/2, y), this.attackWidth, this.range)
        this.right = new SAT.Box(new SAT.Vector(x, y - this.attackWidth/2), this.range, this.attackWidth)
        this.left = new SAT.Box(new SAT.Vector(x-this.range, y - this.attackWidth/2), this.range, this.attackWidth)
        // this.left = new SAT.Box(new SAT.Vector(x))
    }

    doDamage(direction:string){
        switch(direction){
            case this.directions.up:
                this.play({key: this.directions.up, repeat: 0, startFrame: 0})
                WorldManager.enemies.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.up.toPolygon(), e.box.toPolygon()))
                        e.getDamageClient(10);
                })
                break;
            
            case this.directions.right:
                this.play({key: this.directions.right, repeat: 0, startFrame: 0})
                WorldManager.enemies.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.right.toPolygon(), e.box.toPolygon()))
                        e.getDamageClient(10);
                })
                break;
            
            case this.directions.down:
                this.play({key: this.directions.down, repeat: 0, startFrame: 0})
                WorldManager.enemies.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.down.toPolygon(), e.box.toPolygon()))
                        e.getDamageClient(10);
                })
                break;
            
            case this.directions.left:
                this.play({key: this.directions.left, repeat: 0, startFrame: 0})
                WorldManager.enemies.forEach(e=>{
                    if(SAT.testPolygonPolygon(this.left.toPolygon(), e.box.toPolygon()))
                        e.getDamageClient(10);
                })
                break;
        }
    }

    updatePosition(x:number, y:number){
        super.updatePosition(x, y)
        this.up.pos = new SAT.Vector(x - this.attackWidth/2, y-this.range)
        this.down.pos = new SAT.Vector(x - this.attackWidth/2, y)
        this.right.pos = new SAT.Vector(x, y - this.attackWidth/2)
        this.left.pos = new SAT.Vector(x - this.range, y - this.attackWidth/2)
    }

    debug(x:number, y: number){
        this.graphics.clear()
        this.graphics.lineStyle(1, 0xff4c4a);

        this.drawLines(this.up, this.up.toPolygon().points)
        
        this.drawLines(this.down, this.down.toPolygon().points)

        this.drawLines(this.right, this.right.toPolygon().points)
        
        this.drawLines(this.left, this.left.toPolygon().points)
    }

    drawLines(hitbox:SAT.Box, points: SAT.Vector[]){
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