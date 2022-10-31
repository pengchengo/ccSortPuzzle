import { _decorator, Component, Node, resources,JsonAsset, instantiate, Prefab, director, Tween, tween, Vec3, TransformBit, UITransform, Game, sys } from 'cc';
import { Glass, WaterType } from '../com/Glass';
import {Element} from "../com/Element"
import { UtilsSystem } from './UtilsSystem';
import { ResultUI } from '../ui/ResultUI';
import { UISystem } from './UISystem';
import { PlayerData } from './PlayerData';
import { LevelUI } from '../ui/LevelUI';
import { AudioSystem } from './AudioSystem';
import { MainUI } from '../ui/MainUI';
const { ccclass, property } = _decorator;

class _GameSystem {
    maxLevel = 0
    curBackNum = 0
    elementRoot
    NOT_SELECT = -1;
    selectIndex;
    moveIndexMap = {}
    history = []
    elementList = []
    matList = []
    moveElementNum = 0

    gamePrefab = null
    glassList = []
    cacheGlassList = []
    cacheElementList = []
    cacheMatList = []

    levelCfgMap = null
    Init(){
        PlayerData.init()
        this.ReadLevelCfg()
        this.LoadGamePrefab()
    }

    LoadGamePrefab(){
        resources.load("prefabs/gamePrefab", Prefab, (err1: Error, loadedRes) => {
            //this.levelCfgMap = loadedRes.json
            this.gamePrefab = instantiate(loadedRes)
            this.gamePrefab.active = true;
            this.gamePrefab.parent = director.getScene()
            this.elementRoot = this.gamePrefab.getChildByName("elementRoot")
            this.initCachList()
            this.StartLevel()
            UISystem.init()
            //LevelUI.show()
        })
    }

    initCachList(){
        for(let i = 0; i < 14; i++){
            let glass = instantiate(this.gamePrefab.getChildByName("Glass"))
            glass.active = false
            this.elementRoot.addChild(glass)
            glass.position.y = 13.6
            let glassCpt = glass.getComponent(Glass)
            this.cacheGlassList.push(glassCpt)
            //instantiate()
        }
        for(let i = 0; i < 7; i++){
            let element = instantiate(this.gamePrefab.getChildByName("Element"))
            element.active = false
            this.elementRoot.addChild(element)
            let elementCpt = element.getComponent(Element)
            this.cacheElementList.push(elementCpt)
            //instantiate()
        }

        for(let i = 0; i < 7; i++){
            let mat = instantiate(this.gamePrefab.getChildByName("Mat"))
            mat.active = false
            this.elementRoot.addChild(mat)
            this.cacheMatList.push(mat)
            //instantiate()
        }
    }

    ReadLevelCfg()
    {
        if(this.levelCfgMap){
            return;
        }
        resources.load("cfg/levelCfg", JsonAsset, (err1: Error, loadedRes) => {
            this.levelCfgMap = loadedRes.json
            GameSystem.maxLevel = UtilsSystem.getMapNum(this.levelCfgMap)
        })
    }

    isPad(){
        return false
    }
    
    AddPosList(posList,  num, posY, maxDis)
    {
        let lrDistance = 80;
        //let maxWidth = UnityEngine.Screen.width - lrDistance*2;
        let contentWidth = 768;
        if (this.isPad())
        {
            //TODO
            //var scrollRect = UIManager.Instance.gameLayer.GetComponent<RectTransform>().rect;
            //contentWidth = scrollRect.width;
        }
        let maxWidth = contentWidth - lrDistance * 2;
        let maxDistance = 160;
        if(maxDis > 0)
        {
            maxDistance = maxDis;
        }
        let distance = maxDistance;
        let width = (num-1) * distance;
        if (width > maxWidth)
        {
            distance = maxWidth / (num - 1);
            width = maxWidth;
        }
        let startX = (maxWidth - width) / 2 - contentWidth / 2 + lrDistance;
        for(let i = 0; i < num; i++)
        {
            posList.push([startX+distance*i, posY]);
        }
        return distance;
    }

