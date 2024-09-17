import {ArraySchema} from "@colyseus/schema";
import { SVector2 } from "../schemas/SVector2";
import { Game } from "../scenes/Game";

export function drawLines(hitbox: ArraySchema<SVector2>){

    Game.graphics.lineBetween(
        hitbox[0].x, 
        hitbox[0].y, 
        hitbox[1].x, 
        hitbox[1].y
    );

    Game.graphics.lineBetween(
        hitbox[1].x, 
        hitbox[1].y, 
        hitbox[2].x,
        hitbox[2].y
    );

    Game.graphics.lineBetween(
        hitbox[2].x, 
        hitbox[2].y, 
        hitbox[3].x, 
        hitbox[3].y
    );

    Game.graphics.lineBetween(
        hitbox[3].x, 
        hitbox[3].y, 
        hitbox[0].x, 
        hitbox[0].y
    );
}