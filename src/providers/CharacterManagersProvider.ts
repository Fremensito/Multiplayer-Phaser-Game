import { ScytheGirlManager } from "../objects/sctythe-girl/ScytheGirlManager";

export class CharacterManagersProvider{

    static scytheGirlManager: ScytheGirlManager

    static getScytheGirlManager(): ScytheGirlManager{
        if(!this.scytheGirlManager)
            return new ScytheGirlManager();
        else
            return this.scytheGirlManager;
    }
}