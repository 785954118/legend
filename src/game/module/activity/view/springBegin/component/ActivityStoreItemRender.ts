/**
 * 立春活动
 * @author wanghengshuai
*/
class ActivityStoreItemRender extends BaseItemRender{
	
	public itemIcon:ItemBase;
	public buyBtn:eui.Button;
	public money:eui.Label;
	public moneyIcon:eui.Image;
	public discount:eui.Group;
	public discountbg:eui.Image;
	public discountNum:eui.Image;
	public yuanbao:eui.Group;
	public jifen:eui.Group;
	public jifenxiaohao:eui.Label;
	public jifenNum:eui.Label;


	public constructor() {
		super();
		this.skinName = "activityStoreItem";
	}

	public dataChanged():void
	{
		//{data:items[i], isScore:this.currentState == "integralStore", activityID:this.activityID}
		this.buyBtn.label = this.data.isScore ? "兑 换" : "购 买";
		this.discount.visible = !this.data.isScore && this.data.data.discount;
		if (this.discount.visible)
			this.discountNum.source = "discountNum" + this.data.data.discount;

		this.itemIcon.data = {type:1, id:this.data.data.itemID, count:this.data.data.itemCount};

		this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRmove, this);
		this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		if (!this.data.isScore)
		{
			this.buyBtn.enabled = this.data.data.state == 0;
			this.yuanbao.visible = true;
			this.jifen.visible = false;
			this.money.text = this.data.data.price; 
		}
		else
		{
			this.buyBtn.enabled = true;
			this.yuanbao.visible = false;
			this.jifen.visible = true;
			this.jifenNum.text = this.data.data.score; 
		}
	}

	private onRmove(e:TouchEvent):void
	{
		this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.onRmove, this);
		this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	private onTouch(e:TouchEvent):void
	{
		let data: ActivityType22Data = Activity.ins().activityData[this.data.activityID] as ActivityType22Data;
		if (this.data.isScore)
		{
			if (data.tScore < this.data.data.score)
				UserTips.ins().showTips(`|C:0xf3311e&T:积分不足|`);
			else
				Activity.ins().sendReward(this.data.activityID, 0, 4, this.data.data.id);  
		}
		else
		{
			if (Actor.yb < this.data.data.price)
				UserTips.ins().showTips(`|C:0xf3311e&T:元宝不足|`);
			else
				Activity.ins().sendReward(this.data.activityID, 0, 3, this.data.data.id);  
		}
	}
}