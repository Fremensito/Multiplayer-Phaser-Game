import {Schema, ArraySchema, type} from "@colyseus/schema";
import { SVector2 } from "../SVector2";

export class SStraightDirectionsAbility extends Schema{
    @type([SVector2]) right = new ArraySchema<SVector2>();
    @type([SVector2]) down = new ArraySchema<SVector2>();
    @type([SVector2]) left = new ArraySchema<SVector2>();
    @type([SVector2]) up = new ArraySchema<SVector2>();
}