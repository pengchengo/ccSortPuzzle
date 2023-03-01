import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Button, sys } from 'cc';
import { GameSystem } from '../system/GameSystem';
import { PlatformSystem } from '../system/PlatformSystem';
import { PlayerData } from '../system/PlayerData';
import { UISystem } from '../system/UISystem';
import { BaseUI } from './BaseUI';
const { ccclass, menu, property} = _decorator;

@ccclass
@menu("界面/ResultUI")
export class ResultUI extends BaseUI {
    static uiName = "ResultUI"

    @property({ type: Node })
    public btnNext: Node;

    @property({ type: Node })
    public btnShare: Node;

    start() {

    }

    update(deltaTime: number) {
        
    }

    onEnable(){
        PlatformSystem.stopRecorder()
        if(PlayerData.data.curLevel >= GameSystem.maxLevel){
            this.btnNext.active = false
        }else{
            this.btnNext.active = true
        }
        if(PlayerData.data.curLevel <= 2){
            this.btnShare.active = false
        }else{
            this.btnShare.active = true
        }
        if((PlayerData.data.curLevel + 1) > PlayerData.data.maxLevel){
            PlayerData.data.maxLevel = PlayerData.data.curLevel + 1
            PlayerData.saveData()
        }
    }

    onClickNext(){
        PlayerData.changeCurLevel(PlayerData.data.curLevel+1)
        this.hide()
        sys.localStorage.setItem("STORAGE_ADD_GLASS_KEY", undefined);
        GameSystem.StartLevel()
    }

    onClickShare(){
        PlatformSystem.shareAppVideoMessage(()=>{
            this.onClickNext()
        },()=>{
        })
    }
}
