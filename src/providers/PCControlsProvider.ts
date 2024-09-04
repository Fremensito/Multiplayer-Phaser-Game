import { Input } from "phaser";
import { PCControlsScytheGirl } from "../objects/sctythe-girl/PCControlsScytheGirl";

export class PCControlsProvider{

    static getScytheGirlPcControls(input: Input.InputPlugin):PCControlsScytheGirl|undefined{
        return new PCControlsScytheGirl(input);
    }
}