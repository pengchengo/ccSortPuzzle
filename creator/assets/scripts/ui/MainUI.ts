import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Label, AudioSource } from 'cc';
import { AudioSystem } from '../system/AudioSystem';
import { PlayerData } from '../system/PlayerData';
import { UISystem } from '../system/UISystem';
import { LevelUI } from './LevelUI';
const { ccclass, property, menu} = _decorator;

@ccclass
@menu("界面/MainUI")
export class MainUI extends Component {
    static Inst = null

    @property({ type: Label })
    public levelLb: Label;

    @property({ type: AudioSource })
    public bgmSource: AudioSource;

    @property({ type: AudioSource })
    public soundSource: AudioSource;

    start() {
        MainUI.Inst = this
        this.refreshLevel()
        AudioSystem.init(this.bgmSource, this.soundSource)
        AudioSystem.playMusic("game")
    }

    onEnable(){

    }

    onDisable(){

    }

    onClickLevel(){
        LevelUI.show()
    }

    refreshLevel(){
        this.levelLb.string = "Level "+PlayerData.data.curLevel
    }

    update(deltaTime: number) {
        
    }
}

