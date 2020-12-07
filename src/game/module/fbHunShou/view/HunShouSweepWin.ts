/**
 * 魂骨副本扫荡界面
 * @author wanghengshuai
 * 
 */
class HunShouSweepWin extends BaseEuiView{
	
	public bgClose:eui.Rect;
	public sweepTips:eui.Group;
	public sweepFb:eui.Label;
	public fbName:eui.Label;
	public rewardTimes:eui.Label;
	public times:eui.Label;
	public timesText:eui.Label;
	public title4:eui.Label;
	public reward:eui.List;
	public title:eui.Label;
	public closeBtn:eui.Button;
	public nextBtn:eui.Button;

	private _id:number;

	private _rewards:RewardData[];

	public constructor() {
		super();
		this.skinName = "hunshouSweepSkin";
	}

	public childrenCreated():void
	{
		super.childrenCreated();
		this.reward.itemRenderer = ItemBase;
	}

	public open(...args:any[]):void
	{
		this._id = args[0];
		this._rewards = args[1];
		
		this.addTouchEvent(this, this.onTouch);
		this.update();	
	}

	public close():void
	{
		this.removeTouchEvent(this, this.onTouch);
	}

	private update():void
	{
		this.reward.dataProvider = new ArrayCollection(this._rewards);
		this.times.textFlow = TextFlowMaker.generateTextFlow(`|c:${Hungu.ins().hunShouFBTimes ? 0x35E62B : 0xFF0000}&T:${Hungu.ins().hunShouFBTimes}|`);
		this.fbName.text = GlobalConfig.FsFbConfig[this._id].fbName;
	}

	private onTouch(e:egret.TouchEvent):void
	{
		switch(e.target)
		{
			case this.closeBtn:
			case this.bgClose:
				ViewManager.ins().close(this);
				break;
			case this.nextBtn:
				if (!Hungu.ins().hunShouFBTimes)
				{
					 UserTips.ins().showTips(`剩余次数不足`);
					return;
				}

				Hungu.ins().sweepHunShouFB();
				break;
		}
	}
}

ViewManager.ins().reg(HunShouSweepWin, LayerManager.UI_Popup);
