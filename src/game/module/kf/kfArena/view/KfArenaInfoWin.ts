/**
 * Created by MPeter on 2018/3/15.
 * 跨服3v3 竞技场数据面板
 */
class KfArenaInfoWin extends BaseEuiView {
	public bgClose: eui.Rect;
	public sureBtn: eui.Button;
	public list: eui.List;
	public blueScore: eui.BitmapLabel;
	public redScore: eui.BitmapLabel;


	private itemDt: eui.ArrayCollection;

	public constructor() {
		super();
		this.skinName = `KfArenaInfoSkin`;
	}

	protected childrenCreated(): void {
		this.list.itemRenderer = KfArenaDataItem;
		this.itemDt = new eui.ArrayCollection();
		this.list.dataProvider = this.itemDt;

	}

	public open(...param): void {
		this.addTouchEvent(this.bgClose, this.onTouch);
		this.addTouchEvent(this.sureBtn, this.onTouch);
		this.observe(KfArenaSys.ins().postRankInfo, this.updata);
		this.updata(param[0]);
	}


	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.bgClose:
			case this.sureBtn:
				ViewManager.ins().close(this);
				break;

		}
	}

	private updata(dt: KfArenaData[]): void {
		let modeSys: KfArenaSys = KfArenaSys.ins();
		this.blueScore.text = modeSys.scoreA + "";
		this.redScore.text = modeSys.scoreB + "";
		this.itemDt.replaceAll(dt);
	}
}
ViewManager.ins().reg(KfArenaInfoWin, LayerManager.UI_Popup);
