/**
 * Created by Peach.T on 2017/11/1.
 */
class RingDetailPanel extends BaseEuiView {
    public bgClose: eui.Rect;
    public anigroup: eui.Group;
    public bg: eui.Image;
    public bg0: eui.Image;
    public closeBtn: eui.Button;
    public attrGroup: eui.Group;
    public attrName: eui.Label;
    public attrValue: eui.Label;

    public constructor() {
        super();
        this.skinName = `LYRAttrSkin`;
        this.isTopLevel = true;//设为1级UI
    }

    public open(...param: any[]): void {
        let attrs = param[0];
        this.attrValue.text = AttributeData.getAttStr(attrs, 0, 1, "    ", false, false);
        this.addTouchEndEvent(this.bgClose, this.otherClose);
    }

    private otherClose(evt: egret.TouchEvent) {
        ViewManager.ins().close(this);
    }
}

ViewManager.ins().reg(RingDetailPanel, LayerManager.UI_Popup);