    GetPositionList(num)
    {
        let posList = [];
        let offY = -60;
        if (this.isPad()){
            offY = -90;
        }
        if(num >= 11 && num <= 12){
            let distance = 320;
            if (this.isPad()){
                distance = 280;
            }
            var dis = this.AddPosList(posList, 4, distance+offY, 0);
            this.AddPosList(posList, 4, 0+offY, dis);
            this.AddPosList(posList, num-8, -distance+offY, dis);
            return posList;
        }
        if(num >= 13){
            let distance = 320;
            if (this.isPad()){
                distance = 310;
            }
            var dis = this.AddPosList(posList, 5, distance+offY, 0);
            this.AddPosList(posList, 5, 0+offY, dis);
            this.AddPosList(posList, num-10, -distance+offY, dis);
            return posList;
        }
        if (num >= 5)
        {
            let downNum = (Math.floor(num / 2));
            var dis = this.AddPosList(posList, num - downNum, 150, 0);
            this.AddPosList(posList, downNum, -150, dis);
        }
        else
        {
            this.AddPosList(posList, num, 0, 0);
        }
        return posList;
    }

    InitOneGlass(index, posList, waterList)
    {
        let glass = this.cacheGlassList.pop();
        this.glassList.push(glass);
        glass.node.active = (true);
        glass.Init(this, index, posList, waterList);
        return glass;
    }

    Restart(){
        this.StartLevel()
    }

    StartLevel(){
        this.curBackNum = 0
        this.moveElementNum = 0
        this.moveIndexMap = {}
        this.history = []
        this.selectIndex = this.NOT_SELECT;

        for(let i = 0; i < this.matList.length; i++){
            this.matList[i].active = (false);
            this.cacheMatList.push(this.matList[i]);
        }
        this.matList = [];

        for(let i = 0; i < this.elementList.length; i++){
            this.elementList[i].node.active = (false);
            this.cacheElementList.push(this.elementList[i]);
        }
        this.elementList = [];

        for(let i = 0; i < this.glassList.length; i++){
            this.glassList[i].node.active = (false);
            this.cacheGlassList.push(this.glassList[i]);
        }
        this.glassList = [];

        let levelId = PlayerData.data.curLevel
        let levelCfg = this.levelCfgMap[levelId]
        let num = levelCfg.length;
        let addGlass = sys.localStorage.getItem("STORAGE_ADD_GLASS_KEY") as any
        if(addGlass && addGlass != "undefined"){
            addGlass = true
        }else{
            addGlass = false
        }
        if(addGlass)
        {
            num = num + 1;
        }
        var posList = this.GetPositionList(num);
        for (let i = 0; i < levelCfg.length; i++)
        {
            let waterList = levelCfg[i];
            this.InitOneGlass(i, posList, waterList);
        }
        if (addGlass == 1)
        {
            this.InitOneGlass(num - 1, posList, []);
        }

        if(MainUI.Inst){
            MainUI.Inst.UpdateAddPlateMask(addGlass);
        }   
    }

