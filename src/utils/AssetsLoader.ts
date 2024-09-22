import { Scene } from "phaser";
import { GENERAL, GHOST, MAP, SCYTHE_GIRL } from "./AssetsGlobals";

export class AssetsLoader{
    private static scytheURL = "classes/scythe-girl/"
    private static mapURL = "map/"
    private static ghostURL = "enemies/ghost/"
    private static generalSounds = "sounds/"

    static loadGeneral(scene: Scene){
        scene.load.audio(GENERAL.getHit, `${this.generalSounds}get-hit2.wav`)
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
}