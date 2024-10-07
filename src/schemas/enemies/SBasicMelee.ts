import { type } from "@colyseus/schema";
import { SAliveEntity } from "../SAliveEntity";
import { SStraightDirectionsAbility } from "../combat/SStraightDirectionAbility";

export class SBasicMelee extends SAliveEntity{
    @type(SStraightDirectionsAbility) ability = new SStraightDirectionsAbility();
}