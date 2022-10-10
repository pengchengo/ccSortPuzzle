import { _decorator, Component, Node, resources, Sprite, SpriteFrame } from 'cc';
import { UISystem } from '../system/UISystem';
const { ccclass, property } = _decorator;

@ccclass('BaseUI')
export class BaseUI extends Component {
    static uiName = ""

    static show(){
        UISystem.show(this.uiName)
    }

    static hide(){
        UISystem.hide(this.uiName)
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

