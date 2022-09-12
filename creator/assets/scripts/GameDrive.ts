import { _decorator, Component, Node } from 'cc';
import { GameSystem } from './system/GameSystem';
const { ccclass, property } = _decorator;

@ccclass('GameDrive')
export class GameDrive extends Component {
    start() {
        GameSystem.Init()
    }

    update(deltaTime: number) {
        
    }
}

