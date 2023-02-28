import { sys } from "cc";
import { PlatformBytedance } from "../platform/PlatformBytedance";


export class _PlatformSystem {
    curPlatform

    init(){
        this.curPlatform = PlatformBytedance
        if(this.curPlatform){
            this.curPlatform.init()
        }
    }

    showVideo(success, fail?){
        if(this.curPlatform){
            this.curPlatform.showVideo(()=>{
                if(success){
                    success()
                }
            }, ()=>{
                if(fail){
                    fail()
                }
            })
        }else{
            success()
        }   
    }

    startRecorder(){
        console.log("录屏 startRecorder")
        if(this.curPlatform && this.curPlatform.startRecorder){
            this.curPlatform.startRecorder()
        }
    }

    hasShareVideo(){
        if(this.curPlatform && this.curPlatform.hasShareVideo){
            return this.curPlatform.hasShareVideo()
        }else{
            return false
        }
    }

    stopRecorder(){
        if(this.curPlatform && this.curPlatform.stopRecorder){
            this.curPlatform.stopRecorder()
        }
    }

    shareAppVideoMessage(success, fail?){
        if(this.curPlatform && this.curPlatform.shareAppVideoMessage){
            this.curPlatform.shareAppVideoMessage(success, fail)
        }
    }
}

export const PlatformSystem = new _PlatformSystem();