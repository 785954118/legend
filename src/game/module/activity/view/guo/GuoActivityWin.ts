
class GuoActivityWin extends BaseEuiView {

    private bgClose:eui.Rect;
    constructor(){
        super();
        this.skinName = `guoqingjie`;

    }

    open(...params:any[]) {
        this.addTouchEvent(this.bgClose, this.onTap);

    }



    private onTap(e:egret.TouchEvent) {
        ViewManager.ins().close(this);

    }

}

ViewManager.ins().reg(GuoActivityWin,LayerManager.UI_Popup);