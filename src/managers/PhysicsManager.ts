// import { Scene } from "phaser";
// import { Game } from "../scenes/Game";

// export class PhysicsManager{
//     static scene:Game
//     static loopTime = 60
//     static startPhysics(scene: Game){
//         this.scene = scene
//         scene.time.addEvent({
//             delay: 60,
//             callback: this.update,
//             callbackScope: this,
//             loop: true
//         })
//     }

//     private static update(){
//         this.scene.character.rectangle.x = this.scene.character.x
//         this.scene.character.rectangle.y = this.scene.character.y
//     }
// }