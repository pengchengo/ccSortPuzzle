import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Label } from 'cc';
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

    start() {
        MainUI.Inst = this
        this.refreshLevel()
    }

    onEnable(){

    }

    onDisable(){

    }

    onClickLevel(){
        LevelUI.show()
    }

    refreshLevel(){
        this.levelLb.string = PlayerData.data.curLevel+""
    }

    update(deltaTime: number) {
        
    }
}

