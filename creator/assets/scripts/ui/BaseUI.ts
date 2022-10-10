import { _decorator, Component, Node, resources, Sprite, SpriteFrame } from 'cc';
import { UISystem } from '../system/UISystem';
const { ccclass, property } = _decorator;

@ccclass('BaseUI')
export class BaseUI extends Component {
    static uiName = ""
    staticObj = null

    static show(){
        UISystem.show(this.uiName, this)
    }

    static hide(){
        UISystem.hide(this.uiName)
    }

    hide(){
        //@ts-ignore
        this.node.uiStatic.hide()
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

