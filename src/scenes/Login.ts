import { Scene } from "phaser";
import { NETManager } from "../managers/NETManager";

export class Login extends Scene{

    constructor(){
        super("Login");
    }

    preload(){
        this.load.html("login", "login.html")
    }

    create(){

        let html = this.add.dom(this.game.config.width as number /2,this.game.config.height as number/2 - 200).createFromCache("login");
        let button = html.getChildByID("registerB")!;

        html.getChildByID("registerB")?.addEventListener("click", (event)=>{
            NETManager.login(button);
        })
        // html.getChildByID("register")?.setAttribute("style", this.container)
        // html.getChildByID("newNickname")?.setAttribute("style", this.inputHTML)
        // html.getChildByID("email")?.setAttribute("style", this.inputHTML)

        // html.getChildByID("login")?.setAttribute("style", this.container)
        // html.getChildByID("nickname")?.setAttribute("style", this.inputHTML)
        // html.getChildByID("password")?.setAttribute("style", this.inputHTML)
    }
}