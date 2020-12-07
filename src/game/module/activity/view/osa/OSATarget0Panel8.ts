/**
 * //二次合服展示充值
 */
class OSATarget0Panel8 extends BaseView {
	private actTime1:eui.Label;
	private actDesc:eui.Label;
	private pay0:eui.Button;
	public activityID:number;
	private title:eui.Image;
	private _time:number = 0;
	constructor(...param: any[]) {
		super();
		this.skinName = "HeFuResetRechargeSkin";

	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.updateData();


	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.pay0, this.onTap);
		this.updateData();
		TimerManager.ins().doTimer(1000,0,this.setTime,this);

	}

	public close(...param: any[]): void {
		this.removeObserve();
		TimerManager.ins().removeAll(this);
	}


	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.pay0:
				let rdata:RechargeData = Recharge.ins().getRechargeData(0);
				if(!rdata || !rdata.num || rdata.num!=2  ){
					ViewManager.ins().open(Recharge1Win);
				}else{
					ViewManager.ins().open(ChargeFirstWin);
				}
				break;

		}


	}
	public updateData() {
		let activityData: ActivityType0Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType0Data;
		let beganTime = Math.floor(activityData.startTime/1000 - GameServer.serverTime / 1000);
		let endedTime = Math.floor(activityData.endTime/1000 - GameServer.serverTime / 1000);

		if (beganTime >= 0) {
			this.actTime1.text = "活动未开启";
		} else if (endedTime <= 0) {
			this.actTime1.text = "活动已结束";
		} else {
			this.actTime1.text = DateUtils.getFormatBySecond(endedTime, DateUtils.TIME_FORMAT_5, 3);
		}
		let btncfg:ActivityBtnConfig = GlobalConfig.ActivityBtnConfig[this.activityID];
		this.title.source = btncfg.title;
		this.actDesc.textFlow = TextFlowMaker.generateTextFlow1(btncfg.acDesc);
	}

	private setTime() {
		if(this._time > 0) {
			this._time -= 1;
			this.actTime1.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5, 3);
		}
	}
}