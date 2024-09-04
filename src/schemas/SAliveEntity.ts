import {Schema, type} from "@colyseus/schema";

export class SAliveEntity extends Schema{
    @type("string") id: string;
    @type("number") x: number;
    @type("number") y: number;
    @type("boolean") idle: boolean;
    @type("number") health: number;
    @type("string") type: string;
}