/**
 *立春活动奖励展示面板子项
 * @author wanghengshuai
*/
class ActivityStoreShowItemRender extends BaseItemRender{
	
	public itemIcon:ItemBase;
	public money:eui.Label;
	public moneyIcon:eui.Image;
	public discount:eui.Group;
	public discountbg:eui.Image;
	public discountNum:eui.Image;

	public constructor() {
		super();
		this.skinName = "activityStoreShowItem";
	}

	public dataChanged():void
	{
		//{type:number, id:number, count:number, cost:number, discountImg:number}
		this.discount.visible = this.data.discountImg > 0;
		if (this.discount.visible)
			this.discountNum.source = "discountNum" + this.data.discountImg;

		this.money.text = this.data.cost;
		this.itemIcon.data = this.data;

	}
}