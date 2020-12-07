class GameNoticePanle extends BaseView {

	public desc: eui.Label;
	public title: eui.Label;
	public updataReward:eui.Group;
	public reward:eui.List;
	public gengxinfuli:eui.Label;
	public suerBtn:eui.Button;
	public redPoint:eui.Image;
	public yilingqu:eui.Label;

	private _cfg:WelfareConfig;

	private _collect:ArrayCollection;

	constructor() {
		super();
		this.skinName = "gameNoticeSkin";
	}

	public childrenCreated():void
	{
		super.childrenCreated();
		this.reward.itemRenderer = ItemBase;
	}

	public open(...param: any[]): void {
		let str: string = GlobalConfig.HelpInfoConfig[5].text;
		let strList: string[] = str.split("_");
		this.title.textFlow = TextFlowMaker.generateTextFlow(strList[0]);
		this.desc.textFlow = TextFlowMaker.generateTextFlow(window['game_notice'] || strList[1]);

		if (UserFuLi.ins().isOpenNotice) {
			UserFuLi.ins().isOpenNotice = false;
			Notice.ins().postGameNotice();
			Notice.ins().setNoticeOPen();
		}

		this.observe(Activity.ins().postActivityIsGetAwards, this.update);
		this.addTouchEvent(this, this.onTouch);
		this.update();
	}

	private update():void
	{
		this._cfg = GlobalConfig.WelfareConfig[4];
		let activity:ActivityType1Data = Activity.ins().getActivityDataById(this._cfg.activityId ? this._cfg.activityId : 0) as ActivityType1Data;
		if (activity)
		{
			this.updataReward.visible = true;
			this.suerBtn.enabled = activity.canReward();
			this.redPoint.visible = this.suerBtn.enabled;
			if (activity.getRewardStateById(1) == Activity.Geted)
			{
				this.yilingqu.visible = true;
				this.suerBtn.visible = false;
			}
			else
			{
				this.yilingqu.visible = false;
				this.suerBtn.visible = true;
			}

			if (!this._collect)
			{
				this._collect = new ArrayCollection();
				this.reward.dataProvider = this._collect;
			}

			this._collect.source = GlobalConfig.ActivityType1Config[this._cfg.activityId][1].rewards;
		}
		else
			this.updataReward.visible = false;
	}

	public close(...param: any[]): void {
		this.removeObserve();
		this.removeTouchEvent(this, this.onTouch);
	}

	private onTouch(e:egret.TouchEvent):void
	{
		switch (e.target)
		{
			case this.suerBtn:
				Activity.ins().sendReward(this._cfg.activityId, 1);
				break;
		}	
	}
}