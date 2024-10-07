import { type } from "@colyseus/schema";
import { SAliveEntity } from "../SAliveEntity";
import { SStraightDirectionsAbility } from "../combat/SStraightDirectionAbility";

export class SScytheGirl extends SAliveEntity{
    @type(SStraightDirectionsAbility) q = new SStraightDirectionsAbility();
}