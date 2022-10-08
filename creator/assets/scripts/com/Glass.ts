import { _decorator, Component, Node, Vec3, view, tween, Tween } from 'cc';
import { GameSystem } from '../system/GameSystem';
import { Element } from './Element';
const { ccclass, property } = _decorator;

export enum WaterType
{
    Empty = 0,
    type1,
    type2,
    type3,
    type4,
    type5,
    type6,
    type7,
    type8,
    type9,
    type10,
    type11,
    type12,
    type13,
    type14,
    type15,
    type16,
    type17,
    type18,
    type19,
    type20,
}

@ccclass('Glass')
export class Glass extends Component {
    @property({ type: Node })
    public moveUpObj: Node;
    @property({ type: Node })
    public flyPass: Node;
    @property({ type: [Node] })
    public imageList: Node[] = [];

    myWaterList = [];
    startXList = [];
    myIndex;
    isFinish;
    isMoveUp;
    startPosY;
    fitScale;
    isPlayingAnim;
    myManager;
    moveElement;
    curMat;
    useMatNum = 0;
    flyPassPos;
    moveUpPos;

    start() {

    }

    Init(manager, index, posList, waterList){
        this.curMat = null;
        this.useMatNum = 0;
        this.isPlayingAnim = false;
        this.isFinish = false;
        this.isMoveUp = false;
        this.moveElement = null;
        this.myManager = manager;
        this.myIndex = index;
        this.myWaterList = [];
        let pos = posList[index];
        const size = view.getVisibleSize();
        this.startPosY = pos[1] + size.height / 2;

        var allNum = posList.Count;
        this.UpdateScale(allNum);

        this.fitScale = 1;// UIManager.Instance.glassFitScale;
        this.node.position = new Vec3(pos[0]/this.fitScale, this.startPosY - size.height / 2, 0);
        for (let i = 0; i < waterList.length; i++)
        {
            this.myWaterList.push(waterList[i]);
        }
        let startY = 0;
        for (let i = 0; i < this.imageList.length; i++)
        {
            this.startXList.push(startY + 84.7*i);
        }
        this.Refresh();

        this.flyPassPos = this.flyPass.worldPosition;
        this.moveUpPos = this.moveUpObj.worldPosition;
    }

    public UpdateScale(allNum)
    {
        let scale = 1;
        if (GameSystem.isPad)
        {
            if (allNum < 9)
            {
                scale = 1;
            }
            else if (allNum >= 9 && allNum <= 10)
            {
                scale = 0.98;
            }
            else if (allNum >= 11 && allNum <= 12)
            {
                scale = 0.9;
            }
            else if (allNum >= 13 && allNum <= 14)
            {
                scale = 0.8;
            }
            else
            {
                scale = 0.7;
            }
        }
        else
        {
            if (allNum < 9)
            {
                scale = 1;
            }
            else if (allNum >= 9 && allNum <= 10)
            {
                scale = 0.95;
            }
            else if (allNum >= 11 && allNum <= 12)
            {
                scale = 0.95;
            }
            else if (allNum >= 13 && allNum <= 14)
            {
                scale = 0.95;
            }
            else
            {
                scale = 0.95;
            }
        }
        this.node.scale = new Vec3(scale, scale, scale);
    }

    update(deltaTime: number) {
        
    }

    public Refresh()
    {
        var showCount = this.myWaterList.length;
        if (this.moveElement)
        {
            showCount = showCount - 1;
        }
        for (let i = 0; i < 4; i++)
        {
            if (i < showCount)
            {
                this.RefreshIndexImage(i);
            }
            else
            {
                this.RefreshIndexImage(i);
                this.imageList[i].active = (false);
            }
            this.imageList[i].position = new Vec3(0, this.startXList[i], 0);
        }
        this.CheckFinish();
    }

    public CheckFinish()
    {
        if(this.myWaterList.length < 4)
        {
            return;
        }
        var firstType = this.myWaterList[0];
        for (let i = 1; i < 4; i++)
        {
            if(firstType != this.myWaterList[i])
            {
                return;
            }
        }
        this.isFinish = true;
        /*AudioManager.Instance.PlaySound("chenggong"); TODO
        StartCoroutine(PlayFinishAnim());
        GameSystem.CheckFinish();*/
    }

