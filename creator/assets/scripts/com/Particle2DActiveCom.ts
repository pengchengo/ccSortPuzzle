import { _decorator, Component, Node, resources, Sprite, SpriteFrame, ParticleSystem2D } from 'cc';
import { WaterType } from './Glass';
const { ccclass, property } = _decorator;

@ccclass('Particle2DActiveCom')
export class Particle2DActiveCom extends Component {
    public _isParticleActive = true
    
    public set isParticleActive(v : boolean) {
        this._isParticleActive = v
        let particleSystem2D = this.node.getComponent(ParticleSystem2D)
        if(particleSystem2D){
            if(v){
                particleSystem2D.resetSystem()
            }else{
                particleSystem2D.stopSystem()
            }
        }
    }

    
    public get isParticleActive() : boolean {
        return this._isParticleActive
    }

    start() {
        let particleSystem2D = this.node.getComponent(ParticleSystem2D)
        if(particleSystem2D){
            this._isParticleActive = particleSystem2D.active
        }
    }
}

