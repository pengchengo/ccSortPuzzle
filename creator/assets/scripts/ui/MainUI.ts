import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Label, AudioSource, sys } from 'cc';
import { AudioSystem } from '../system/AudioSystem';
import { GameSystem } from '../system/GameSystem';
import { PlatformSystem } from '../system/PlatformSystem';
import { PlayerData } from '../system/PlayerData';
import { UISystem } from '../system/UISystem';
import { LevelUI } from './LevelUI';
import { SettingUI } from './SettingUI';
const { ccclass, property, menu} = _decorator;

@ccclass
@menu("界面/MainUI")
export class MainUI extends Component {
    static MAX_BACK_NUM = 5
    static Inst = null

    @property({ type: Label })
    public levelLb: Label;

    @property({ type: AudioSource })
    public bgmSource: AudioSource;

    @property({ type: AudioSource })
    public soundSource: AudioSource;

    @property({ type: Node })
    public addPlateMask: Node;

    @property({ type: Node })
    public backPic: Node;

    @property({ type: Node })
    public backVideo: Node;

    @property({ type: Label })
    public lbBack: Label;

    start() {
        MainUI.Inst = this
        this.refreshLevel()
        AudioSystem.init(this.bgmSource, this.soundSource)
        AudioSystem.playMusic("game")

        let addGlass = sys.localStorage.getItem("STORAGE_ADD_GLASS_KEY") as any
        if(addGlass && addGlass != "undefined"){
            this.UpdateAddPlateMask(true);
        }else{
            this.UpdateAddPlateMask(false);
        }
    }

    onEnable(){

    }

    onDisable(){

    }

    onClickLevel(){
        LevelUI.show()
    }

    onClickSetting(){
        SettingUI.show()
    }

    onClickBack(){
        if(GameSystem.HasBackNum()){
            GameSystem.BackPath();
        }else{
            PlatformSystem.showVideo(()=>{
                GameSystem.AddBackNum();
            })
        }
        
    }

    onClickAddGlass(){
        if(this.addPlateMask.active){
            return
        }
        PlatformSystem.showVideo(()=>{
            GameSystem.AddOneGlass();
            this.UpdateAddPlateMask(true);
        })
    }

    onClickRefresh(){
        GameSystem.Restart()
    }

    public UpdateAddPlateMask(isActive)
    {
        this.addPlateMask.active = (isActive);
    }

    refreshLevel(){
        this.levelLb.string = "Level "+PlayerData.data.curLevel
    }

    update(deltaTime: number) {
        
    }

    RefreshBackTxt(){
        let leftNum = MainUI.MAX_BACK_NUM - GameSystem.curBackNum;
        if(leftNum <= 0)
        {
            this.backPic.active = false;
            this.backVideo.active = true;
            //UIManager.Instance.uiController.backNormal.SetActive(false);
            //UIManager.Instance.uiController.leftNumTxt.text = "video";
        }
        else
        {
            this.backPic.active = true;
            this.backVideo.active = false;
            this.lbBack.string = leftNum + "";
            //UIManager.Instance.uiController.backNormal.SetActive(true);
            //UIManager.Instance.uiController.leftNumTxt.text = leftNum.ToString();
        }
    }
}

