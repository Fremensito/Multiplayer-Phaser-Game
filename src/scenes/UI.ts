import { GameObjects, Math, Renderer, Scene} from "phaser";
import { HorizontalContainer } from "../UI/HorizontalContainer";
import { NETManager } from "../managers/NETManager";
import { IAbility} from "../interfaces/Ability";
import { UIAbility } from "../UI/UIAbility";
import { AliveEntity } from "../objects/AliveEntity";
import { ICharacter } from "../interfaces/Character";
import { Profile } from "../UI/profile/Profile";
import { UIRune } from "../UI/inventory/runes/UIRune";
import { Misc } from "../UI/UIMisc";
import { SlotShine } from "../pipelines/SlotShine";
import { Cooldown } from "../pipelines/Cooldown";
import { TestPipline } from "../pipelines/TestPipeline";
import { UI as UIAssets } from "../utils/AssetsGlobals";
import { AssetsLoader } from "../utils/AssetsLoader";
import { Inventory } from "../UI/inventory/Inventory";

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
    slotShine:SlotShine
    abilityWidth = 32;
    abilityHeight = 32;
    miscInContainerWidth = 36;
    text: GameObjects.Text;
    pingText: GameObjects.Text;
    actionText: GameObjects.Text;

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
        
        AssetsLoader.loadUIElements(this, this.abilities, this.iCharacter)
        AssetsLoader.loadUIShaders(this)
        AssetsLoader.loadRunes(this)
        // this.load.glsl("testPipe", "shaders/test.fx", "fragment")
    }

    create(){
        // console.log(this.cache.shader.get("slotshine"))
        // this.add.existing(new GameObjects.Image(this, 200, 200, UIAssets.runesSlot))
        // this.game.domContainer.style.pointerEvents = "none";
        this.text = new GameObjects.Text(this, 850, 20, "0", { fontFamily: 'InTheDarkness' });
        this.add.existing(this.text);

        this.pingText = new GameObjects.Text(this, 850, 40, NETManager.ping.toString(), { fontFamily: 'InTheDarkness' })
        this.add.existing(this.pingText)

        this.actionText = new GameObjects.Text(this, 850, 60, NETManager.action, { fontFamily: 'InTheDarkness' })
        this.add.existing(this.actionText)

        Cooldown.shader = this.cache.shader.get(UIAssets.ability).fragmentSrc;
        (this.renderer as Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline("testing2", Cooldown)

        SlotShine.shader = this.cache.shader.get(UIAssets.brightness).fragmentSrc;
        (this.renderer as Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline("testing", SlotShine);

        // TestPipline.shader = this.cache.shader.get("testPipe").fragmentSrc;
        // (this.renderer as Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline("testPipe", TestPipline);

        this.addAbilities()
        this.addMiscs()
        this.add.existing(new Inventory(this, [{
            id:0,
            inventoryRow:0,
            inventoryColumn: 0,
            name: "test",
            description: "test"
        }]))
        // this.test()

        this.profile = new Profile(this,0,0, UIAssets.profile, UIAssets.health, this.character.health)

        //this.runeCard = new UIRune(this, 300, 300, GENERAL.runeInfo)
    }

    addAbilities(){
        this.abilitiesContainer = new HorizontalContainer(
            this.abilityWidth * 4, 
            this.abilityHeight,
            ({x:this.game.config.width as number /2, y:this.game.config.height as number - this.abilityHeight})
        )
        this.abilities.get("Q")!.addShaders(this, UIAssets.qSlot, UIAssets.qIcon)
        this.abilities.get("W")!.addShaders(this, UIAssets.wSlot, UIAssets.wIcon)

        const abilities = new Array<UIAbility>()
        this.abilities.forEach(a => abilities.push(a))

        this.abilitiesContainer.addElements(abilities)
    }

    addMiscs(){
        // this.cache.shader.add(UIAssets.brightness, new Display.BaseShader(UIAssets.brightness, this.cache.shader.get("slotshine").fragmentSrc, undefined, { brightness: { type: "1f", value: 1.0 } }))

        this.miscContainer = new HorizontalContainer(
            this.miscInContainerWidth * 4,
            this.miscInContainerWidth,
            {
                x:(this.game.config.width as number) - (this.game.config.width as number)/4,
                y:this.game.config.height as number - this.miscInContainerWidth
            }
        )
                
        this.miscs.get(this.miscsDictionary.inventory)!.setAssets(this, 
            UIAssets.runesSlot, 
            UIAssets.runesIcon)
        this.miscs.get(this.miscsDictionary.runes)!.setAssets(this, 
            UIAssets.runesSlot, 
            UIAssets.inventoryIcon)
        const miscs = new Array<Misc>()
        this.miscs.forEach(m => miscs.push(m))
        this.miscContainer.addElements(miscs)
    }

    test(){
        const container = new GameObjects.Container(this, 200, 200)
        container.add(new GameObjects.Image(this, 0,0, UIAssets.runesSlot))
        container.setPostPipeline(TestPipline)
        this.add.existing(container)
    }

    update(time:number, delta: number){
        this.text.setText("FPS:" + (Math.RoundTo(1000/delta)).toString())
        this.pingText.setText("PING: " + Math.RoundTo(NETManager.ping).toString())
        this.actionText.setText("ACTION: " + NETManager.action)
        this.character.abilities!.forEach((a, k) => this.abilities.get(k)!.update(a.available, a.cooldown, a.cooldowntime))
        this.profile.health.update(delta, this.character.health)
    }
}