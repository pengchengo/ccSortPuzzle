import { AudioClip, AudioSource, resources } from "cc"


export class _AudioSystem {
    bgmSource:AudioSource
    soundSource:AudioSource
    curMusicId
    curMusicName
    curEffectMap: Map<number, string> = new Map<number, string>()

    init(bgmSource, soundSource)
    {
        this.bgmSource = bgmSource
        this.soundSource = soundSource
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
        this.bgmSource.pause()
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
                this.bgmSource.clip = clip
                this.curMusicId = this.bgmSource.play()
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
}

export const AudioSystem = new _AudioSystem();