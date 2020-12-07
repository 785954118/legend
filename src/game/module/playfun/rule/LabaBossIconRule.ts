/**
 * 腊八boss入口
 */
class LabaBossIconRule extends RuleIconBase {
	private alertText: eui.Label;
	private activityData:ActivityType20Data;
	private actId:number;
	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);
		//检测当前是否开启
		if( OpenSystem.ins().checkSysOpen(SystemType.LABA )) {
			this.activityData = Activity.ins().checkLabaBossData();
			if( !this.activityData )return;
			this.actId = this.activityData.id;
		}

		this.showMessage = [
			Activity.ins().postActivityIsGetAwards
		];
	}

	protected createTar(){
		let t = super.createTar();

		this.alertText = new eui.Label();
		// this.alertText.fontFamily = "黑体";
		this.alertText.size = 14;
		this.alertText.width = 120;
		this.alertText.textAlign = "center";
		this.alertText.textColor = 0x35e62d;
		this.alertText.horizontalCenter = 0;
		t.addChild(this.alertText);
		this.alertText.y = 70;

		if( this.activityData.isOpenActivity() && !this.activityData.IsEnd() ){
			if( !TimerManager.ins().isExists(this.runTime,this) ){
				TimerManager.ins().doTimer(1000, 0, this.runTime, this);
			}
			if( !TimerManager.ins().isExists(this.updateActivity,this) ){
				TimerManager.ins().doTimer(30000, 0, this.updateActivity, this);
			}
		}

		return t;
	}

	/**
	 * 由于活动流程都不是主动下发 是被动刷新
	 * 因此有可能存在有玩家野外在线挂机 一直没触发腊八 index数据仍然是旧数据 腊八boss数据更新后没收到
	 * 所以腊八活动期间每分钟请求获取一次最新腊八数据
	 * */
	private updateActivity(){
		if( this.activityData ){
			Activity.ins().sendChangePage(this.activityData.id);
		}
	}
	private runTime(): void {
		if( !this.actId )return;
		this.activityData = Activity.ins().getActivityDataById(this.actId) as ActivityType20Data;
		if( !this.activityData ){//当再一次获取的这个活动数据是空 活动结束了 服务器不下发
			TimerManager.ins().remove(this.runTime, this);
			TimerManager.ins().remove(this.updateActivity, this);
			return;
		}
		if( this.activityData.IsEnd() ){//当天全部Boss刷新完
			this.alertText.text = "今天刷新完";
			TimerManager.ins().remove(this.runTime, this);
			TimerManager.ins().remove(this.updateActivity, this);
			return;
		}
		let curTime = Math.floor(GameServer.serverTime/DateUtils.MS_PER_SECOND);
		let endTime = this.activityData.getEndTimer();
		if( curTime >= endTime ){
			//当前已结束 因为服务器会更新到下一个Index(最后一个的话会发下一天的第一个index) 活动期间客户端一分钟获取腊八boss数据
			this.alertText.text = `已结束`;
			return;
		}
		// let readyTime = this.activityData.getReadyTimer();
		let startTime = this.activityData.getStartTimer();
		// let endTime = this.activityData.getEndTimer();

		// if( curTime >= readyTime && curTime < startTime ){//预告时间
		// 	let time: number = startTime - curTime;
		// 	if (time >= 0) {
		// 		this.alertText.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_12)
		// 	}
		if( this.activityData.isGoIn ){//服务器进入标识
			this.alertText.text = `已刷新`;
		}else{
			let time: number = startTime - curTime;
			if (time > 0) {
				this.alertText.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_12)
			}else{
				this.alertText.text = `刷新中`;//刷新期间
			}
		}
	}

	checkShowIcon(): boolean {
		if( !OpenSystem.ins().checkSysOpen(SystemType.LABA ))return false;
		if( !this.activityData )return false;
		if( this.activityData.IsEnd() ){
			return false;
		}
		if( this.activityData.go2BossFb() ){
			return true;
		}
		return false;
	}

	checkShowRedPoint(): number {
		return 0;
	}

	tapExecute(): void {
		if( !this.activityData )return;
		if( this.activityData.IsEnd() ){
			UserTips.ins().showTips(`已经全部消灭，请期待下次！`);
			return;
		}
		if( this.activityData.go2BossFb() ){
			Activity.ins().sendReward(this.activityData.id,this.activityData.index);
		}else{
			UserTips.ins().showTips(`未到刷新时间`);
		}
	}
}