/**
 * Created by hrz on 2017/12/26.
 */
class BloodLabel extends BaseClass {
    private containers:BloodContainer[];
    private imgs:eui.Image[];

    private urlDic = {
        256:"wydEffectIcon",
        512:["j0z","j4z","j5z"],
    }

    constructor(){
        super();
        this.containers = [];
        this.imgs = [];
    }

    static ins():BloodLabel {
        return super.ins() as BloodLabel;
    }

    createBloodLabel(dtype:DamageTypes, num: number | string, type: string, offset: number = 0, offsetY:number = 0, job:number = 1) {
        let blood = this.getContainer();
        blood.createBlood(dtype, num, type, offset, offsetY, job);
        return blood;
    }

    getTypeUrl(_type:DamageTypes, job:number = 1):string {
        let url = this.urlDic[_type];
        if (url) {
            if(typeof url != "string") {
                return url[job-1];
            }
            return url;
        }

    }

    getImage():eui.Image {
        return this.imgs.pop() || new eui.Image();
    }

    getContainer():BloodContainer {
        return this.containers.pop() || new BloodContainer();
    }

    pushImage(img){
        if(img && this.imgs.indexOf(img) == -1)
            this.imgs.push(img);
    }

    pushContainer(container) {
        if(container && this.containers.indexOf(container) == -1)
            this.containers.push(container);
    }
}

class BloodContainer extends egret.DisplayObjectContainer {
    public bmpContainer:egret.DisplayObjectContainer;
    // public iconW:number = 30;
    // public iconH:number = 30;
    public offset:number = 3;
    constructor(){
        super();
    }

    createBlood(dtype:DamageTypes, num: number | string, type: string, offset: number = 0, offsetY:number = 0, job:number = 1) {
        if ( (dtype & DamageTypes.ZhuiMing) == DamageTypes.ZhuiMing )
            this.addImage(DamageTypes.ZhuiMing, job);
        if ( (dtype & DamageTypes.ZhiMing) == DamageTypes.ZhiMing )
            this.addImage(DamageTypes.ZhiMing, job);

        this.addBmpNumber(num, type, offset, offsetY);
        this.resetPosition();
    }

    addImage(dtype:DamageTypes, job:number = 1) {
        let url = BloodLabel.ins().getTypeUrl(dtype, job);
        if (!url) {
            console.log(`伤害类型:${dtype}未设置资源`);
            return;
        }
        let img = BloodLabel.ins().getImage();
        img.addEventListener(egret.Event.COMPLETE, this.onLoaded, this);
        img.width = NaN;
        img.height = NaN;
        img.source = url;
        this.addChild(img);
    }

    addBmpNumber(num: number | string, type: string, offset: number = 0, offsetY:number = 0) {
        if (this.bmpContainer) {
            BitmapNumber.ins().changeNum(this.bmpContainer, num, type, offset, offsetY);
        } else {
            this.bmpContainer = BitmapNumber.ins().createNumPic(num, type, offset, offsetY);
        }
        this.addChild(this.bmpContainer);
    }

    private onLoaded(e:egret.Event){
        let img = e.currentTarget as eui.Image;
        img.removeEventListener(egret.Event.COMPLETE, this.onLoaded, this);
        this.resetPosition();
    }

    private resetPosition(){
        let w = 0;
        let h = 0;
        let num = this.numChildren;
        for (let i = 0; i < num; i++) {
            let ch = this.getChildAt(i);
            ch.x = w;
            w += ch.width + this.offset;
            h = Math.max(h, ch.height);
        }
        for (let i = 0; i < num; i++) {
            let ch = this.getChildAt(i);
            ch.y = (h - ch.height)/2;
        }

        this.width = w - this.offset;
        this.height = h;
    }

    destroy() {
        while (this.numChildren) {
            let ch = this.removeChildAt(this.numChildren-1);
            if (ch instanceof eui.Image) {
                ch.removeEventListener(egret.Event.COMPLETE, this.onLoaded, this);
                BloodLabel.ins().pushImage(ch);
            } else if (ch instanceof egret.DisplayObjectContainer) {
                BitmapNumber.ins().desstroyNumPic(ch);
            }
        }
        this.bmpContainer = null;
        BloodLabel.ins().pushContainer(this);
    }

}