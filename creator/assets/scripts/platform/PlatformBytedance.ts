import { PlayerData } from "../system/PlayerData";
import { UtilsSystem } from "../system/UtilsSystem";

export class _PlatformBytedance {
    inWhiteList = false
    isPingbi = false;
    APIVersion: string = "1.0.0";

    VideoAdPos: string = "6agtqrgi3k45m54gf6";
    BannerId: string = "2a1ob81q7imfk76k01";
    ShareId: string = "5cqpamtsr957l757i4";//5dltjh4slag4abfa9h 67c7li3me55d2q1chi
    InterstitialId: string = "1fson415jgf3ekml6m";

    ShareVideoTitle = "宠物排序"
    ShareVideoDesc = "宠物排序"
    ShareVideoTopic: string[] = ["宠物排序"];
    RecorderDuration = 300;
    ClipVideoTime = 30;
    MinVideoTime = 15;

    private sysInfo: any;
    private adRewardVideo: any;
    private videoRecorder: any;
    private interstitialAd: any;
    private videoPath: string;
    private startRecorderTime: number;

    init() {
        //this.checkGetUserId()
        // this.checkPingbi();
        this.initSysInfo();
        this.getLaunchOptionsSync();
        this.initRewardVideo();
        //this.initRecorder();
        //this.initInterstitial();
    }

    copyUserId(){
        if(!this.isTTPlatform) return;
        if(!PlayerData.data.userId) return
        //@ts-ignore
        tt.setClipboardData({
            data: ""+PlayerData.data.userId,
            success(res) {
                UtilsSystem.showTip("id拷贝成功");
            },
            fail(res) {
                UtilsSystem.showTip("id拷贝失败");
            },
          });
    }

    initSysInfo() {
        if(!this.isTTPlatform) return;
        //@ts-ignore
        this.sysInfo = tt.getSystemInfoSync();
    }

    initInterstitial() {
        if(!this.isTTPlatform) return;
        //插屏广告只能显示在抖音上
        const isDouyin = this.sysInfo.appName == "Douyin";
        if (isDouyin) {
            //@ts-ignore
            this.interstitialAd = tt.createInterstitialAd({
                adUnitId:this.InterstitialId,
            });
            this.interstitialAd.onLoad(() => {
                console.log("插屏广告加载成功");
            })
            this.interstitialAd.onError((res) => {
                console.log("插屏广告加载失败:",res)
            })
            this.interstitialAd.onClose(() => {
                this.interstitialAd.load();
            })
            this.interstitialAd.load()
        } else {
            console.log("插屏广告仅今日头条安卓客户端支持");
        }
    }

    initRewardVideo() {
        //@ts-ignore
        if(!this.isTTPlatform || !tt.createRewardedVideoAd) return;
        //@ts-ignore
        this.adRewardVideo = tt.createRewardedVideoAd({
            adUnitId: this.VideoAdPos
        });
        this.adRewardVideo.onClose(res => {
            if (res && res.isEnded) {
                if (this.onVideoRewardHandler) {
                    this.onVideoRewardHandler();
                    this.onVideoRewardHandler = null;
                }
            } else {
                if (this.onVideoCloseHandler) this.onVideoCloseHandler();
                this.showToast("视频未看完");
            }
        });
        this.adRewardVideo.onError(err=>{
            console.log("激励视频加载失败",JSON.stringify(err));
            if(this.onVideoCloseHandler){
                this.onVideoCloseHandler();
            }
            UtilsSystem.showTip("拉取广告时会受到广告内部策略控制，广告平台会为当前用户推荐最适合展示的广告，当前无合适广告即不会展示")
        })
        this.adRewardVideo.load();
    }

    public isRecording = false;
    initRecorder(): void {
        if(!this.isTTPlatform) return;
        //@ts-ignore
        this.videoRecorder = tt.getGameRecorderManager();
        this.videoRecorder.onStart(res => {
            this.isRecording = true;
            console.log("录屏开始",res);
            this.startRecorderTime = new Date().getTime();
        });

        this.videoRecorder.onStop(res => {
            this.isRecording = false;
            this.videoPath = null;
            let videoPath = res.videoPath;
            let now = new Date().getTime();
            if(!this.MinVideoTime){
                this.MinVideoTime = 15
            }
            console.log('录屏结束,时常：' + (now - this.startRecorderTime) / 1000 + 's' + ',videoPath：' + this.videoPath);
            if (now - this.startRecorderTime < this.MinVideoTime * 1000) {
                this.videoPath = null;
                //this.showToast("录屏太短");
            } else {
                this.videoRecorder.clipVideo({
                    path: videoPath,
                    timeRange: [this.ClipVideoTime, 0],
                    success:(res) => {
                        this.videoPath = res.videoPath;
                    },
                    fail:(e) => {
                        this.videoPath = null;
                        console.log("剪辑视频失败：",e)
                    }
                })
            }
        });
    }
    
