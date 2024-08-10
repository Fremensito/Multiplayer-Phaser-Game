import { Player } from "../classes/Player";

export class WorldManager{
    static mainPlayer: Player;
    static players: Map<string, Player>
}