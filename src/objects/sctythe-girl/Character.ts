import {Scene, Math, Animations, Physics} from "phaser";
import { ICharacter } from "../../interfaces/Character";
import { SpriteParticle } from "../../classes/SpriteParticle";
import { AliveEntity } from "../AliveEntity";
import { WorldManager } from "../../managers/WorldManager";
import { QAbility } from "../../classes/combat/scythe-girl/QAbility";
import { WAbility } from "../../classes/combat/scythe-girl/WAbility";
import { CombatAbility } from "../../classes/combat/CombatAbility";
import { NETManager } from "../../managers/NETManager";

export class Character extends AliveEntity{
    speed:number;
    idle: boolean;
    attacking: boolean;
    direction:Math.Vector2;
    pointToMove: Math.Vector2;
    PI = Math.PI2/2;
    created = false

    abilities?: Map<string, CombatAbility>;
    QAbility: QAbility;
    WAbility: WAbility;
    attack_animations = ["basic front attack", "basic right attack", "basic left attack", "basic back attack"]
    //TO DO: ADD TEXTURES ANIMATIONS DEPENDING OF THE CHARACTAR CLASS NAME
    char_class: string;
    character:ICharacter
    delta:number
    name = "character"
    static animationsGenerated = false;
    //rectangle: GameObjects.Rectangle

    WSound;
    QSound;

    constructor(scene: Scene, data:ICharacter){
        super(scene.matter.world, data.x, data.y, "player", 0, {
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            label: "character"
        });
        this.speed = data.speed;
        this.idle = true;
        this.attacking = false;
        scene.add.existing(this)
        this.id = data.id;
        //this.scene.matter.world.add(this.body?.gameObject)

        this.pointToMove = new Math.Vector2(0,0)
        this.direction = new Math.Vector2(0,0)

        this.character = data;
        
        if(!Character.animationsGenerated){
            this.generateAnimations("walk front", "player", 0, 5, 8);
            this.generateAnimations("walk right",  "player", 6, 11, 8);
            this.generateAnimations("walk left",  "player", 12, 17, 8);
            this.generateAnimations("walk back",  "player", 18, 23, 8);

            this.generateAnimations("idle front", "player idle", 0, 1, 2);
            this.generateAnimations("idle right", "player idle", 2, 3, 2);
            this.generateAnimations("idle left", "player idle", 4 ,5 ,2);
            this.generateAnimations("idle back", "player idle", 6, 7, 2);

            this.generateAnimations(this.attack_animations[0], "player basic attack", 0, 4, data.abilities[0].speed);
            this.generateAnimations(this.attack_animations[1], "player basic attack", 5, 9, data.abilities[0].speed);
            this.generateAnimations(this.attack_animations[2], "player basic attack", 10, 14, data.abilities[0].speed);
            this.generateAnimations(this.attack_animations[3], "player basic attack", 15, 19, data.abilities[0].speed);

            this.generateAnimations("W", "player w", 0, 4, data.abilities[1].speed)
            Character.animationsGenerated = true
        }

        //QAbility.createRight(this);
        this.abilities = new Map<string, CombatAbility>();
        this.abilities.set("Q", new QAbility(data.abilities[0], scene, this));
        this.QAbility = this.abilities.get("Q") as QAbility;
        this.abilities.set("W", new WAbility(data.abilities[1], scene, this));
        this.WAbility = this.abilities.get("W") as WAbility;
        
        this.WSound = scene.sound.add("WScythe");
        this.WSound.volume = 0.5
        this.QSound = scene.sound.add("QScythe")
        this.QSound.volume = 0.5

        this.on(Animations.Events.ANIMATION_UPDATE, (a:Animations.Animation, f:Animations.AnimationFrame)=>{
            if(this.anims.getName() == "W"){
                switch(f.index){
                    case 2: new SpriteParticle(scene, this.x, this.y, "particle" + f.index, "W-particles", 0, 1, 
                        8
                    ); break;

                    case 3: new SpriteParticle(scene, this.x, this.y, "particle" + f.index, "W-particles", 2, 3, 
                        8
                    ); break;

                    case 4: new SpriteParticle(scene, this.x, this.y, "particle" + f.index, "W-particles", 4, 5, 
                        8
                    ); break;

                    case 5: new SpriteParticle(scene, this.x, this.y, "particle" + f.index, "W-particles", 6, 7, 
                        8
                    ); break;
                }
            }
        })

        this.setBody({width:10, height:20}, {label: "character"})
        this.setSensor(true)
        this.setCollisionGroup(WorldManager.collideGroups.objects)

        this.scene.matter.world.on("collisionstart", (event:any)=>{
            for(let i = 0; i < event.pairs.length; i++){
                let pair = event.pairs[i]
                this.chooseCharacter(pair)
            }
        })

        this.scene.matter.world.on("collisionactive", (event:any)=>{
            for(let i = 0; i < event.pairs.length; i++){
                let pair = event.pairs[i]
                this.chooseCharacter(pair)
            }
        })
    }

