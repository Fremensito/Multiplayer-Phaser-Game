import {Schema, ArraySchema, type} from "@colyseus/schema";
import { SAliveEntity } from "./SAliveEntity";
import { SVector2 } from "./SVector2";

export class SScytheGirl extends SAliveEntity{
    @type([SVector2]) qRight = new ArraySchema<SVector2>();
    @type([SVector2]) qDown = new ArraySchema<SVector2>();
    @type([SVector2]) qLeft = new ArraySchema<SVector2>();
    @type([SVector2]) qUp = new ArraySchema<SVector2>();
    @type([SVector2]) w = new ArraySchema<SVector2>();
}