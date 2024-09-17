import {Schema, ArraySchema, type} from "@colyseus/schema";
import { SVector2 } from "./SVector2";

export class SAliveEntity extends Schema{
    @type("string") id: string;
    @type("number") x: number;
    @type("number") y: number;
    @type("boolean") idle: boolean;
    @type("number") health: number;
    @type("string") type: string;
    @type([SVector2]) box = new ArraySchema<SVector2>();
}