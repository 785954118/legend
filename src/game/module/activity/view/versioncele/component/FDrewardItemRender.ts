/**
 * Created by wanghengshuai on 2018/3/16.
 *    版本活动 领奖进度子项
 */
class FDrewardItemRender extends BaseItemRender {

	public itemicon: ItemBase;
	public tsNeed: eui.Label;
	public arrow: eui.Image;
	public redpoint: eui.Image;
	public get: eui.Image;


	public constructor() {
		super();
		this.skinName = "FDrewardItem";
	}

	public childrenCreated(): void {
		super.childrenCreated();
		this.itemicon.touchChildren = false;
	}

	public dataChanged(): void {
		//{activityID:this.activityID, index:i, state:state, config:config};
		this.tsNeed.text = this.data.config.score + `狂欢值`;
		this.get.visible = this.data.state == 2;
		this.redpoint.visible = this.data.state == 1;
		this.arrow.source = this.data.state ? "fd_arrow2" : "fd_arrow1";

		let config: ActivityType11_1Config = this.data.config;
		this.itemicon.data = config.reward[0];
		this.itemicon.isShowName(false);
		this.itemicon.showNum(false);
		if (!this.hasEventListener(egret.TouchEvent.REMOVED_FROM_STAGE))
			this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRmove, this);

		if (!this.hasEventListener(egret.TouchEvent.TOUCH_TAP))
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.itemicon.touchEnabled = this.data.state != 1;
		this.itemicon.filters = this.data.state == 0 ? FilterUtil.ARRAY_GRAY_FILTER : null;
	}

	private onTouch(e: egret.TouchEvent): void {
		if (this.data.state == 1) {
			Activity.ins().sendReward(this.data.activityID, this.data.index, 1);
		}
	}

	private onRmove(e: egret.TouchEvent): void {
		this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRmove, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
}