import { Game, Renderer } from "phaser";

export class TestPipline extends Renderer.WebGL.Pipelines.PostFXPipeline{
    static shader:string

    constructor(game: Game){
        super({
            game, fragShader: TestPipline.shader
        })
    }
    
    onPreRender():void{
        // this.set1f("brightness", this.brightness)
    }
}