import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Label, Slider } from 'cc';
import List from '../list/List';
import { AudioSystem } from '../system/AudioSystem';
import { GameSystem } from '../system/GameSystem';
import { PlayerData } from '../system/PlayerData';
import { UISystem } from '../system/UISystem';
import { UtilsSystem } from '../system/UtilsSystem';
import { BaseUI } from './BaseUI';
const { ccclass, menu, property } = _decorator;

@ccclass
@menu("界面/SettingUI")
export class SettingUI extends BaseUI {
    static uiName = "SettingUI"

    @property(Slider)
    musicSlider: Slider = null;

    @property(Slider)
    soundSlider: Slider = null;

    start() {
        this.musicSlider.progress = AudioSystem.musicSource.volume
        this.soundSlider.progress = AudioSystem.soundSource.volume
    }

    onClickBack(){
        this.hide()
        AudioSystem.updateVolume()
    }

    onMusicVolume(slider: Slider, customEventData: string) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        // 这里的 customEventData 参数就等于之前设置的 'foobar'
        console.log("music progress=", slider.progress)
        AudioSystem.musicSource.volume = slider.progress
    }

    onSoundVolume(slider: Slider, customEventData: string) {
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        // 这里的 customEventData 参数就等于之前设置的 'foobar'
        console.log("sound progress=", slider.progress)
        AudioSystem.soundSource.volume = slider.progress
    }
}
