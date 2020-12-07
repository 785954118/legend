/**
 *立春活动奖励展示面板
 * @author wanghengshuai
*/
class ActivityStoreRewardShowWin extends BaseEuiView{
	
	public bgClose:eui.Rect;
	public scroller:eui.Scroller;
	public shopList:eui.List;
	public tipGroup:eui.Group;

	private _activityID:number;

	public constructor() {
		super();
		this.skinName = "activityStoreRewardShowSkin";
		this.isTopLevel = true;
	}

	public childrenCreated():void
	{
		super.childrenCreated();
		this.shopList.itemRenderer = ActivityStoreShowItemRender;
	}

	public open(...args:any[]):void
	{
		this._activityID = args[0];
		this.update();
		this.addTouchEvent(this.bgClose, this.onTouch);
	}

	public close():void
	{
		this.removeTouchEvent(this.bgClose, this.onTouch);
	}

	private update():void
	{
		let config:ActivityType22_3Config = Activity.ins().getConfig22_3(this._activityID);
		this.shopList.dataProvider = new ArrayCollection(config ? config.showReward : null);
	}

	private onTouch(e:egret.TouchEvent):void
	{
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(ActivityStoreRewardShowWin, LayerManager.UI_Main);