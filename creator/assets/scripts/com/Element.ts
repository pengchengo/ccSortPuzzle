import { _decorator, Component, Node, resources, Sprite, SpriteFrame,Animation } from 'cc';
import { WaterType } from './Glass';
const { ccclass, property } = _decorator;

@ccclass('Element')
export class Element extends Component {

    @property({ type: Sprite })
    public image: Sprite;
    @property({ type: Animation })
    public m_animation: Animation;

    curType;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public Refresh(scrType)
    {
        this.curType = scrType;
        let typeInt = scrType;
        let typeStr = typeInt+"";
        if (typeInt <= 9)
        {
            typeStr = "0" + typeStr;
        }
        //var name = GameManager.Instance.GetCurElementCfg().name;
        let path = "element/cat_" + typeStr +"/spriteFrame";
        this.image.node.active = false
        let frame = resources.get(path, SpriteFrame)
        if(frame){
            this.image.spriteFrame = frame
            this.image.node.active = true
        }else{
            resources.load(path, SpriteFrame, (err1: Error, loadedRes)=>{
                this.image.spriteFrame = loadedRes
                this.image.node.active = true
            })
        }
        
        //Sprite sprite = Resources.Load(path, typeof(Sprite)) as Sprite;
        //image.overrideSprite = sprite;
    }

    public RefreshImage()
    {
        if(this.curType != WaterType.Empty)
        {
            this.Refresh(this.curType);
        }
    }

    public PlayAnim()
    {
        this.m_animation.play("yuansu");
    }
}

