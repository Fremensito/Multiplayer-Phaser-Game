import { Game, Renderer } from "phaser";

export class SlotShine extends Renderer.WebGL.Pipelines.PostFXPipeline{
    static shader:string
    brightness = 1

    constructor(game: Game){
        super({
            game, fragShader: SlotShine.shader
        })
    }
    
    onPreRender():void{
        this.set1f("brightness", this.brightness)
    }
}