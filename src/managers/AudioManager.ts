
export class AudioManager{
    static SFX = new Map<string, Array<Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound>>();

    static addSounds(id:string, ...sounds: Array<Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound>){
        this.SFX.set(id, sounds);
    }

    static destroySFX(id:string){
        const audios =  this.SFX.get(id)!
        this.SFX.delete(id)
        audios.forEach(a => a.destroy())
    }
}