    chooseCharacter(pair: any){
        if(pair.bodyA.label == "character" && pair.bodyA.gameObject.id == NETManager.room.sessionId
            && pair.bodyB.label != "character"
        ){
            let character = pair.bodyA.gameObject as Character;
            let collidedObject = pair.bodyB.gameObject as Physics.Matter.Sprite;
            this.reactToCollision(character, collidedObject);
        }
        else if(pair.bodyB.label == "character" && pair.bodyB.gameObject.id == NETManager.room.sessionId
            && pair.bodyA.label != "character"
        ){
            let character = pair.bodyB.gameObject as Character;
            let collidedObject = pair.bodyA.gameObject as Physics.Matter.Sprite;
            this.reactToCollision(character, collidedObject);
        }
    }

    reactToCollision(character:Character, collidedObject:Physics.Matter.Sprite){
        console.log(character.id, NETManager.room.sessionId)
        if(this.id == NETManager.room.sessionId){
            console.log("collided")
            let new_direction = (new Math.Vector2(character.x-collidedObject.x, character.y - collidedObject.y)).normalize();
            this.x += new_direction.x * this.speed
            this.y += new_direction.y * this.speed
        }
    }

    update(delta:number){
        this.depth = this.y
        this.updateDirection();
        if(!this.idle && !this.attacking){
            this.setVelocityX(this.direction.x * this.speed);
            this.setVelocityY(this.direction.y * this.speed);
            // this.speed = 40;
            // this.x += this.speed*this.direction.x*delta/1000
            // this.y += this.speed*this.direction.y*delta/1000
        }
        else if(this.attacking){
            switch(this.anims.getName()){
                case "W": 
                    if(!this.anims.isPlaying){
                        this.idle = true;
                        this.attacking = false;
                    }
                    break;
                case this.attack_animations[0]:
                case this.attack_animations[1]:
                case this.attack_animations[2]:
                case this.attack_animations[3]: this.setVelocity(0,0); break;
            }
        }
        else{
            this.setVelocity(0,0)
        }
        if(this.checkPositionGoal()){
            this.idle = true;
            this.setVelocity(0,0);
        }
        if(!this.attacking)
            this.updateMovement()
        else if(!this.anims.isPlaying)
            this.attacking = false;

        this.QAbility.updateQ(this, delta);
        this.WAbility.updateW(delta);
        // console.log("speed: " + this.speed)
        //console.log(this.x, this.y)
        //console.log(this.scene.anims.get("W").duration, 1/12*5*1000)
        // console.log(this.direction)
        //NETManager.sendState(this.idle, this.direction)
    }

    updateMovement(){
        if(!this.idle)
            this.updateBasicAnimation(["walk front", "walk left", "walk back", "walk right"], -1, 1);
        else
            this.updateBasicAnimation(["idle front", "idle left", "idle back", "idle right"], -1, 1)
    }

    changeDirectionAttack(vector: Math.Vector2): void {
        super.changeDirectionAttack(vector)
        this.QSound.play();
    }

    WAction(vector:Math.Vector2){
        this.changeDirectionInput(vector);
        // this.speed = 3*this.speed;
        const velocity = this.direction.multiply(new Math.Vector2(3*this.speed, 3*this.speed));
        this.setVelocity(velocity.x, velocity.y)
        this.WSound.play()
    }

    destroyAbilities(){
        this.abilities!.forEach(a => a.destroy());
        delete this.abilities;
    }
}