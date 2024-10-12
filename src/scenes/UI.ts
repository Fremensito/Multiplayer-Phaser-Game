import { Display, GameObjects, Math, Scene, Textures } from "phaser";
import { AbilitiesContainer } from "../UI/AbilitiesContainer";
import { NETManager } from "../managers/NETManager";
import { IAbility, UIShaders} from "../interfaces/Ability";
import { UIAbility } from "../UI/UIAbility";
import { AliveEntity } from "../objects/AliveEntity";
import { ICharacter } from "../interfaces/Character";
import { Profile } from "../UI/Profile";

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

    character: AliveEntity;
    iCharacter: ICharacter
    abilities = new Map<string, UIAbility>();
    abilitiesContainer: AbilitiesContainer;
    abilityWidth = 32;
    abilityHeight = 32;
    text: GameObjects.Text;
    pingText: GameObjects.Text;
    actionText: GameObjects.Text;
    resources = {
        qSlot: "/Q-slot",
        qIcon: "Q-icon",
        wSlot: "W-slot",
        wIcon: "W-icon",
        profile: "profile",
        health: "health"
    }

    profile: Profile
    
    constructor (abilities: Array<IAbility>, character:AliveEntity, iCharacter:ICharacter)
    {
        super({key: "UI", active: true});
        this.abilities.set("Q", new UIAbility(abilities[0]))
        this.abilities.set("W", new UIAbility(abilities[1]));
        this.character = character;
        this.iCharacter = iCharacter
    }

    preload(){
        this.load.setPath('/assets');
        this.load.image(this.resources.qSlot, this.abilities.get("Q")!.UI.slotResource); 
        this.load.image(this.resources.qIcon, this.abilities.get("Q")!.UI.iconResource);
        this.load.image(this.resources.wSlot, this.abilities.get("W")!.UI.slotResource); 
        this.load.image(this.resources.wIcon, this.abilities.get("W")!.UI.iconResource);
        this.load.image(this.resources.profile, this.iCharacter.profile)
        this.load.spritesheet(this.resources.health, "/ui/health.png", {frameWidth:62, frameHeight:5})
    }

    create(){
        this.text = new GameObjects.Text(this, 20, 20, "0", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        this.text.setSize(5,5);
        this.add.existing(this.text);

        this.pingText = new GameObjects.Text(this, 20, 40, NETManager.ping.toString(), { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
        this.pingText.setSize(5,5)
        this.add.existing(this.pingText)

        this.actionText = new GameObjects.Text(this, 20, 60, NETManager.action, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
        this.actionText.setSize(5,5)
        this.add.existing(this.actionText)

        this.cache.shader.add("ability shader", new Display.BaseShader("ability shader", shader, undefined, { cooldown_time: { type: "1f", value: -1.0 } }))

        this.abilitiesContainer = new AbilitiesContainer(
            this.abilityWidth * 4, 
            this.abilityHeight,
            new Math.Vector2(this.game.config.width as number /2, this.game.config.height as number - this.abilityHeight)
        )

        this.abilities.get("Q")!.addShaders(
            this.makeAbilityShader(this.resources.qSlot), 
            this.makeAbilityShader(this.resources.qIcon)
        )
        this.abilities.get("W")!.addShaders(
            this.makeAbilityShader(this.resources.wSlot), 
            this.makeAbilityShader(this.resources.wIcon)
        )

        const shaders = new Array<UIShaders>
        this.abilities.forEach(a => shaders.push(a.shaders))

        this.abilitiesContainer.addElements(shaders)

        this.profile = new Profile(this,0,0, this.resources.profile, this.resources.health, this.character.health)
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
        this.text.setText("FPS:" + (Math.RoundTo(1000/delta)).toString())
        this.pingText.setText("PING: " + Math.RoundTo(NETManager.ping).toString())
        this.actionText.setText("ACTION: " + NETManager.action)
        this.character.abilities!.forEach((a, k) => this.abilities.get(k)!.update(a.available, a.cooldown, a.cooldowntime))
        this.profile.health.update(delta, this.character.health)
    }
}