    SelectOne(index){
        /*if(GuideManager.Instance.SelectOne(selectIndex, index))
        {
            return;
        }*/

        if (this.selectIndex == this.NOT_SELECT && (this.moveIndexMap[index] && this.moveIndexMap[index] > 0))
        {
            return;
        }
        if (this.selectIndex == this.NOT_SELECT)
        {
            if (this.glassList[index].isEmpty())
            {
                return;
            }
            this.selectIndex = index;
            this.glassList[index].MoveUp();
        }
        else if (this.selectIndex == index)
        {
            this.selectIndex = this.NOT_SELECT;
            this.glassList[index].MoveDown();
            AudioSystem.playSound("tan");
        }
        else
        {
            if (this.glassList[this.selectIndex].isPlayingAnim)
            {
                return;
            }
            let leftNum = this.glassList[index].getLeftNum();
            if(leftNum <= 0)
            {
                this.glassList[this.selectIndex].MoveDown();
                this.glassList[index].MoveUp();
                this.selectIndex = index;
                AudioSystem.playSound("tan");
                return;
            }
            var srcGlass = this.glassList[this.selectIndex];
            var desGlass = this.glassList[index];
            let srcType = srcGlass.getTopWaterType();
            let desType = desGlass.getTopWaterType();
            if (desType == WaterType.Empty || srcType == desType)
            {
                var scrWaterList = srcGlass.getWaterList();
                var desWaterList = desGlass.getWaterList();
                let moveNum = 0;
                for (var i = 1; i <= leftNum; i++)
                {
                    //if(scrWaterList[scrWaterList.length-1] == srcType)
                    if((scrWaterList.length - i) >= 0 && scrWaterList[scrWaterList.length-i] == srcType)
                    {
                        moveNum = moveNum + 1;
                    }else{
                        break;
                    }
                    if(scrWaterList.length == 0)
                    {
                        break;
                    }
                }

                //PlayMoveAnim(selectIndex, index, srcType);
                console.log("pc77 moveNum="+ moveNum);
                if(moveNum == 1){
                    this.PlayMoveAnim(this.selectIndex, index, srcType);
                }else{
                    this.PlayLinkAnim(this.selectIndex, index, srcType, moveNum);
                }
                let mp = {} as any;
                mp.src = this.selectIndex;
                mp.des = index;
                mp.num = moveNum;
                this.history.push(mp);
                this.selectIndex = this.NOT_SELECT;
            }
            else
            {
                if((this.moveIndexMap[index] && this.moveIndexMap[index] > 0))
                {
                    this.glassList[this.selectIndex].MoveDown();
                    this.selectIndex = this.NOT_SELECT;
                }
                else
                {
                    this.glassList[this.selectIndex].MoveDown();
                    this.glassList[index].MoveUp();
                    this.selectIndex = index;
                }
                AudioSystem.playSound("tan");
            }
        }
    }

    public GetMoveElement()
    {
        let eleCpt = this.cacheElementList.pop() as Element;
        eleCpt.node.setSiblingIndex(99)
        this.elementList.push(eleCpt);
        return eleCpt;
    }

    public CacheMoveElement(ele)
    {
        for(let i = 0; i < this.elementList.length; i++){
            if(ele == this.elementList[i]){
                this.elementList.splice(i, 1)
                break
            }
        }
        ele.node.active = (false);
        ele.node.setSiblingIndex(1)
        this.cacheElementList.push(ele);
    }

    public PlayMoveAnim(srcIndex, desIndex, srcType)
    {
        if (this.moveIndexMap[desIndex])
        {
            this.moveIndexMap[desIndex] = this.moveIndexMap[desIndex] + 1;
        }
        else
        {
            this.moveIndexMap[desIndex] = 1;
        }
        var srcGlass = this.glassList[this.selectIndex];
        var desGlass = this.glassList[desIndex];
        var scrWaterList = srcGlass.getWaterList();
        var desWaterList = desGlass.getWaterList();

        let ele = srcGlass.GetMoveElement();
        var eleObj = ele.node;

        let isEmpty = desGlass.isEmpty();
        var moveEndPos = desGlass.GetMoveEndPos();
        Tween.stopAllByTarget(eleObj)
        tween(eleObj)
            .to(0.2, { worldPosition: desGlass.GetMovePassPos() })
            .call(()=>{
                if (isEmpty)
                {
                    desGlass.AddMat();
                }
            })
            .to(0.2, { worldPosition: moveEndPos })
            .call(()=>{
                if (isEmpty)
                {
                    desGlass.RemoveMat();
                }
                console.log("我已经执行完毕");
                this.moveElementNum = this.moveElementNum - 1;
                this.CacheMoveElement(ele);
                desGlass.RefreshIndex(desUpdateIndex);
                desGlass.CheckFinish();
                AudioSystem.playSound("tan");
                this.moveIndexMap[desIndex] = this.moveIndexMap[desIndex] - 1;
                if(!this.checkCanMove()){
                    //UIManager.Instance.uiController.ShowTishi();
                }
            })
            .start()
        desWaterList.push(srcType);
        scrWaterList.pop();
        srcGlass.RemoveMoveElement(ele);
        srcGlass.SetIsMoveUp(false);
        var desUpdateIndex = desWaterList.length - 1;
        this.moveElementNum = this.moveElementNum + 1;
    }

