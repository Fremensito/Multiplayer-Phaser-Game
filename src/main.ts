import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Scale,Types } from 'phaser';
import { UI } from './scenes/UI';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    fps: {
        target: 60,
        limit: 60,
        min: 30
    },
    parent: 'game-container',
    physics: {
        default: "arcade",
        /*arcade: {
            debug: true
        }*/
    },
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        autoRound: true
    },
    scene: [
        MainGame
    ],
    pixelArt: true,
};

export default new Game(config);
