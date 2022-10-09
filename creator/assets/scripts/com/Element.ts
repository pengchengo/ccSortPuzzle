import { _decorator, Component, Node, resources, Sprite, SpriteFrame } from 'cc';
import { WaterType } from './Glass';
const { ccclass, property } = _decorator;

@ccclass('Element')
export class Element extends Component {
    public m_Animation;

    @property({ type: Sprite })
    public image: Sprite;

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
        resources.load(path, SpriteFrame, (err1: Error, loadedRes)=>{
            this.image.spriteFrame = loadedRes
        })
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
        //m_Animation.Play("Element_ani");
    }
}

