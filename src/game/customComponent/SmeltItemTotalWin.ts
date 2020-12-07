
/**熔炼道具窗口*/
class SmeltItemTotalWin extends BaseEuiView {
	private equip: SmeltItemNormalPanel;
	private bgClose: eui.Rect;
	constructor() {
		super();
		this.skinName = "hunguRongluSkin";
		this.isTopLevel = true;
	}

	public initUI(): void {
		super.initUI();
	}

	public open(...param: any[]): void {
		this.equip.open(param[0]);
		this.addTouchEvent(this.bgClose, this.onTap);
	}

	public close(...param: any[]): void {
		this.equip.close();
	}
	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.bgClose:
				ViewManager.ins().close(this);
				break
		}
	}
}
ViewManager.ins().reg(SmeltItemTotalWin, LayerManager.UI_Popup);