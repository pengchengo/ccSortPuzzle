import { _decorator, Component, Node, resources,JsonAsset, instantiate, Prefab, director, Tween, tween, Vec3, TransformBit, UITransform, NodeEventType } from 'cc';
import { Glass, WaterType } from '../com/Glass';
import {Element} from "../com/Element"
import { GameSystem } from './GameSystem';
const { ccclass, property } = _decorator;

class _UISystem {
    uiMap = {}
    mask = null
    uiRoot = null
    uiList = []

    init(){
        this.mask = GameSystem.gamePrefab.getChildByName("mask")
        this.uiRoot = GameSystem.gamePrefab.getChildByName("uiRoot")
        this.mask.on(NodeEventType.TOUCH_START, ()=>{
            console.log("uiMask 屏蔽点击事件")
        }, this)
        this.mask.active = false
    }

    show(uiName, uiStatic){
        if(this.uiMap[uiName] === true){
            return
        }
        if(this.uiMap[uiName]){
            this.mask.active = true
            this.uiMap[uiName].active = true
            return
        }
        this.uiMap[uiName] = true
        this.mask.active = true
        this.uiList.push(uiName)
        resources.load("ui/"+uiName, Prefab, (err1: Error, loadedRes)=>{
            let layer = instantiate(loadedRes)
            layer.active = true;
            //@ts-ignore
            layer.uiStatic = uiStatic;
            this.uiMap[uiName] = layer
            this.uiRoot.addChild(layer)
        })
    }

    hide(uiName){
        if(this.uiMap[uiName] === true){
            return
        }
        this.uiMap[uiName].active = false
        this.uiList.pop()
        if(this.uiList.length <= 0){
            this.mask.active = false
        }
    }
}

export const UISystem = new _UISystem();
