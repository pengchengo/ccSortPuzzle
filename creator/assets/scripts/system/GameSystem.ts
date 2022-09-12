import { _decorator, Component, Node, resources,JsonAsset, instantiate, Prefab, director } from 'cc';
const { ccclass, property } = _decorator;

class _GameSystem {
    gamePrefab = null
    glassList = []
    cacheGlassList = []

    levelCfgMap = null
    Init(){
        for(let i = 0; i < 14; i++){
            //instantiate()
        }
        this.ReadLevelCfg()
        this.LoadGamePrefab()
    }

    LoadGamePrefab(){
        resources.load("prefabs/gamePrefab", Prefab, (err1: Error, loadedRes) => {
            //this.levelCfgMap = loadedRes.json
            this.gamePrefab = instantiate(loadedRes)
            this.gamePrefab.active = true;
            this.gamePrefab.parent = director.getScene()
        })
    }

    ReadLevelCfg()
    {
        if(this.levelCfgMap){
            return;
        }
        resources.load("cfg/levelCfg", JsonAsset, (err1: Error, loadedRes) => {
            this.levelCfgMap = loadedRes.json
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
            posList.Add([startX+distance*i, posY]);
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
        glass.node.setActive(true);
        glass.Init(this, index, posList, waterList);
        return glass;
    }

    StartLevel(){
        let levelId = 1
        let levelCfg = this.levelCfgMap[levelId]
        let num = levelCfg.length;
        let addGlass = 0//PlayerPrefs.GetInt(STORAGE_ADD_GLASS_KEY, 0);
        if(addGlass == 1)
        {
            num = num + 1;
        }
        var posList = this.GetPositionList(num);
        for (let i = 0; i < levelCfg.length; i++)
        {
            let waterList = posList[i];
            this.InitOneGlass(i, posList, waterList);
        }
        if (addGlass == 1)
        {
            this.InitOneGlass(num - 1, posList, []);
        }
    }
}

export const GameSystem = new _GameSystem();
