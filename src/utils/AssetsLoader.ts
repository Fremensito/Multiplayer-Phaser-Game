import { Scene } from "phaser";
import { GENERAL, GHOST, MAP, SCYTHE_GIRL, UI } from "./AssetsGlobals";
import { UIAbility } from "../UI/UIAbility";
import { ICharacter } from "../interfaces/Character";

export class AssetsLoader{
    private static scytheURL = "classes/scythe-girl/"
    private static mapURL = "map/"
    private static ghostURL = "enemies/ghost/"
    private static generalSounds = "sounds/"
    private static generalUI = "ui/"
    private static runes = "runes/"

    static loadGeneral(scene: Scene){
        scene.load.audio(GENERAL.getHit, `${this.generalSounds}get-hit2.wav`)
        scene.load.image(UI.runeInfo, `${this.generalUI}rune-card.png`)
    }

    static loadUIElements(scene: Scene, abilities:Map<string, UIAbility>, iCharacter:ICharacter){

        scene.load.image(UI.qSlot, abilities.get("Q")!.UI.slotResource); 
        scene.load.image(UI.qIcon, abilities.get("Q")!.UI.iconResource);
        scene.load.image(UI.wSlot, abilities.get("W")!.UI.slotResource); 
        scene.load.image(UI.wIcon, abilities.get("W")!.UI.iconResource);

        scene.load.image(UI.profile, iCharacter.profile)

        scene.load.spritesheet(UI.health, "/ui/health.png", {frameWidth:62, frameHeight:5})

        scene.load.image(UI.runesIcon, "ui/runes.png")
        scene.load.image(UI.inventoryIcon, "ui/inventory.png")
        scene.load.image(UI.runesSlot, "ui/runes-slot.png")
        
    }

    static loadUIShaders(scene:Scene){
        scene.load.glsl(UI.ability, "shaders/cooldown.fx", "fragment")
        scene.load.glsl(UI.brightness, "shaders/slotshine.fx", "fragment")
    }

    static loadScythe(scene: Scene){
        scene.load.spritesheet(SCYTHE_GIRL.walking, `${this.scytheURL}walking.png`,{frameWidth:64, frameHeight: 64});
        scene.load.spritesheet(SCYTHE_GIRL.idle, `${this.scytheURL}idle.png`,{frameWidth:64, frameHeight: 64} );
        scene.load.spritesheet(SCYTHE_GIRL.Q, `${this.scytheURL}Q.png`,{frameWidth:64, frameHeight: 64});
        scene.load.spritesheet(SCYTHE_GIRL.QVFX, `${this.scytheURL}Q-vfx.png`,{frameWidth:64, frameHeight: 64});
        scene.load.spritesheet(SCYTHE_GIRL.W, `${this.scytheURL}W.png`, {frameWidth:64, frameHeight: 64});
        scene.load.spritesheet(SCYTHE_GIRL.WVFX, `${this.scytheURL}W-vfx.png`, {frameWidth:64, frameHeight: 64})

        scene.load.audio(SCYTHE_GIRL.QSound, `${this.scytheURL}Q.wav`)
        scene.load.audio(SCYTHE_GIRL.WSound, `${this.scytheURL}W.wav`)
    }

    static loadMap(scene: Scene){
        scene.load.image(MAP.tilemap, `${this.mapURL}first-lv-tilemap.png`)
    }

    static loadGhost(scene: Scene){
        scene.load.spritesheet(GHOST.idle, `${this.ghostURL}ghost-idle.png`, {frameWidth:64, frameHeight: 64})
        scene.load.spritesheet(GHOST.getHit, `${this.ghostURL}ghost-get-hit.png`,  {frameWidth:64, frameHeight: 64})
        scene.load.spritesheet(GHOST.attack, `${this.ghostURL}ghost-attack.png`, {frameWidth:64, frameHeight: 64})
        scene.load.spritesheet(GHOST.attackVFX, `${this.ghostURL}ghost-attack-vfx.png`, {frameWidth: 64, frameHeight: 64})
        scene.load.audio(GHOST.getHit, `${this.generalSounds}get-hit2.wav`)
    }

    static loadRunes(scene:Scene){
        scene.load.spritesheet(GENERAL.runes, `${this.runes}runes.png`, {frameWidth:32, frameHeight:32})
    }
}