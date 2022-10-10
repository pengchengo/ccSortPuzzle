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
    }

    onClickItem(item, idx){
        console.log("idx=",idx)
        PlayerData.data.curLevel = idx+1
        this.hide()
        GameSystem.StartLevel()
    }

    update(deltaTime: number) {
        
    }
}
