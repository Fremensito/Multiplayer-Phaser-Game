import { Display, GameObjects, Math, Scene, Textures } from "phaser";
import { Character } from "../objects/Character";
import { AbilitiesContainer } from "../UI/AbilitiesContainer";

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
    vec4 color = texture2D(uTexture, vec2(outTexCoord.x, 1.0 - outTexCoord.y));
    if(cooldown_time >= 0.0){
        vec4 cooldown_color = vec4(color.r*0.5, color.g*0.5, color.b*0.9, color.a);
        float angle = angleBetweenPoints(vec2(0.5,0.5), vec2(outTexCoord.x, outTexCoord.y));
        if(angle < cooldown_time){
            gl_FragColor = color;
        }
        else{
            gl_FragColor = cooldown_color;
        }
    }
    else
        gl_FragColor = color;
}
`
const PI = Math.PI2/2;

export class UI extends Scene{
    character: Character;
    abilitiesContainer: AbilitiesContainer;
    abilityWidth = 32;
    abilityHeight = 32;
    
    constructor (character: Character)
    {
        super({key: "UI", active: true});
        this.character = character;
    }

    preload(){
        this.load.setPath('assets');
        this.load.image("ability", "ui/hability.png"); 
        this.load.image("scythe ability", "ui/scythe_hability.png")
        this.load.image("W-slot", "ui/W-slot.png"); 
        this.load.image("W-icon", "ui/W-icon.png")
    }

    create(){
        this.cache.shader.add("ability shader", new Display.BaseShader("ability shader", shader, undefined, { cooldown_time: { type: "1f", value: -1.0 } }))

        this.abilitiesContainer = new AbilitiesContainer(
            this.abilityWidth * 4, 
            this.abilityHeight,
            new Math.Vector2(this.game.config.width as number /2, this.game.config.height as number - this.abilityHeight)
        )

        this.character.abilities.get("Q")!.addShaders(
            this.makeAbilityShader("ability"), 
            this.makeAbilityShader("scythe ability")
        )
        this.character.abilities.get("W")!.addShaders(
            this.makeAbilityShader("W-slot"), 
            this.makeAbilityShader("W-icon")
        )

        this.abilitiesContainer.addElements([
            this.character.abilities.get("Q")!.shaders,
            this.character.abilities.get("W")!.shaders
        ])
    }

    makeAbilityShader(texture: string):GameObjects.Shader{
        const shader = this.add.shader(
            "ability shader", 
            0, 
            0, 
            this.abilityWidth, 
            this.abilityHeight, 
            [texture],
        )

        this.textures.get(texture).setFilter(Textures.FilterMode.NEAREST);
        shader.scale = 2;
        return shader;
    }

    update(time:number, delta: number){
        this.character.abilities.forEach((a) => a.update(delta))
    }
}