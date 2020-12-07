/**
 * Created by MPeter on 2018/3/12.
 * 跨服3v3竞技场- 结算界面
 */
class KfArenaResultWin extends BaseEuiView {
	public bgClose: eui.Rect;
	public sureBtn: eui.Button;
	public list: eui.List;
	public blueScore: eui.BitmapLabel;
	public redScore: eui.BitmapLabel;
	public leaveInfo: eui.Label;
	public extrReward: eui.List;

	private quitTime: number;

	public constructor() {
		super();
		this.skinName = `KfArenaResultSkin`;

	}

	protected childrenCreated(): void {
		this.extrReward.itemRenderer = ItemBase;
		this.list.itemRenderer = KfArenaDataItem;
	}

	public open(...param): void {
		this.addTouchEvent(this.bgClose, this.onTouch);
		this.addTouchEvent(this.sureBtn, this.onTouch);

		this.blueScore.text = param[0];
		this.redScore.text = param[1];

		this.list.dataProvider = new eui.ArrayCollection(param[2]);
		this.extrReward.dataProvider = new eui.ArrayCollection(param[3]);

		TimerManager.ins().doTimer(1000, this.quitTime, this.onTime, this);
	}


	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.bgClose:
			case this.sureBtn:
				this.onExit();
				break;

		}
	}

	private onTime(): void {
		if (this.quitTime > 0) {
			this.quitTime--;
			this.leaveInfo.text = `${this.quitTime}s后自动离开战场`;
		}
		else {
			this.onExit();
		}
	}

	private onExit(): void {
		ViewManager.ins().close(this);
		UserFb.ins().sendExitFb();
	}
}

ViewManager.ins().reg(KfArenaResultWin, LayerManager.UI_Popup);
