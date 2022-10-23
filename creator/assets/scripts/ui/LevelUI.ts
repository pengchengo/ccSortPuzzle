import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Label } from 'cc';
import List from '../list/List';
import { GameSystem } from '../system/GameSystem';
import { PlayerData } from '../system/PlayerData';
import { UISystem } from '../system/UISystem';
import { UtilsSystem } from '../system/UtilsSystem';
import { BaseUI } from './BaseUI';
const { ccclass, menu, property } = _decorator;

@ccclass
@menu("界面/LevelUI")
export class LevelUI extends BaseUI {
    static uiName = "LevelUI"

    @property(List)
    list: List = null;

    start() {
        this.list.numItems = UtilsSystem.getMapNum(GameSystem.levelCfgMap)
    }

    onRenderItem(item: Node, idx: number){
        item.getChildByName("title").getComponent(Label).string = "Level " + (idx+1)
        if(idx < PlayerData.data.maxLevel){
            item.getChildByName("mask").active = false
        }else{
            item.getChildByName("mask").active = true
        }
    }

    onClickItem(item, idx){
        console.log("idx=",idx)
        if(idx >= PlayerData.data.maxLevel){
            return
        }
        PlayerData.changeCurLevel(idx+1)
        this.hide()
        GameSystem.ChangeToLevel()
    }

    onClickBack(){
        this.hide()
    }

    update(deltaTime: number) {
        
    }
}