    hasShareVideo(){
        if(this.videoPath){
            return true
        }else{
            return false
        }
    }

    showToast(msg: string): void {
        if(!this.isTTPlatform) return;
        //@ts-ignore
        tt.showToast({
            title: msg,
            duration: 2000,
            icon: "none"
        });
    }

    setVibrate(val: number): void {
        /*if(!this.isTTPlatform) return;
        if (val > 200) {
            tt.vibrateLong({
                success(res) {
                    
                },
                fail(res) {
                    console.log("长震动失败:",res);
                },
                complete(){
                    
                }
            });
        } else {
            //@ts-ignore
            tt.vibrateShort({
                success(res) {
                    
                },
                fail(res) {
                    console.log("短震动失败:",res);
                },
                complete(){

                }
            });
        }*/
    }

    private onVideoRewardHandler:Function;
    private onVideoCloseHandler:Function;
    showVideo(onReward: Function, onClose?: Function): void {
        if(!this.isTTPlatform) {
            onReward && onReward();
            return;
        }
        this.onVideoRewardHandler = onReward;
        this.onVideoCloseHandler = onClose;
        this.adRewardVideo.load().then(()=> {
            this.adRewardVideo
            .show()
            .then(() => {
                if(this.daren_channel != null && this.daren_channelid != null){
                    //SDKModel.darenShangBao(this.daren_channel, this.daren_channelid.toString());
                }})
            .catch(err => {
                if(this.onVideoCloseHandler){
                    this.onVideoCloseHandler();
                }
            })
        });
    }

    showInterstitial() {
        if(this.interstitialAd != null){
            this.interstitialAd.show();
        }
    }
    startRecorder() {
        if (this.videoRecorder == null) return;
        if(!this.isRecording)
        this.videoRecorder.start({
            duration: this.RecorderDuration
        });
    }
    stopRecorder() {
        if (this.videoRecorder == null) return;
        if(this.isRecording)
            this.videoRecorder.stop();
    }

    get isTTPlatform(): boolean {
        let flag = true;
        //@ts-ignore
        if (typeof (tt) == "undefined") {
            flag = false;
        }
        return flag;
    }
    get IsAndroidPlatform():boolean{
        return this.sysInfo.platform == "android"
    }

    shareVedioSuc:Function;
    shareVedioFail:Function;
    shareAppVideoMessage(success: Function, fail: Function) {
        this.shareVedioSuc = success;
        this.shareVedioFail = fail;
        //@ts-ignore
        if (this.videoRecorder == null) {
            this.showToast("暂无视频");
            if(this.shareVedioFail){
                this.shareVedioFail();
                this.shareVedioFail = null;
            }
            this.shareVedioSuc = null;
            return;
        }

        if (this.videoPath != null) {
            let query = null;
            if (this.daren_channelid && this.daren_channel == 'qrcode') {
                query = "channel=share&channelid="+this.daren_channelid;
            } else {
                query = "";
            }
            //@ts-ignore
            tt.shareAppMessage({
                channel: "video",
                title: this.ShareVideoTitle,
                desc: this.ShareVideoDesc,
                imageUrl: "",
                templateId: this.ShareId, // 替换成通过审核的分享ID
                query: query,
                extra: {
                    videoPath: this.videoPath, // 可替换成录屏得到的视频地址
                    videoTopics: this.ShareVideoTopic,//已弃用用下面的
                    hashtag_list:this.ShareVideoTopic,
                },
                success:(res) => {
                    if (this.shareVedioSuc) {
                        this.shareVedioSuc();
                        this.shareVedioSuc = null;
                    }
                    console.log("分享视频成功")
                    this.shareVedioFail = null;
                },
                fail:(e) => {
                    console.log("分享视频失败", e);
                    if (this.shareVedioFail) {
                        this.shareVedioFail();
                        this.shareVedioFail = null;
                    }
                    this.shareVedioSuc = null;
                }
            });
        } else {
            if (this.shareVedioFail) {
                this.shareVedioFail();
                this.shareVedioFail = null;
            }
            this.shareVedioSuc = null;
            console.log("没有视频");
            this.showToast("录屏太短")
        }
    }


