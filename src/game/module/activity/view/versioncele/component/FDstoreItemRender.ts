/**
 * Created by wanghengshuai on 2018/3/16.
 *    版本庆典 商城子项
 */
class FDstoreItemRender extends BaseItemRender {
	public itemIcon: BaseComponent;
	public buyBtn: eui.Button;
	public discount: eui.Group;
	public limitCount: eui.Label;
	public cost: eui.Group;
	public costIcon: eui.Image;
	public money: eui.Label;

	public constructor() {
		super();
		this.skinName = "FDstoreItem";
	}

	public dataChanged(): void {
		//{data:items[i], activityID:this.activityID}
		let vo: SpringBeginShopVo = this.data.data;
		this.discount.visible = vo.buyMax > 0;
		this.limitCount.text = (vo.buyMax - vo.buyCount) + "";
		this.itemIcon.data = {type: 1, id: vo.itemID, count: vo.itemCount};
		this.costIcon.source = GlobalConfig.ItemConfig[GlobalConfig.ActivityType22_1Config[this.data.activityID][1].costItem].icon + "_png";
		this.money.text = "X" + vo.materialNum;

		if (!this.hasEventListener(egret.TouchEvent.REMOVED_FROM_STAGE))
			this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRmove, this);

		if (!this.hasEventListener(egret.TouchEvent.TOUCH_TAP))
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.buyBtn.label = this.data.data.state == 0 ? `购买` : `已购买`;
		this.buyBtn.enabled = this.data.data.state == 0;
	}

	private onRmove(e: egret.TouchEvent): void {
		this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRmove, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	private onTouch(e: egret.TouchEvent): void {
		if (e.target != this.buyBtn)
			return;

		let itemData: ItemData = UserBag.ins().getBagItemById(GlobalConfig.ActivityType22_1Config[this.data.activityID][1].costItem);
		let count: number = itemData ? itemData.count : 0;
		if (count >= this.data.data.materialNum)
			Activity.ins().sendReward(this.data.activityID, 0, 3, this.data.data.id)
		else
			UserTips.ins().showTips(`材料不足`);
	}
}