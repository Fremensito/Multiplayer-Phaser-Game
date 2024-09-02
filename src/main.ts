import { Game as MainGame } from './scenes/Game';
import { Game, Scale,Types } from 'phaser';
import { Login } from './scenes/Login';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    dom: {
        createContainer: true
    },
    physics: {
        default: "matter",
        matter:{
            runner:{
                isFixed: true
            },
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
        //Login
    ],
    pixelArt: true,
    //backgroundColor: 0x05358e,
    transparent:true
};

export default new Game(config);
