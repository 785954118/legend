/**
 * Created by hrz on 2017/6/26.
 */

class GuideArrow2 extends BaseEuiView {
    public bg: eui.Group;
    public lab: eui.Label;

    constructor(){
        super();
        this.skinName = "guideArrowSkin";
    }

    public setDirection(direction) {
        egret.Tween.removeTweens(this);
        this.x = 0;
        this.visible = true;
        if (direction == 1) {
            this.currentState = "right";
            egret.Tween.get(this, { loop: true }).to({ x: 40 }, 1000).to({ x: 0 }, 1000);
        }
        else {
            this.currentState = "left";
            egret.Tween.get(this, { loop: true }).to({ x: -40 }, 1000).to({ x: 0 }, 1000);
        }
    }

    public setTips(tips){
        this.lab.text = tips;
    }

    public removeTweens() {
        egret.Tween.removeTweens(this);
    }
}