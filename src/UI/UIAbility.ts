import { GameObjects, Scene} from "phaser";
import { IAbility, IUIAbility} from "../interfaces/Ability";
import { PI } from "../utils/GameUtils";
import { Cooldown } from "../pipelines/Cooldown";

export class UIAbility{

    UI: IUIAbility;
    icon: GameObjects.Image;
    slot: GameObjects.Image

    constructor(ability: IAbility){
        this.UI = ability.UI;
    }

    addShaders(scene:Scene, slot: string, icon: string){
        this.slot = new GameObjects.Image(scene, 0,0,slot)
        this.icon = new GameObjects.Image(scene, 0,0,icon)

        this.slot.setPostPipeline(Cooldown)
        this.icon.setPostPipeline(Cooldown)

        this.slot.scale = 2;
        this.icon.scale = 2;

        scene.add.existing(this.slot)
        scene.add.existing(this.icon)
    }

    update(available: boolean, cooldown: number, cooldowntime:number){
        const iconPipeline = (this.icon.getPostPipeline(Cooldown) as Cooldown);
        const slotPipeline = (this.slot.getPostPipeline(Cooldown) as Cooldown);

        iconPipeline.cooldownTime = (cooldowntime/cooldown)*2*PI;
        slotPipeline.cooldownTime = (cooldowntime/cooldown)*2*PI;

        iconPipeline.textureX = this.icon.x / (this.icon.scene.game.config.width as number);
        slotPipeline.textureX = this.slot.x / (this.slot.scene.game.config.width as number);

        iconPipeline.textureY = this.icon.y / (this.icon.scene.game.config.height as number);
        slotPipeline.textureY = this.slot.y / (this.slot.scene.game.config.height as number);
    }
}