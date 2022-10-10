
import { sys } from "cc";
import { EventDef } from "../event/TYEvent";
import { TYEventDispatcher } from "../event/TYEventDispatcher";

export class _PlayerData {
    PlayerDataStorageKey = "PlayerDataStorageKey"
    data: any = null

    init(){
        let content = sys.localStorage.getItem(PlayerData.PlayerDataStorageKey);
        if(!content){
            this.initData()
        }else{
            this.data = JSON.parse(content)
            if(!this.data){
                this.initData()
            }
            this.resetData()
        }
        //console.log("this.data.clayList=",JSON.stringify(this.data.clayList))
    }

    resetData(){
        if(!this.data.maxLevel){
            this.data.maxLevel = 1
        }
        if(!this.data.curLevel){
            this.data.curLevel = 1
        }
        if(!this.data.curElement){
            this.data.curElement = 1
        }
        if(!this.data.curBg){
            this.data.curBg = 1
        }
        if(!this.data.isPurchased){
            this.data.isPurchased = 0
        }
        if(!this.data.coin){
            this.data.coin = 0
        }
        if(!this.data.elementList){
            this.data.elementList = []
        }
        if(!this.data.bgList){
            this.data.bgList = []
        }
        if(!this.data.buyIdList){
            this.data.buyIdList = []
        }
        if(!this.data.buyTimeList){
            this.data.buyTimeList = []
        }
    }

    initData(){
        this.data = {}
        this.data.maxLevel = 1;
        this.data.curLevel = 1;
        this.data.curElement = 1;
        this.data.curBg = 1;
        this.data.isPurchased = 0;
        this.data.coin = 0;
        this.data.elementList = [];
        this.data.bgList = [];
        this.data.buyIdList = [];
        this.data.buyTimeList = [];
        this.saveData()
    }

    addCoin(num:number){
        if(!num){
            return;
        }
        this.data.coin = this.data.coin + num
        this.saveData();
        //UtilsSystem.showCoinAnim()
        TYEventDispatcher.dispatchEventWith(EventDef.coinChange);
    }

    deleteCoin(num:number){
        if(num > this.data.coin){
            return false
        }else{
            this.data.coin = this.data.coin - num
            this.saveData();
            TYEventDispatcher.dispatchEventWith(EventDef.coinChange)
            return true;
        }
    }

    resetCoin(){
        this.data.coin = 0
        this.saveData()
    }

    saveData(){
        sys.localStorage.setItem(PlayerData.PlayerDataStorageKey, JSON.stringify(this.data));
    }
}

export const PlayerData = new _PlayerData();