    public checkCanMove()
    {
        for (let i = 0; i < this.glassList.length; i++)
        {
            var srcGlass = this.glassList[i];
            let topSrcType = srcGlass.getTopWaterType();
            if(topSrcType == WaterType.Empty){
                return true;
            }
            let moveNum = 0;
            var srcWaterList = srcGlass.getWaterList();
            for (let j = (srcWaterList.length-1); j >= 0 ; j--){
                if(srcWaterList[j] == topSrcType){
                    moveNum = moveNum + 1;
                }else{
                    break;
                }
            }
            for (let j = 0; j < this.glassList.length; j++)
            {
                if (i == j)
                {
                    continue;
                }
                var desGlass = this.glassList[j];
                let desType = desGlass.getTopWaterType();
                if(desType == WaterType.Empty){
                    return true;
                }
                var desWaterList = desGlass.getWaterList();
                if (topSrcType == desType && moveNum <= (4-desWaterList.length))
                {
                    return true;
                }
            }
        }
        return false;
    }

    public PlayLinkAnim(srcIndex, desIndex, srcType, moveNum){
        if (this.moveIndexMap[desIndex])
        {
            this.moveIndexMap[desIndex] = this.moveIndexMap[desIndex] + moveNum;
        }
        else
        {
            this.moveIndexMap[desIndex] = moveNum;
        }
        var srcGlass = this.glassList[this.selectIndex];
        var desGlass = this.glassList[desIndex];
        var scrWaterList = srcGlass.getWaterList();
        var desWaterList = desGlass.getWaterList();
        var callNum = moveNum;
        for(let i = 1; i <= moveNum; i++){
            let isEmpty = false;
            var moveEndPos = desGlass.GetMoveEndPos();
            let moveEndFuc = (_desUpdateIndex, ele)=>{
                if (isEmpty)
                {
                    desGlass.RemoveMat();
                }
                console.log("我已经执行完毕");
                this.moveElementNum = this.moveElementNum - 1;
                callNum = callNum - 1;
                this.CacheMoveElement(ele);
                console.log("_desUpdateIndex=",_desUpdateIndex)
                desGlass.RefreshIndex(_desUpdateIndex);
                if(callNum <= 0){
                    desGlass.CheckFinish();
                    if(!this.checkCanMove()){
                        //UIManager.Instance.uiController.ShowTishi();
                    }
                }
                AudioSystem.playSound("tan");
                this.moveIndexMap[desIndex] = this.moveIndexMap[desIndex] - 1;
            }
            if (i == 1){
                let moveFirstFuc = (_desUpdateIndex)=>{
                    let ele = srcGlass.GetMoveElement();
                    let eleObj = ele.node;
                    isEmpty = desGlass.isEmpty();
                    desWaterList.push(srcType);
                    scrWaterList.pop();
                    srcGlass.RemoveMoveElement(ele);
                    srcGlass.SetIsMoveUp(false);
                    Tween.stopAllByTarget(eleObj)
                    tween(eleObj)
                        .to(0.2, { worldPosition: desGlass.GetMovePassPos() })
                        .call(()=>{
                            if (isEmpty)
                            {
                                desGlass.AddMat();
                            }
                        })
                        .to(0.2, { worldPosition: moveEndPos })
                        .call(()=>{
                            moveEndFuc(_desUpdateIndex, ele)
                        })
                        .start()
                }
                moveFirstFuc(desWaterList.length)
            }
            else{
                let moveNextFuc = (_desUpdateIndex)=>{
                    let ele = srcGlass.CreateTopMoveElement();
                    let eleObj = ele.node;
                    desWaterList.push(srcType);
                    scrWaterList.pop();
                    Tween.stopAllByTarget(eleObj)
                    tween(eleObj)
                        .delay((i-2)*0.2)
                        .to(0.2, { worldPosition: srcGlass.GetMoveUpPos() })
                        .to(0.2, { worldPosition: desGlass.GetMovePassPos() })
                        .call(()=>{
                            if (isEmpty)
                            {
                                desGlass.AddMat();
                            }
                        })
                        .to(0.2, { worldPosition: moveEndPos })
                        .call(()=>{
                            moveEndFuc(_desUpdateIndex, ele)
                        })
                        .start()
                }
                moveNextFuc(desWaterList.length)
            }
            this.moveElementNum = this.moveElementNum + 1;
        }
    }

