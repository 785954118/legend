/**
 * Created by hrz on 2018/3/7.
 */

class ShieldWin extends BaseEuiView {
    private shieldBtn:eui.ToggleButton;
    constructor(){
        super();
        this.skinName = `shieldSkin`;
    }

    open() {
        this.addTouchEvent(this.shieldBtn, this.onTap);
        this.touchEnabled = false;

        this.shieldBtn.selected = !EntityHideBody.ins().isShow;
    }

    private onTap(e:egret.TouchEvent) {
        EntityHideBody.ins().setShowState(!this.shieldBtn.selected);
    }
}

ViewManager.ins().reg(ShieldWin, LayerManager.UI_Main);