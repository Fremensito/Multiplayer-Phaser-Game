import {Schema, type, MapSchema} from "@colyseus/schema"
import { SAliveEntity } from "./SAliveEntity";
import { SScytheGirl } from "./characters/SScytheGirl";
import { SBasicMelee } from "./enemies/SBasicMelee";

export class RoomState extends Schema {

    @type({map: SAliveEntity}) scytheGirls = new MapSchema<SScytheGirl, string>();
    @type({map: SBasicMelee}) basicMeleeEnemies = new MapSchema<SBasicMelee, string>();
}
