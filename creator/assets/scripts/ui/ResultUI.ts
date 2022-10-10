import { _decorator, Component, Node, resources, Sprite, SpriteFrame } from 'cc';
import { UISystem } from '../system/UISystem';
import { BaseUI } from './BaseUI';
const { ccclass, menu } = _decorator;

@ccclass
@menu("界面/ResultUI")
export class ResultUI extends BaseUI {
    static uiName = "ResultUI"

    start() {

    }

    update(deltaTime: number) {
        
    }
}
