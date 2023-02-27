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
}

export const PlatformSystem = new _PlatformSystem();