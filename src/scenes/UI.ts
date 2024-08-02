import { Scene } from "phaser";

export class UI extends Scene{

    abilityWidth: number;
    abilityHeight: number;
    
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
        for(let i = 0; i < 4; i++){
            const hability = this.add.image(
                this.game.config.width as number/2 - this.abilityWidth*2, 
                this.game.config.height as number - this.abilityHeight,
                "hability")
            hability.scale = 2;
        }

        this.add.image(
            this.game.config.width as number/2 - this.abilityWidth * 2, 
            this.game.config.height as number - this.abilityHeight,
            "scythe hability").scale  = 2;
        
    }
}