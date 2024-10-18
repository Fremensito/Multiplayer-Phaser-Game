import { Game, Renderer } from "phaser";

export class Cooldown extends Renderer.WebGL.Pipelines.PostFXPipeline{
    static shader: string
    cooldownTime = -1.0
    textureX = 0.0
    textureY = 0.0

    constructor (game:Game){
        super({game, fragShader:Cooldown.shader})
    }

    onPreRender():void{
        this.set1f("textureX", this.textureX)
        this.set1f("textureY", this.textureY)
        this.set1f("cooldown_time", this.cooldownTime)
    }
}
