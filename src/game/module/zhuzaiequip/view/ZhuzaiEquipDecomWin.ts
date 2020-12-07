/**
 * Created by Administrator on 2016/7/28.
 */
class ZhuzaiEquipDecomWin extends BaseEuiView {
	/** 关闭按钮 */
	public closeBtn: eui.Button;
	public closeBtn0: eui.Button;

	constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();

		this.skinName = "ZhuzaiEquipDecomSkin";
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.closeBtn, this.onClick);
		this.addTouchEvent(this.closeBtn0, this.onClick);
	}

	public close(...param: any[]): void {
		this.removeTouchEvent(this.closeBtn, this.onClick);
		this.removeTouchEvent(this.closeBtn0, this.onClick);
	}

	private onClick(e: egret.TouchEvent): void {

		switch (e.currentTarget) {
			case this.closeBtn:
			case this.closeBtn0:
				ViewManager.ins().close(this);
				break;
		}
	}
}

ViewManager.ins().reg(ZhuzaiEquipDecomWin, LayerManager.UI_Main);