    public RefreshIndexImage(i)
    {
        if (i < this.myWaterList.length){
            this.imageList[i].active = (true);
            let ele = this.imageList[i].getComponent(Element);
            ele.Refresh(this.myWaterList[i]);
        }
    }

    public OnClick()
    {
        if (this.isPlayingAnim || this.isFinish)
        {
            return;
        }
        //Debug.Log("OnClick+" + myIndex);
        GameSystem.SelectOne(this.myIndex);
    }

    public GetMoveEndPos()
    {
        var firstIndex = this.myWaterList.length;
        var firstEle = this.imageList[firstIndex];
        return firstEle.worldPosition;
    }

    public GetMovePassPos()
    {
        return this.flyPassPos;
    }

    public MoveUp()
    {
        this.isMoveUp = true;
        var firstIndex = this.myWaterList.length - 1;
        var firstCat = this.imageList[firstIndex];
        firstCat.active = (false);
        this.moveElement = this.myManager.GetMoveElement();
        this.moveElement.transform.localScale = this.node.scale;
        this.moveElement.gameObject.SetActive(true);
        this.moveElement.Refresh(this.myWaterList[firstIndex]);
        var curWorldPos = firstCat.worldPosition;
        this.moveElement.transform.position = new Vec3(curWorldPos.x, curWorldPos.y, curWorldPos.z);
       
        if(firstIndex == 0)
        {
            this.AddMat();
        }
        //var anim = this.moveElement.transform.DOMoveY(this.moveUpPos.y, 0.1f);
        this.isPlayingAnim = true;
        Tween.stopAllByTarget(this.moveElement)
        tween(this.moveElement)
            .to(1.0, { position: new Vec3(this.moveElement.worldPosition.x, this.moveUpPos.worldPosition.y, this.moveElement.worldPosition.z) })
            .call(()=>{
                this.isPlayingAnim = false;
                if (firstIndex == 0)
                {
                    this.RemoveMat();
                }
            })
    }

    public GetMoveUpPos(){
        return this.moveUpPos;
    }
    public MoveDown()
    {
        this.isMoveUp = false;
        var firstIndex = this.myWaterList.length - 1;
        if(firstIndex < 0)
        {
            return;
        }

        var firstCat = this.imageList[firstIndex];
        if (this.moveElement)
        {
            if (firstIndex == 0)
            {
                this.AddMat();
            }
            this.isPlayingAnim = true;
            Tween.stopAllByTarget(this.moveElement)
            tween(this.moveElement)
                .to(1.0, { position: new Vec3(this.moveElement.worldPosition.x, firstCat.worldPosition.y, this.moveElement.worldPosition.z) })
                .call(()=>{
                    if (firstIndex == 0)
                    {
                        this.RemoveMat();
                    }
                    firstCat.active = (true);
                    firstCat.getComponent(Element).PlayAnim();
                    this.myManager.CacheMoveElement(this.moveElement);
                    this.moveElement = null;
                    this.isPlayingAnim = false;
                })
            //var anim = this.moveElement.transform.DOMoveY(firstCat.worldPosition.y, 0.1f);
        }
    }

    public QuickDown()
    {
        var firstIndex = this.myWaterList.length - 1;
        if (firstIndex < 0)
        {
            return;
        }
        if (this.moveElement)
        {
            var firstCat = this.imageList[firstIndex];
            firstCat.active = (true);
            this.myManager.CacheMoveElement(this.moveElement);
            this.moveElement = null;
            this.isPlayingAnim = false;
        }
    }

    public SetIsMoveUp(value)
    {
        this.isMoveUp = value;
    }

    public AddMat()
    {
        this.useMatNum = this.useMatNum + 1;
        if (!this.curMat)
        {
            this.curMat = this.myManager.GetMat();
            this.curMat.worldPosition = this.node.worldPosition;
        }
        this.curMat.transform.SetAsLastSibling();
        this.curMat.worldPosition = this.node.worldPosition;
    }

    public RemoveMat()
    {
        this.useMatNum = this.useMatNum - 1;
        if (this.useMatNum <= 0)
        {
            this.myManager.CacheMat(this.curMat);
            this.curMat = null;
        }
    }

    public GetMoveElement()
    {
        return this.moveElement;
    }

    public RemoveMoveElement(ele)
    {
        if(ele == this.moveElement)
        {
            this.moveElement = null;
        }
    }
}

