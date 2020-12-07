class OSATarget2Panel1 extends BaseView {

	private _activityID: number;

	private actTime1:eui.Label;
	private actDesc:eui.Label;
	private gift:eui.List;
	private dataArr: eui.ArrayCollection;
	private _time:number = 0;
	public activityType:number;
	constructor() {
		super();
		//this.skinName = "OSADailyGiftSkin";
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.gift.itemRenderer = OSATargetItemRender1;
		// this.activityType = ActivityPanel.getActivityTypeFromId(this.activityID);
	}

	private setCurSkin():void
	{
		let aCon:ActivityConfig|PActivityConfig;
		if( this.activityType == ActivityType.Normal ) {
			aCon = GlobalConfig.ActivityConfig[this.activityID];
		}else if( this.activityType == ActivityType.Personal ){
			aCon = GlobalConfig.PActivityConfig[this.activityID];
		}

		if (aCon.pageSkin)
			this.skinName = aCon.pageSkin;
		else
			this.skinName = "OSADailyGiftSkin";
	}

	public get activityID():number
	{
		return this._activityID
	}

	public set activityID(value:number)
	{
		this._activityID = value;
		this.activityType = ActivityPanel.getActivityTypeFromId(this._activityID);
		this.setCurSkin();
	}

	public open(...param: any[]): void {
		this.setCurSkin();
		this.observe(Activity.ins().postRewardResult,this.GetCallBack);
		this.observe(PActivity.ins().postRewardResult,this.GetCallBack);
		TimerManager.ins().doTimer(1000,0,this.setTime,this);
		if( !this.dataArr ){
			this.dataArr = new eui.ArrayCollection;
			this.gift.dataProvider = this.dataArr;
		}

		this.updateData();
	}
	private setTime() {
		if(this._time > 0) {
			this._time -= 1;
			this.actTime1.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5, 3);
		}
	}
	public close(...param: any[]): void {
		// this.removeTouchEvent(this.buy, this.onTap);
		TimerManager.ins().removeAll(this);
		this.removeObserve();
	}
	private GetCallBack(activityID:number){
		this.updateData();
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {

		}
	}
	private updateData(){
		let activityData: ActivityType2Data|PActivityType2Data;
		let actcfg:ActivityConfig|PActivityConfig;
		let config:ActivityType2Config[]|PActivity2Config[];
		if( this.activityType == ActivityType.Normal ){
			activityData = Activity.ins().getActivityDataById(this.activityID) as ActivityType2Data;
			actcfg = GlobalConfig.ActivityConfig[this.activityID];
			config = GlobalConfig.ActivityType2Config[this.activityID];
		}else if( this.activityType == ActivityType.Personal ){
			activityData = PActivity.ins().getActivityDataById(this.activityID) as PActivityType2Data;
			actcfg = GlobalConfig.PActivityConfig[this.activityID];
			config = GlobalConfig.PActivity2Config[this.activityID];
		}

		let beganTime = Math.floor((DateUtils.formatMiniDateTime(activityData.startTime) - GameServer.serverTime) / 1000);
		let endedTime = Math.floor((DateUtils.formatMiniDateTime(activityData.endTime) - GameServer.serverTime) / 1000);
		if (beganTime >= 0) {
			this.actTime1.text = "活动未开启";
		} else if (endedTime <= 0) {
			this.actTime1.text = "活动已结束";
		} else {
			this._time = endedTime;
			if (this._time < 0) this._time = 0;
			this.actTime1.text = DateUtils.getFormatBySecond(endedTime, DateUtils.TIME_FORMAT_5, 3);
		}

		this.actDesc.text = actcfg.desc;

		let arrconfig:ActivityType2Config[]|PActivity2Config[] = [];
		for( let k in config ){
			arrconfig.push(config[k]);
		}
		this.dataArr.replaceAll(arrconfig);
		// this.gift.dataProvider = new eui.ArrayCollection(config);

	}


}