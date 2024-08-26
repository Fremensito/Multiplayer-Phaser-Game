import {Schema, type, MapSchema} from "@colyseus/schema"
import { SAliveEntity } from "./SAliveEntity";

export class RoomState extends Schema {

    @type({map: SAliveEntity}) characters = new MapSchema<SAliveEntity, string>();
    @type({map: SAliveEntity}) enemies = new MapSchema<SAliveEntity, string>();
}
