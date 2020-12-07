/**
 * Created by hjh on 2018/1/16.
 */

class LabaRewardTips extends BaseEuiView {
	private list0: eui.List;
	private bgClose: eui.Rect;
	private activity: ActivityType20Data;

	constructor() {
		super();
		this.skinName = "LaBaRankRewardskin";

	}

	public destoryView(): void {
		super.destoryView();

	}

	public initUI(): void {
		super.initUI();

	}

	public open(...param: any[]): void {
		this.list0.itemRenderer = LaBaRewardItemItemRender;
		this.addTouchEvent(this.bgClose, this.onClick);
		this.activity = param[0];
		this.updateView();
	}

	private onClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.bgClose:
				ViewManager.ins().close(this);
				break;
		}
	}

	private updateView() {
		if (!this.activity) return;
		let config: ActivityType20Config = GlobalConfig.ActivityType20Config[this.activity.id][this.activity.index];
		let arr: { config: ActivityType20Config, index: number }[] = [];
		for (let i = 0; i < config.rankReward.length; i++) {
			arr.push({config: config, index: i});
		}
		this.list0.dataProvider = new eui.ArrayCollection(arr);
	}


}

ViewManager.ins().reg(LabaRewardTips, LayerManager.UI_Popup);