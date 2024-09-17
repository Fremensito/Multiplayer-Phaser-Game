import {Schema, type, MapSchema} from "@colyseus/schema"
import { SAliveEntity } from "./SAliveEntity";
import { SScytheGirl } from "./SScytheGirl";

export class RoomState extends Schema {

    @type({map: SAliveEntity}) scytheGirls = new MapSchema<SScytheGirl, string>();
    @type({map: SAliveEntity}) enemies = new MapSchema<SAliveEntity, string>();
}
