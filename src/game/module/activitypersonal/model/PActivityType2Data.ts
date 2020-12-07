/**
 * 个人活动2类的数据
 */

class PActivityType2Data extends ActivityBaseData {
	public static LimitLevel:number = 50;//红点提示特殊限制等级
	public buyData: number[];
	public areabuyReward: number[];//展示没用上 为了数据对齐添加
	/** 全服购买次数 */
	public serverBuyData:number[];
	/** 全战区购买次数 */
	public areaBuyData:number[];//展示没用上 为了数据对齐添加
	public sumRMB: number;
	constructor(bytes: GameByteArray) {
		super(bytes);
		this.buyData = [];
		this.serverBuyData = [];
		this.initBuyData(bytes);
	}

	public update(bytes: GameByteArray): void {
		super.update(bytes);
		let id: number = bytes.readShort();
		let count: number = bytes.readInt();
		this.buyData[id] = count;//礼包已购买次数
		this.serverBuyData[id] = bytes.readInt(); //全服已购买次数
	}

	public initBuyData(bytes: GameByteArray){
		let count: number = bytes.readShort();
		for (let i: number = 1; i <= count; i++)//每一个礼包已购买次数
		{
			this.buyData[i] = bytes.readShort();
			this.serverBuyData[i] = bytes.readShort(); //全服购买次数
		}
		this.sumRMB = bytes.readInt();
	}

	public canReward(): boolean {
		// return this.isOpenActivity() && Activity.ins().getisCanBuyXianGou(this.id + "");
		//是否首冲
		// let rch:RechargeData = Recharge.ins().getRechargeData(0);
		// if( !rch.num ){
		// 	return false;
		// }
		//特殊需求 50级以前不要红点
		if( Actor.level < PActivityType2Data.LimitLevel )
			return false;

		//其中一个礼包达到可领取条件
		let activityData: PActivityType2Data;
		activityData = PActivity.ins().getActivityDataById(this.id) as PActivityType2Data;

		let config:PActivity2Config[] = GlobalConfig.PActivity2Config[this.id];
		var serverBuy:boolean = false; //全服限制
		for( let i in config ){
			let cfd:PActivity2Config = config[i];
			let isBuy:boolean = activityData.buyData[cfd.index] >= cfd.count?true:false;
			// serverBuy = this.serverBuyData[cfd.index] >= cfd.scount ? true : false;
			if ( !isBuy && activityData.sumRMB >= cfd.needRecharge && Actor.yb >= cfd.price && UserVip.ins().lv >= cfd.vip && !serverBuy) {
				return true;
			}
		}

		return false;
	}

	/** 用于配置了limitTime的活动 */
	// public  isSpecialOpen():boolean
	// {
	// 	let beganTime = Math.floor((DateUtils.formatMiniDateTime(this.startTime) - GameServer.serverTime) / 1000);
	// 	let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
	// 	let config:PActivity2Config = GlobalConfig.PActivity2Config[this.id][1];
	// 	var hours:number = Number(config.limitTime[0]);
	// 	var minutes:number = Number(config.limitTime[1]);
    //
	// 	if (beganTime + hours * 3600 + minutes * 60 < 0 && endedTime > 0) {
	// 		return true;
	// 	}
    //
	// 	return false;
	// }

	/** 获得假库存触发次数 */
	// public getSpecialStrikeTimes():number
	// {
	// 	let config:PActivity2Config = GlobalConfig.PActivity2Config[this.id][1];
	// 	var hours:number = Number(config.limitTime[0]);
	// 	var minutes:number = Number(config.limitTime[1]);
	// 	var times:number = (GameServer.serverTime - DateUtils.formatMiniDateTime(this.startTime) - hours * 3600000 - minutes * 60000) / 1000 / 240;
    //
	// 	return times > 0 ? times : 0;
	// }

	public isOpenActivity(): boolean {
		let beganTime = Math.floor((DateUtils.formatMiniDateTime(this.startTime) - GameServer.serverTime) / 1000);
		let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
		if (beganTime < 0 && endedTime > 0) {
			return true;
		}
		return false;
	}
	//是否显示活动图标
	public getHide():boolean{
		if( this.isHide )
			return this.isHide;
		let config:PActivity2Config[] = GlobalConfig.PActivity2Config[this.id];
		for (let i: number = 1; i < this.buyData.length; i++){//每一个礼包已购买次数
			let cfd:PActivity2Config = config[i];
			if( this.buyData[i] < cfd.count ){
				this.isHide = false;
				return this.isHide;
			}
		}
		this.isHide = true;
		return this.isHide;

	}

	//获取剩余时间(秒)
	public getLeftTime() {
		if(this.endTime) {
			let end_time = DateUtils.formatMiniDateTime(this.endTime)/1000;
			let leftTime = Math.floor((end_time - GameServer.serverTime)/1000);
			if(leftTime < 0) {
				leftTime = 0;
			}
			return leftTime;
		}
		return 0;
	}

	/** 距离限制开始的时间值 */
	public getSpecialOpenLeftTime() {
		// let beganTime = Math.floor((DateUtils.formatMiniDateTime(this.startTime) - GameServer.serverTime) / 1000);
		// let endedTime = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1000);
		// let config:PActivity2Config = GlobalConfig.PActivity2Config[this.id][1];
		// var hours:number = Number(config.limitTime[0]);
		// var minutes:number = Number(config.limitTime[1]);
		// beganTime += hours * 3600 + minutes * 60;
		// if (beganTime < 0 && endedTime > 0)
		// 	return beganTime;
        //
		// return 0;
	}
	/**个人活动无用 为了数据对齐*/
	public getAreaReward(index:number,zqindex:number){
		return 0;
	}
}

