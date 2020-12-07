/**
 * Created by MPeter on 2018/1/15.
 * 副本系统-副本倒计时
 * 需要倒计时的副本，则要配置
 */
class FBCountDown extends BaseEuiView {
	private countDown: eui.BitmapLabel;
	private bgImg: eui.Image;

	private _count: number = 1;
	public constructor() {
		super();
		this.skinName = `FBCountDownSkin`;
	}
	public open(...args: any[]): void {
		switch (GameMap.fbType) {
			case UserFb.FB_TYPE_PEAKED://巅峰赛季副本
				// this._count = 5;
				if(args[0])this._count = args[0];
				this.bgImg.source = `peakness_start_fight`;
				break;
			default:
				return;
		}
		TimerManager.ins().doTimer(1000, this._count + 1, this.upFun, this);
		this.upFun();
	}
	public close(...args: any[]): void {
		TimerManager.ins().removeAll(this);
	}
	private upFun(): void {
		this.countDown.text = this._count + "";
		this._count--;
		if (this._count < 0) ViewManager.ins().close(FBCountDown);
	}
	public static openCheck(...param: any[]): boolean {
		switch (GameMap.fbType) {
			case UserFb.FB_TYPE_PEAKED://巅峰赛季副本
				break;
			default:
				return false;
		}
		return true;
	}

}

ViewManager.ins().reg(FBCountDown, LayerManager.UI_Popup);