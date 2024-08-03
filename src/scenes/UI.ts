import { Display, GameObjects, Math, Scene, Textures } from "phaser";

const shader = `
precision mediump float;

varying vec2 outTexCoord;
uniform sampler2D uTexture;
uniform float testing;
uniform float cooldown_time;

float angleBetweenPoints(vec2 p1, vec2 p2) {

    vec2 v1 = p2 - p1;
    vec2 v2 = normalize(v1); // Normalize the vector
    float dotProduct = dot(v2, vec2(0.0, 1.0)); // Dot product with the y-axis
    float angle = acos(dotProduct);
    if(p2.x >= 0.5){
        return angle;
    }
    else{
        return 3.14 * 2.0 - angle;
    }
}

void main() {
    if(cooldown_time >= 0.0){
        vec4 color = texture2D(uTexture, vec2(outTexCoord.x, 1.0 - outTexCoord.y));
        vec4 cooldown_color = vec4(color.r*0.5, color.g*0.5, color.b*0.9, color.a);
        float angle = angleBetweenPoints(vec2(0.5,0.5), vec2(outTexCoord.x, outTexCoord.y));
        if(angle < cooldown_time){
            gl_FragColor = color;
        }
        else{
            gl_FragColor = cooldown_color;
        }
    }
}
`
const PI = Math.PI2/2;

export class UI extends Scene{

    abilityWidth: number;
    abilityHeight: number;
    shader_1: GameObjects.Shader
    shader_2: GameObjects.Shader
    testShader: Display.BaseShader
    cooldown = 4000;
    cooldown_time = 0;
    
    constructor ()
    {
        super({key: "UI", active: true});
        this.abilityWidth = this.abilityHeight = 32;
    }

    preload(){
        this.load.setPath('assets');
        this.load.image("hability", "ui/hability.png"); 
        this.load.image("scythe hability", "ui/scythe_hability.png")
    }

    create(){
        this.testShader = new Display.BaseShader("XD", shader, undefined, {cooldown_time: {type: "1f", value: 0}});
        this.shader_1 = this.add.shader(
            this.testShader, 
            this.game.config.width as number/2 - this.abilityWidth*2, 
            this.game.config.height as number - this.abilityHeight, 
            this.abilityWidth, 
            this.abilityHeight, 
            ["hability"],
        )

        console.log(this.shader_1)

        this.textures.get("hability").setFilter(Textures.FilterMode.NEAREST);

        this.shader_1.scale = 2;

        this.shader_2 = this.add.shader(
            this.testShader, 
            this.game.config.width as number/2 - this.abilityWidth*2, 
            this.game.config.height as number - this.abilityHeight, 
            this.abilityWidth, 
            this.abilityHeight, 
            ["scythe hability"] 
        )

        this.textures.get("scythe hability").setFilter(Textures.FilterMode.NEAREST);

        this.shader_2.scale = 2;

        this.shader_1.setUniform("cooldown_time.value", 6.2)
        this.shader_2.setUniform("cooldown_time.value", 6.2)
    }

    update(time:number, delta: number){
        if(this.cooldown_time >= 0){
            this.cooldown_time += delta;
            this.shader_1.setUniform("cooldown_time.value", (this.cooldown_time/this.cooldown)*2*PI)
            this.shader_2.setUniform("cooldown_time.value", (this.cooldown_time/this.cooldown)*2*PI)
            if(this.cooldown_time/this.cooldown*2*PI > PI*2){
                console.log("delta:" + delta)
                console.log(this.cooldown_time);
                this.cooldown_time = -1;
            }
        }
    }
}