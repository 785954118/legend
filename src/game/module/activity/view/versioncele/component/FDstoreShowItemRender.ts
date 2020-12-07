/**
 * Created by wanghengshuai on 2018/3/16.
 *    版本庆典 商城限购列表子项
 */
class FDstoreShowItemRender extends eui.Component {
	public itemImg: eui.Image;
	public limitCount: eui.Label;

	private itemID: number;

	public constructor() {
		super();
		this.skinName = "FDstoreShowItem";
	}

	public update(data: any): void {
		//{itemID:number, max:number, buy:number};
		this.itemID = data.itemID;
		this.itemImg.source = GlobalConfig.ItemConfig[data.itemID].icon + "_png";
		this.limitCount.textFlow = TextFlowMaker.generateTextFlow(`限购 ${data.buy}/${data.max}`);

		if (!this.hasEventListener(egret.TouchEvent.REMOVED_FROM_STAGE))
			this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRmove, this);

		if (!this.hasEventListener(egret.TouchEvent.TOUCH_TAP))
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	private onRmove(e: egret.TouchEvent): void {
		this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRmove, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	private onTouch(e: egret.TouchEvent): void {
		if (!this.itemID)
			return;

		ViewManager.ins().open(ItemDetailedWin, 0, this.itemID);
	}
}