    report(eventName, data) {
        //@ts-ignore
        tt.reportAnalytics(eventName, data);
    }

    private daren_channelid = 0;
    private daren_channel = '';
    // 首次登陆获取透彻的渠道参数，做数据追踪处理
    getLaunchOptionsSync() {
        if(!this.isTTPlatform) return;
        //@ts-ignore
        let info = tt.getLaunchOptionsSync();
        console.log(info)
        let game_query:any = localStorage.getItem("game_query");
        this.daren_channelid = 0;
        this.daren_channel = '';
		if (info.query!="") {
            game_query = info.query;
            localStorage.setItem("game_query", game_query);
            this.daren_channelid = game_query.channelid;
            this.daren_channel = game_query.channel;
            //if(this.daren_channel != null && this.daren_channelid != null)
            //    SDKModel.getDaren(this.daren_channel, this.daren_channelid + "");
		}
        
        if (!game_query) {
            console.log(game_query)
            if (game_query && game_query.channelid) {
                this.daren_channelid = game_query.channelid;
				this.daren_channel = game_query.channel;
            }     
        }

        let query = null;
        if (this.daren_channelid && this.daren_channel == 'qrcode') {
            query = "channel=share&channelid="+this.daren_channelid;
        } else {
            query = "";
        }
        //@ts-ignore
        tt.onShareAppMessage(()=>{
            return {
                title:this.ShareVideoTitle,
                query:"",
                success(){
                    console.log("分享成功");
                },
                fail(e) {
                    console.log("分享失败",e);
                }
            }
        })
    }

    addShortcut(success:Function,fail:Function){
        if(!this.isTTPlatform) return;
        // @ts-ignore
        tt.addShortcut({
            success: (res) => {
                if(success){
                    success();
                }
            },
            fail: (res) => {
                if(fail){
                    fail();
                }
            }
        })
    }

    checkShortcut(success:Function,fail:Function){
        if(!this.isTTPlatform) return;
        if(!this.IsAndroidPlatform) {
            if(success){
                success();
            }
            return;
        }
        if(this.sysInfo.platform)
        // @ts-ignore
        tt.checkShortcut({
            success: (res) => {
                if(res.status.exist){
                    if(success){
                        success();
                    }
                } else {
                    if(fail){
                        fail();
                    }
                }
            },
            fail: (res) => {
                if(fail){
                    fail();
                }
            }
        })
    }

    isSupportFileData(){
        return true
    }

    playerDataFilePath = "ttfile://user/cwpxData"

    getPlayerData(callBack){
        console.log("readFile 11");
        // @ts-ignore
        let fileSystemManager = tt.getFileSystemManager();
        /*fileSystemManager.readFile({
            filePath: this.playerDataFilePath,
            encoding:"utf8",
            success(res) {
              // 输出读取的文件内容
              console.log("readFile 调用成功", res);
              console.log("文件数据=",res.data);
              if(callBack){
                callBack(res.data)
              }
            },
            fail(res) {
              console.log("readFile 调用失败", res.errMsg);
              if(callBack){
                callBack(null)
              }
            },
          });*/
        try {
            const data = fileSystemManager.readFileSync(
                this.playerDataFilePath,
                "utf8"
            );
            console.log("readFile 调用成功", data);
            if(callBack){
                callBack(data)
            }
        } catch (err) {
            console.log("调用失败", err);
            if(callBack){
                callBack(null)
            }
        }
    }

    savePlayerData(content, callBack){
        // @ts-ignore
        let fileSystemManager = tt.getFileSystemManager();
        fileSystemManager.writeFile({
            filePath:this.playerDataFilePath,
            encoding: "utf8",
            data: content,
            success(_res) {
              console.log("savePlayerData 调用成功");
              //const data = fileSystemManager.readFileSync(filePath);
              //console.log("写入的内容为:", data);
              if(callBack){
                callBack(true)
              }
            },
            fail(res) {
              console.log("savePlayerData 调用失败", res.errMsg);
              if(callBack){
                callBack(false, res.errMsg)
              }
            },
          });
    }
}
export const PlatformBytedance = new _PlatformBytedance();