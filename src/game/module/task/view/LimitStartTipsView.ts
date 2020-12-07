/**
 * Created by hrz on 2017/6/13.
 */

class LimitStartTipsView extends BaseEuiView {
    private btn:eui.Button;
    constructor(){
        super();
        this.skinName = 'LimitStartTipsSkin';
        this.isTopLevel = true;
        this.name = `限时任务开始`;
    }

    open() {
        this.addTouchEvent(this.btn, this.onStart);
    }

    close() {
        super.close();
    }

    private onStart() {
        ViewManager.ins().close(LimitStartTipsView);
        ViewManager.ins().open(LimitTaskView);
    }
}

ViewManager.ins().reg(LimitStartTipsView, LayerManager.UI_Popup);