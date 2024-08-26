import {Schema, type} from "@colyseus/schema";

export class SAliveEntity extends Schema{
    @type("string") id: string;
    @type("number") x: number;
    @type("number") y: number;
    @type("number") health: number;
    @type("string") type: string;
}