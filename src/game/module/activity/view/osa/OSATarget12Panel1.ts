class OSATarget12Panel1 extends BaseView {

	private _activityID: number;

	private actTime:eui.Label;
	private actInfo:eui.Label;
	private actPoint:eui.Label;
	private list:eui.List;
	private dataArr: eui.ArrayCollection;
	private _time:number = 0;
	public activityType:number;
	private onbtn:eui.Button;
	private actId:number;
	private index:number;
	private hongbao:XiaoNianItem;
	private redPoint:eui.Image;
	private leftBtn:eui.Button;
	private rightBtn:eui.Button;
	constructor() {
		super();

	}

	protected childrenCreated(): void {
		super.childrenCreated();

	}

	private setCurSkin():void
	{
		let aCon:ActivityConfig = GlobalConfig.ActivityConfig[this.activityID];
		if (aCon.pageSkin)
			this.skinName = aCon.pageSkin;
		else
			this.skinName = "XNHongBaoSkin";
	}

	public get activityID():number
	{
		return this._activityID
	}

	public set activityID(value:number)
	{
		this._activityID = value;
		// this.activityType = ActivityPanel.getActivityTypeFromId(this._activityID);
		this.setCurSkin();
	}

	public close(...param: any[]): void {
		TimerManager.ins().removeAll(this);
		this.removeObserve();
	}
	public open(...param: any[]): void {
		// this.setCurSkin();
		// this.observe(Activity.ins().postRewardResult,this.GetCallBack);//发放红包返回
		this.observe(Activity.ins().postChangePage,this.updateLogs);//请求logs数据
		this.addTouchEvent(this.onbtn,this.onTap);
		this.addTouchEvent(this.leftBtn,this.onTap);
		this.addTouchEvent(this.rightBtn,this.onTap);
		TimerManager.ins().doTimer(1000,0,this.setTime,this);
		if( !this.dataArr ){
			this.list.itemRenderer = XiaoNianListRenderer;
			this.dataArr = new eui.ArrayCollection;
			this.list.dataProvider = this.dataArr;
		}
		this.index = this.getRuleIndex();

		this.updateData();
		this.updateLogs();
	}
	private getRuleIndex():number{
		let index = 1;
		let activityData: ActivityType12Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType12Data;
		for( let k in GlobalConfig.ActivityType12Config[this.activityID] ){
			if( activityData.score >=  GlobalConfig.ActivityType12Config[this.activityID][k].score ){
				index = GlobalConfig.ActivityType12Config[this.activityID][k].index;
			}
		}
		return index;
	}

	private GetCallBack(activityID:number){
		if( activityID != this.activityID )return;
		this.updateData();
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.onbtn:
				let activityData: ActivityType12Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType12Data;
				if( !activityData.isOpenActivity() ){
					UserTips.ins().showTips(`活动已结束`);
					return;
				}
				let config:ActivityType12Config[] = GlobalConfig.ActivityType12Config[this.activityID];
				if( config && config[this.index] ){
					if( activityData.score >= config[this.index].score )
						ViewManager.ins().open(HongBaoSpeak,this.activityID,this.index);
					else
						UserTips.ins().showTips(`积分不足`);
				}
				break;
			case this.leftBtn:
				if( this.index <= 1 )return;
				this.index--;
				this.updateBtn();
				break;
			case this.rightBtn:
				if( this.index >= CommonUtils.getObjectLength(GlobalConfig.ActivityType12Config[this.activityID]) )return;
				this.index++;
				this.updateBtn();
				break;
		}
	}
	private updateBtn(){
		if( this.index == 1 ){
			this.leftBtn.visible = false;
			this.rightBtn.visible = true;
		}else if( this.index == CommonUtils.getObjectLength(GlobalConfig.ActivityType12Config[this.activityID]) ){
			this.leftBtn.visible = true;
			this.rightBtn.visible = false;
		}else{
			this.leftBtn.visible = this.rightBtn.visible = true;
		}
		let config:ActivityType12Config = GlobalConfig.ActivityType12Config[this.activityID][this.index];
		this.hongbao.data = config.skinType;
		let activityData: ActivityType12Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType12Data;
		this.redPoint.visible = activityData.score>=config.score;
	}
	private updateLogs(){
		let arr = [];
		let activityData: ActivityType12Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType12Data;
		this.actPoint.text = activityData.score + "";
		for( let i = activityData.logs.length-1; i >=0 ;i-- ){
			let config:ActivityType12Config = GlobalConfig.ActivityType12Config[this.activityID][activityData.logs[i].index];
			let serverName = window['getServerName'](activityData.logs[i].serverId)
			let roleName = `[${serverName}].${activityData.logs[i].name}`;
			let str = StringUtils.replace(config.record,roleName);
			arr.push(str);
		}
		this.dataArr.replaceAll(arr)
	}
	private updateData(){
		let activityData: ActivityType12Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType12Data;
		let actcfg:ActivityConfig = GlobalConfig.ActivityConfig[this.activityID];
		let beganTime = Math.floor((DateUtils.formatMiniDateTime(activityData.startTime) - GameServer.serverTime) / 1000);
		let endedTime = Math.floor((DateUtils.formatMiniDateTime(activityData.endTime) - GameServer.serverTime) / 1000);
		if (beganTime >= 0) {
			this.actTime.text = "活动未开启";
		} else if (endedTime <= 0) {
			this.actTime.text = "活动已结束";
		} else {
			this._time = endedTime;
			if (this._time < 0) this._time = 0;
			this.actTime.text = DateUtils.getFormatBySecond(endedTime, DateUtils.TIME_FORMAT_5, 3);
		}

		this.actInfo.text = actcfg.desc;


		this.updateBtn();
	}
	private setTime() {
		if(this._time > 0) {
			this._time -= 1;
			this.actTime.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5, 3);
		}
	}

}