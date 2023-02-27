import { _decorator, Component, Node } from 'cc';
import { GameSystem } from './system/GameSystem';
import { PlatformSystem } from './system/PlatformSystem';
const { ccclass, property } = _decorator;

@ccclass('GameDrive')
export class GameDrive extends Component {
    start() {
        PlatformSystem.init()
        GameSystem.Init()
    }

    update(deltaTime: number) {
        
    }
}

