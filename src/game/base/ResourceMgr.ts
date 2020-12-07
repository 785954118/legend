/**
 * Created by hrz on 2018/1/25.
 */

class ResourceMgr extends BaseSystem {
    private isFirstEnter: boolean = true;

    private resDisTime: any = {};

    constructor() {
        super();

        this.observe(GameLogic.ins().postEnterMap, this.destroy);
    }

    static ins(): ResourceMgr {
        return super.ins() as ResourceMgr;
    }

    private start() {
        //5分钟清理一次
        TimerManager.ins().doTimer(60000 * 5, 0, this.destroy, this);
    }

    private isDelayDestroy: boolean = false;

    private destroy() {
        if (!this.isFirstEnter) {
            // ViewManager.ins().destroyAllNotShowView();
            this.destroyRes();
        } else {
            this.isFirstEnter = false;
            this.start();
        }
    }


    public destroyWin() {
        // ViewManager.ins().destroyAllNotShowView();
        this.destroyUIRes();
    }

    public disposeResTime(hashCode: number) {
        this.resDisTime[hashCode] = egret.getTimer();
    }

    @callDelay(3000)
    private destroyRes() {
        let baseAnalyzer = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE);
        let fileDic = baseAnalyzer['fileDic'];

        let t = egret.getTimer();
        // let bit:number = 0;//释放字节
        for (let key in fileDic) {
            if (key.indexOf(RES_DIR) < 0) continue;

            let texture = fileDic[key];
            if (this.checkMcCanDestroy(texture.bitmapData) && this.checkCanDestroy(texture)) {
                // bit += texture.bitmapData.width * texture.bitmapData.height * 4;
                RES.destroyRes(key);
            }

            if (egret.getTimer() - t > 3) {
                break;
            }
        }

        // console.log("time:"+(egret.getTimer() - t), "bit:"+bit);
    }

    @callDelay(3000)
    private destroyUIRes() {
        let baseAnalyzer = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE);
        let fileDic = baseAnalyzer['fileDic'];

        let baseJson = RES.getAnalyzer(RES.ResourceItem.TYPE_JSON);
        let resConfig: RES.ResourceConfig = baseJson["resourceConfig"];
        let t = egret.getTimer();
        // let bit:number = 0;//释放字节
        for (let key in fileDic) {
            let json = resConfig.getRawResourceItem(key);
            if (json && json.url.indexOf("image/public/") >= 0) {
                continue;
            }

            if (key.indexOf(MAP_DIR) >= 0 || (key.indexOf(RES_DIR) >= 0 && key.indexOf(RES_DIR_EFF) < 0)) continue;

            let texture: egret.Texture = fileDic[key];

            if (this.checkCanDestroy(texture) && this.checkMcCanDestroy(texture.bitmapData)) {
                // bit += texture.bitmapData.width * texture.bitmapData.height * 4;
                RES.destroyRes(key);
            }

            if (egret.getTimer() - t > 3) {
                break;
            }
        }

        // console.log("time:"+(egret.getTimer() - t), "bit:"+bit);

    }

    public checkBitmapSize() {
        let baseAnalyzer = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE);
        let fileDic = baseAnalyzer['fileDic'];
        let bit: number = 0;
        for (let key in fileDic) {
            let texture: egret.Texture = baseAnalyzer.getRes(key);
            bit += texture.bitmapData.width * texture.bitmapData.height * 4;
        }
        console.log("bit:" + bit);
        return bit;
    }

    private checkCanDestroy(bitmapData: egret.Texture) {
        let hashCode: number;
        if ((<egret.Texture>bitmapData).bitmapData && (<egret.Texture>bitmapData).bitmapData.hashCode) {
            hashCode = (<egret.Texture>bitmapData).bitmapData.hashCode;
        }
        else {
            hashCode = bitmapData.hashCode;
        }
        if (!hashCode) {
            return false;
        }
        let arr = egret.BitmapData['_displayList'][hashCode];
        if (!arr || !arr.length) {
            if (!this.resDisTime[hashCode])
                return true;
            if ((egret.getTimer() - this.resDisTime[hashCode]) > 2500) {
                delete egret.BitmapData['_displayList'][hashCode];
                delete this.resDisTime[hashCode];
                return true;
            }

        }
        return false;
    }

    private checkMcCanDestroy(bitmapData: egret.BitmapData) {
        if (!bitmapData) return false;
        let hashCode = bitmapData.hashCode;
        let arr = MovieClip.displayList[hashCode];
        if (!arr || !arr.length) {
            if (!this.resDisTime[hashCode])
                return true;
            if ((egret.getTimer() - this.resDisTime[hashCode]) > 2500) {
                delete MovieClip.displayList[hashCode];
                delete this.resDisTime[hashCode];
                return true;
            }

        }
        return false;
    }

    public reloadContainer(obj: egret.DisplayObjectContainer) {
        let num = obj.numChildren;
        for (let i = 0; i < num; i++) {
            let img = obj.getChildAt(i);
            if (img instanceof eui.Image) {
                this.reloadImg(img);
            } else if (img instanceof egret.DisplayObjectContainer) {
                this.reloadContainer(img);
            }
        }
    }

    public reloadImg(image: eui.Image) {
        let source = image.source;
        if (source) {
            if (image.texture && image.texture.bitmapData)
                return;

            image.source = null;
            image.source = source;
        }
    }
}

namespace GameSystem {
    export let resourceMgr = ResourceMgr.ins.bind(ResourceMgr);
}