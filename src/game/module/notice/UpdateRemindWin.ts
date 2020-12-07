/**
 * Created by wanghengshuai on 2018/3/14.
 *版本更新通知界面
 */
class UpdateRemindWin extends BaseEuiView {
	public bgClose: eui.Rect;
	public img: eui.Image;
	public btn: eui.Button;

	public constructor() {
		super();
		this.skinName = "updateRemindSkin";
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	public open(...param: any[]): void {
		this.addTouchEndEvent(this, this.onTouch);

		let skin: string = param[0];
		if (skin && skin != this.skinName)
			this.skinName = skin;
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.bgClose:
			case this.btn:
				ViewManager.ins().close(this);
				if (e.target == this.btn)
					ViewManager.ins().open(FuliWin, 4);
				break;
		}
	}
}

ViewManager.ins().reg(UpdateRemindWin, LayerManager.UI_Popup)

