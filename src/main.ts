import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Scale,Types } from 'phaser';
import { UI } from './scenes/UI';
import { Plugin } from 'matter';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    physics: {
        default: "matter",
        matter:{
            runner:{
                isFixed: true
            },
            debug: true,
            //debug: true,
            gravity: {x:0, y:0},
        }
    },
    fps: {
        target: 60
    },
    parent: 'game-container',
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