    public GetMat()
    {
        let mat = this.cacheMatList.pop();
        mat.active = (true);
        this.matList.push(mat);
        return mat;
    }

    public CacheMat(mat)
    {
        this.removeFromArray(this.matList, mat);
        mat.active = (false);
        this.cacheMatList.push(mat);
    }

    removeFromArray(array, value){
        for(let i = 0; i < array.length; i++){
            if(array[i] == value){
                array.splice(i, 1)
                break;
            }
        }
    }

    public CheckFinish()
    {
        if(this.moveElementNum > 0)
        {
            return;
        }
        for (let i = 0; i < this.glassList.length; i++)
        {
            let glass = this.glassList[i];
            if(!glass.isEmpty() && !glass.IsFinish())
            {
                return;
            }
        }
        /*if(this.CanOneGlass()){
            let nowTime = TimeManager.Instance.GetTimeStampMs();
            let useTime = (int)(TimeManager.Instance.GetTimeStampMs() - levelBeginTime);
            NetManager.Instance.BiLevelTime(StorageManager.Instance.GetCurLevel(), useTime);
        }*/

        UtilsSystem.scheduleOnce(1000, ()=>{
            ResultUI.show()
        })
    }

    public AddBackNum()
    {
        this.curBackNum = 0;
        MainUI.Inst.RefreshBackTxt();
    }

    public AddOneGlass()
    {
        let addGlass = sys.localStorage.getItem("STORAGE_ADD_GLASS_KEY");
        if(addGlass && addGlass != "undefined")
        {
            //UIManager.Instance.ShowTip(CommonStr.alreadyAddGlass);
            return;
        }
        sys.localStorage.setItem("STORAGE_ADD_GLASS_KEY", "1");
        var posList = this.GetPositionList(this.glassList.length+1);
        for (let i = 0; i < this.glassList.length; i++)
        {
            this.glassList[i].UpdatePos(posList);
        }
        this.InitOneGlass(this.glassList.length, posList, []);
        //UIManager.Instance.uiController.HideTishi();
    }

    ChangeToLevel()
    {
        sys.localStorage.setItem("STORAGE_ADD_GLASS_KEY", undefined);
        this.StartLevel();
    }

    public HasBackNum()
    {
        if(this.curBackNum >= MainUI.MAX_BACK_NUM){
            return false;
        }else{
            return true;
        }
    }
    public BackPath()
    {
        if (this.curBackNum >= MainUI.MAX_BACK_NUM)
        {
            //WatchAddBack();
            return;
        }
        if(this.history.length == 0)
        {
            return;
        }
        if (this.selectIndex != this.NOT_SELECT)
        {
            this.glassList[this.selectIndex].QuickDown();
            this.selectIndex = this.NOT_SELECT;
        }
        this.curBackNum = this.curBackNum + 1;
        MainUI.Inst.RefreshBackTxt();
        var movePath = this.history.pop();

        var srcGlass = this.glassList[movePath.src];
        var desGlass = this.glassList[movePath.des];
        var scrWaterList = srcGlass.getWaterList();
        var desWaterList = desGlass.getWaterList();
        for (var i = 0; i < movePath.num; i++)
        {
            var lastDes = desWaterList.pop();
            scrWaterList.push(lastDes);
        }
        desGlass.isFinish = false;
        srcGlass.Refresh();
        desGlass.Refresh();
        //UIManager.Instance.uiController.HideTishi();
    }
}

export const GameSystem = new _GameSystem();
