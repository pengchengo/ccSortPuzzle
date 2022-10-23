import { AudioClip, AudioSource, resources } from "cc"
import { PlayerData } from "./PlayerData"


export class _AudioSystem {
    musicSource:AudioSource
    soundSource:AudioSource
    curMusicId
    curMusicName
    curEffectMap: Map<number, string> = new Map<number, string>()

    init(musicSource, soundSource)
    {
        this.musicSource = musicSource
        this.musicSource.volume = PlayerData.data.musicVolume
        this.soundSource = soundSource
        this.soundSource.volume = PlayerData.data.soundVolume
    }

    playMusic(res: string, loop = true){
        if (this.curMusicName == res) return
        /*if (PlayerData.data.isCloseMusic) {
            return
        }*/
        this.playAudio(res, loop, true)
    }

    stopMusic(){
        this.curMusicName = null
        this.musicSource.pause()
    }

    playSound(res: string, loop = false, callback: (audioId: number) => void = null){
        /*if (this.muted) return
        if (PlayerData.data.isCloseSound) {
            return
        }*/
        this.playAudio(res, loop, false,callback)
    }

    stopSound(){
        
    }

    playAudio(res: string, loop: boolean,
        isMusic: boolean, playCallback: (audioId: number) => void = null) {
        const url = "sound/" + res
        const clip = resources.get(url, AudioClip) as AudioClip
        const playFn = (clip: AudioClip) => {
            if (isMusic) {
                this.musicSource.clip = clip
                this.curMusicId = this.musicSource.play()
                this.curMusicName = res
            } else {
                this.soundSource.playOneShot(clip)
            }
        }
        if (!clip) {
            resources.load(url, AudioClip, (err, audio: AudioClip) => {
                if (!err) {
                    playFn(audio)
                }else{
                    console.warn("加载音效资源失败error:"+err)
                }
            })
        } else {
            playFn(clip)
        }
    }

    updateVolume(){
        if(PlayerData.data.musicVolume != this.musicSource.volume){
            PlayerData.data.musicVolume = this.musicSource.volume
        }
        if(PlayerData.data.soundVolume != this.soundSource.volume){
            PlayerData.data.soundVolume = this.soundSource.volume
        }
        PlayerData.saveData()
    }
}

export const AudioSystem = new _AudioSystem();