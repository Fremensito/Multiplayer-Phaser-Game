import { Display, GameObjects, Math, Scene, Textures } from "phaser";
import { HorizontalContainer } from "../UI/HorizontalContainer";
import { NETManager } from "../managers/NETManager";
import { IAbility, UIShaders} from "../interfaces/Ability";
import { UIAbility } from "../UI/UIAbility";
import { AliveEntity } from "../objects/AliveEntity";
import { ICharacter } from "../interfaces/Character";
import { Profile } from "../UI/Profile";
import { UIRune } from "../UI/UIRune";
import { Misc } from "../UI/UIMisc";

const PI = Math.PI2/2;

export class UI extends Scene{
    static UIItemFocus = false
    character: AliveEntity;
    iCharacter: ICharacter;
    abilities = new Map<string, UIAbility>();
    abilitiesContainer: HorizontalContainer;
    miscs = new Map<string, Misc>();
    miscsDictionary = {
        runes: "runes",
        inventory: "inventory"
    }
    miscContainer: HorizontalContainer;
    abilityWidth = 32;
    abilityHeight = 32;
    miscWidth = 64;
    miscInContainerWidth = 36;
    text: GameObjects.Text;
    pingText: GameObjects.Text;
    actionText: GameObjects.Text;
    resources = {
        brightness: "brightness",
        ability: "ability-shader",
        qSlot: "Q-slot",
        qIcon: "Q-icon",
        wSlot: "W-slot",
        wIcon: "W-icon",
        profile: "profile",
        health: "health",
        runesSlot: "runes-slot",
        runesIcon: "runes-icon",
        inventoryIcon: "inventory-icon"
    }

    profile: Profile
    runeCard: UIRune
    
    constructor (abilities: Array<IAbility>, character:AliveEntity, iCharacter:ICharacter)
    {
        super({key: "UI", active: true});
        this.abilities.set("Q", new UIAbility(abilities[0]))
        this.abilities.set("W", new UIAbility(abilities[1]))
        this.miscs.set(this.miscsDictionary.inventory, new Misc())
        this.miscs.set(this.miscsDictionary.runes, new Misc())
        this.character = character
        this.iCharacter = iCharacter
    }

    preload(){
        this.load.setPath('assets');
        this.load.image(this.resources.qSlot, this.abilities.get("Q")!.UI.slotResource); 
        this.load.image(this.resources.qIcon, this.abilities.get("Q")!.UI.iconResource);
        this.load.image(this.resources.wSlot, this.abilities.get("W")!.UI.slotResource); 
        this.load.image(this.resources.wIcon, this.abilities.get("W")!.UI.iconResource);

        this.load.image(this.resources.profile, this.iCharacter.profile)
        this.load.spritesheet(this.resources.health, "/ui/health.png", {frameWidth:62, frameHeight:5})

        this.load.image(this.resources.runesIcon, "ui/runes.png")
        this.load.image(this.resources.inventoryIcon, "ui/inventory.png")
        this.load.image(this.resources.runesSlot, "ui/runes-slot.png")

        this.load.glsl("cooldown", "shaders/cooldown.glsl", "fragment")
        this.load.glsl("slotshine", "shaders/slotshine.glsl", "fragment")
    }

    create(){
        console.log(this.cache.shader.get("slotshine"))
        // this.add.existing(new GameObjects.Image(this, 200, 200, this.resources.runesSlot))
        this.text = new GameObjects.Text(this, 850, 20, "0", { fontFamily: 'InTheDarkness' });
        this.add.existing(this.text);

        this.pingText = new GameObjects.Text(this, 850, 40, NETManager.ping.toString(), { fontFamily: 'InTheDarkness' })
        this.add.existing(this.pingText)

        this.actionText = new GameObjects.Text(this, 850, 60, NETManager.action, { fontFamily: 'InTheDarkness' })
        this.add.existing(this.actionText)

        this.addAbilities();

        this.addMiscs();

        this.profile = new Profile(this,0,0, this.resources.profile, this.resources.health, this.character.health)
        //this.runeCard = new UIRune(this.scene.scene, 300, 300, GENERAL.runeInfo)
    }

    addAbilities(){
        this.cache.shader.add(this.resources.ability, new Display.BaseShader(this.resources.ability, this.cache.shader.get("cooldown").fragmentSrc, undefined, { cooldown_time: { type: "1f", value: -1.0 } }))

        this.abilitiesContainer = new HorizontalContainer(
            this.abilityWidth * 4, 
            this.abilityHeight,
            new Math.Vector2(this.game.config.width as number /2, this.game.config.height as number - this.abilityHeight)
        )
        this.abilities.get("Q")!.addShaders(
            this.makeShader(this.resources.qSlot, this.resources.ability, this.abilityWidth, this.abilityHeight), 
            this.makeShader(this.resources.qIcon, this.resources.ability, this.abilityWidth, this.abilityHeight)
        )
        this.abilities.get("W")!.addShaders(
            this.makeShader(this.resources.wSlot, this.resources.ability, this.abilityWidth, this.abilityHeight), 
            this.makeShader(this.resources.wIcon, this.resources.ability, this.abilityWidth, this.abilityHeight)
        )

        const shaders = new Array<UIShaders>()
        this.abilities.forEach(a => shaders.push(a.shaders))

        this.abilitiesContainer.addElements(shaders)
    }

    addMiscs(){
        this.cache.shader.add(this.resources.brightness, new Display.BaseShader(this.resources.brightness, this.cache.shader.get("slotshine").fragmentSrc, undefined, { brightness: { type: "1f", value: 1.0 } }))

        this.miscContainer = new HorizontalContainer(
            this.miscInContainerWidth * 4,
            this.miscInContainerWidth,
            new Math.Vector2((this.game.config.width as number) - (this.game.config.width as number)/4,
            this.game.config.height as number - this.miscInContainerWidth
            )
        )
                
        this.miscs.get(this.miscsDictionary.inventory)!.setAssets(this.scene.scene, 
            this.makeShader(this.resources.runesSlot, this.resources.brightness, this.miscWidth, this.miscWidth), 
            this.resources.runesIcon)
        this.miscs.get(this.miscsDictionary.runes)!.setAssets(this.scene.scene, 
            this.makeShader(this.resources.runesSlot, this.resources.brightness, this.miscWidth, this.miscWidth), 
            this.resources.inventoryIcon)
        const miscs = new Array<Misc>()
        this.miscs.forEach(m => miscs.push(m))
        this.miscContainer.addElements(miscs)
    }

    makeShader(texture: string, shaderKey:string, width:number, height:number,):GameObjects.Shader{
        const shader = this.add.shader(
            shaderKey, 
            0, 
            0, 
            width, 
            height, 
            [texture]
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