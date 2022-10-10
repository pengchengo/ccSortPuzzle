import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Button } from 'cc';
import { GameSystem } from '../system/GameSystem';
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

    start() {

    }

    update(deltaTime: number) {
        
    }

    onEnable(){
        if(PlayerData.data.curLevel >= GameSystem.maxLevel){
            this.btnNext.active = false
        }else{
            this.btnNext.active = true
        }
    }

    onClickNext(){
        PlayerData.changeCurLevel(PlayerData.data.curLevel+1)
        this.hide()
        GameSystem.StartLevel()
    }
}
