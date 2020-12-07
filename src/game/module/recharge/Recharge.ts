/**首冲、累积充值 */
class Recharge extends BaseSystem {

	private _rechargeData: RechargeData[] = [];//0首充 1累积充值
	public costList: number;
	public flag: number = 0; //1未开启 2开启
	public forevetCard: number = 0;
	public rechargeTotal: { totalDay: number, hasGetDays: number[] };//总累计充值天数，已领取的累积天数
	public constructor() {
		super();

		this.sysId = PackageID.Recharge;
		this.regNetMsg(1, this.postRecharge1Data);
		this.regNetMsg(2, this.changeRecharge1Data);
		this.regNetMsg(6, this.getRecharge2Data);
		this.regNetMsg(7, this.changeRecharge2Data);
		this.regNetMsg(8, this.postUpDataItem);
		this.regNetMsg(9, this.postRechargeTotalDay);//下发42天累冲奖励


		// this.regNetMsg(10, this.postUpDataItem);
		this.regNetMsg(20, this.postGetMonthDay);

		this.regNetMsg(11, this.postFranchiseInfo);
		this.regNetMsg(12, this.postMuchDayRecReward);
	}

	public static ins(): Recharge {
		return super.ins() as Recharge;
	}

	/**获取充值数据 RechargeData*/
	public getRechargeData(index: number = -1): any {
		return index == -1 ? this._rechargeData : (this._rechargeData[index] || new RechargeData());
	}

	/**获取当前充值**/
	public getCurRechargeConfig(): DailyRechargeConfig[] | LoopRechargeConfig[] {
		let rch: RechargeData = this.getRechargeData(0);
		let len = CommonUtils.getObjectLength(GlobalConfig.DailyRechargeConfig);
		if (rch.day <= len) {
			return GlobalConfig.DailyRechargeConfig[rch.day];
		} else {
			let loopDay = rch.day - len;
			len = CommonUtils.getObjectLength(GlobalConfig.LoopRechargeConfig);
			loopDay = loopDay % len || len;
			return GlobalConfig.LoopRechargeConfig[loopDay];
		}
	}

	//每日冲是否领完
	public getCurDailyRechargeIsAllGet() {
		let data: RechargeData = Recharge.ins().getRechargeData(0);
		let config: any = Recharge.ins().getCurRechargeConfig();
		let len = CommonUtils.getObjectLength(config);
		for (let i = 0; i < len; i++) {
			let boo2 = ((data.isAwards >> i) & 1) ? true : false;
			if (!boo2) return false;
		}
		return true;
	}

	/**
	 * 请求领取充值奖励
	 * 27-2或27-7
	 * @param type 领取类型
	 */
	public sendGetAwards(type: number, id: number) {
		let bytes: GameByteArray = this.getBytes(type == 0 ? 2 : 7);
		bytes.writeShort(id);
		this.sendToServer(bytes);
	}

	/**
	 * 获取充值1数据
	 * 27-1
	 */
	public postRecharge1Data(bytes: GameByteArray) {
		this.recharge(bytes, 0);
	}



	/**
	 * 更新充值1数据
	 * 27-2
	 */
	public changeRecharge1Data() {
		let bytes: GameByteArray = this.getBytes(2);
		this.sendToServer(bytes);
		// let data = this.getRechargeData(0);
		// if (data) {
		// 	data.change(bytes);
		// 	Recharge.postUpdateRecharge(0);
		// }
	}
	public postUpdateRechargeEx(param?: number) {
		return { type: param };
	}
	public postUpdateRecharge(param?: number) {
		return param;
	}

	/**
	 * 领取每日充值奖励
	 * 27-3
	 */
	public getDayReward(index: number) {
		let bytes: GameByteArray = this.getBytes(3);
		bytes.writeShort(index);
		this.sendToServer(bytes);
	}

	/**
	 * 获取充值2数据
	 * 27-6
	 */
	public getRecharge2Data(bytes: GameByteArray) {
		// this.recharge(bytes, 1);

	}

	/**
	 * 更新充值2数据
	 * 27-7
	 */
	public changeRecharge2Data(bytes: GameByteArray) {
		let data = this.getRechargeData(1);
		if (data) {
			data.change(bytes);
			Recharge.ins().postUpdateRecharge(1);
		}
	}

	/**
	 * 获取累计充值奖励（42天）
	 * 27-8
	 * @param index
	 */
	public getRechargeTotalAward(index: number) {
		let bytes: GameByteArray = this.getBytes(8);
		bytes.writeShort(index);
		this.sendToServer(bytes);
	}

	public recharge_type = 0;
	private recharge(bytes: GameByteArray, type: number): void {
		if (!this._rechargeData[type])
			this._rechargeData[type] = new RechargeData;

		this._rechargeData[type].parser(bytes, type);

		if (type == 0) {
			let boo2 = Recharge.ins().getCurDailyRechargeIsAllGet();

			if (boo2) ViewManager.ins().close(Recharge2Win);
		}

		Recharge.ins().postUpdateRechargeEx(type);
		this.recharge_type = type;
	}

	/**
	 * 充值套餐充值记录 是否第一次充值（按位获取）
	 * 27-8
	 *
	 */
	public postUpDataItem(bytes: GameByteArray): void {
		this.costList = bytes.readInt();
	}

	/**
	 * 累计充值天数
	 * 27-9
 	 */
	public postRechargeTotalDay(bytes: GameByteArray): void {
		this.rechargeTotal = {} as any;
		this.rechargeTotal.hasGetDays = [];

		let len = bytes.readShort();
		for (let i = 0; i < len; i++) {
			this.rechargeTotal.hasGetDays.push(bytes.readShort());
		}
		this.rechargeTotal.totalDay = bytes.readShort();
	}


	/**
	 * 月卡剩余天数
	 * 27-10
	 */
	public postGetMonthDay(bytes: GameByteArray): void {
		let leftTime: number = bytes.readUnsignedInt()
		if (leftTime > 0) {
			this.monthDay = leftTime;// * 1000 + egret.getTimer();
		} else {
			this.monthDay = 0;
		}
		if (leftTime > 0) this.flag = 2;
		this.forevetCard = bytes.readInt();
		//检查月卡是否第一次购买
		if (!Setting.ins().getValue(ClientSet.firstMonthCard) && (this.monthDay > 0 || this.getIsForeve()))
			Setting.ins().setValue(ClientSet.firstMonthCard, 1)
	}

	public getOrderByIndex(index: number = 0): number {
		let num: number = (this.costList >> index) & 1;
		return num;
	}

	private _monthDay: number;

	public set monthDay(value: number) {
		if (this._monthDay != value) {
			this._monthDay = value;
			TimerManager.ins().remove(this.downTime, this);
			if (this._monthDay > 0) {
				TimerManager.ins().doTimer(1000, this._monthDay, this.downTime, this);
			}
		}
	}

	public get monthDay(): number {
		return this._monthDay;
	}

	downTime(): void {
		this._monthDay -= 1;
	}

	getAddBagGrid(): number {
		return this.monthDay > 0 ? 100 : 0;
		// return 0;
	}

	getAddBagFranchiseGrid(): number {
		return this.franchise > 0 ? 100 : 0;
		// return 0;
	}

	public showReCharge(money: number,yuanbao:number,activityid:number): void {
		if(!activityid){
			activityid = 0
		}
		if (!OpenSystem.ins().checkSysOpen(SystemType.FIRSTCHARGE)) {
			UserTips.ins().showTips(`充值已屏蔽`);
			return;
		}
		ViewManager.ins().open(payWin, {money:money,yuanbao:yuanbao,activityid:activityid});
	}

	public getIsForeve(): boolean {
		return Recharge.ins().forevetCard == 2;
	}

	/*********特权*********/
	private _franchise: number;
	public franchiseflag: number = 0; //1未开启 2开启
	public franchiseget: number = 0;//每日领取威望 1:可领取 0:已领取
	public firstBuy: number = 0;//是否购买过特权 1:未购买过 0:已购买过
	/**
	 * 领取特权奖励
	 * 27-10
	 */
	public sendGetFranchise() {
		this.sendBaseProto(10);
	}

	/**
	 * 特权剩余天数
	 * 27-11
	 */
	public postFranchiseInfo(bytes: GameByteArray): void {
		let leftTime: number = bytes.readUnsignedInt();
		if (leftTime > 0) {
			this.franchise = leftTime;// * 1000 + egret.getTimer();
		} else {
			this.franchise = 0;
		}
		this.franchiseget = bytes.readByte();
		//检查特权是否购买过
		this.firstBuy = bytes.readByte();
	}
	public set franchise(value: number) {
		if (this._franchise != value) {
			this._franchise = value;
			TimerManager.ins().remove(this.franchiseTime, this);
			if (this._franchise > 0) {
				TimerManager.ins().doTimer(1000, this._franchise, this.franchiseTime, this);
			}
		}
	}

	public get franchise(): number {
		return this._franchise;
	}

	franchiseTime(): void {
		this._franchise -= 1;
	}

	/**
	 * 获取列表累充列表
	 * */
	public getRechargeList() {
		let configs = GlobalConfig.RechargeDaysAwardsConfig;
		let list = [];
		let rechargeMap = {};
		let rechargeMapSum = {};
		//按套分类
		for (let i in configs) {
			if (!rechargeMap[configs[i].sum])
				rechargeMap[configs[i].sum] = [];
			if (!rechargeMapSum[configs[i].sum])
				rechargeMapSum[configs[i].sum] = 0;
			//统计每一类领奖次数
			if (Recharge.ins().rechargeTotal.hasGetDays.indexOf(configs[i].id) >= 0) {
				rechargeMapSum[configs[i].sum]++;
			}
			rechargeMap[configs[i].sum].push(configs[i]);
		}
		for (let i in rechargeMapSum) {
			if (list.length) break;
			if (rechargeMapSum[i] >= CommonUtils.getObjectLength(rechargeMap[i])) {
				continue;
			}
			for (let j in rechargeMap[i]) {
				list.push(rechargeMap[i][j]);
			}
		}
		return list;
	}
	/******* 多日连充*************/
	//今日充值金额
	public mRecNum: number;
	//今日奖励是否领取 0否 1是
	public mReward: number;
	//当前第几天充值
	public mDayNum: number;
	/**
	 * 请求领取多日连充奖励
	 * 27-11
	 */
	public sendMuchDayRecReward(): void {
		this.sendBaseProto(11);
	}
	/**
	 * 下发多日连充基本数据
	 * 27-12
	 */
	public postMuchDayRecReward(bytes: GameByteArray): void {
		this.mRecNum = bytes.readInt();
		this.mReward = bytes.readByte();
		this.mDayNum = bytes.readShort();
	}

}

class RechargeData {
	public day: number;		  //开服第几天
	public isFirst: number;	 //是否显示首充
	public curDayPay: number;//当日累充
	public num: number;		 //首充奖励是否领取 0不可领取，1可以领取，2已领取 0和1显示首冲 2显示其他充值
	public isAwards: number;	//每日充值奖励，按位读取

	public parser(bytes: GameByteArray, type: number): void {
		this.day = bytes.readShort() + 1;
		// this.isFirst = bytes.readByte();
		this.curDayPay = bytes.readInt();
		this.num = bytes.readInt();
		this.isAwards = bytes.readInt();
		// egret.log("开服第几天 = "+this.day);
		// egret.log("当日累充 = "+this.curDayPay);
		// egret.log("首充奖励是否领取 = "+this.num);
		// egret.log("每日充值奖励，按位读取 = "+this.isAwards);
	}

	public change(bytes: GameByteArray): void {
		this.num = bytes.readInt();
		this.isAwards = bytes.readInt();
	}

	public static checkOpenWin() {
		let rdata: RechargeData = Recharge.ins().getRechargeData(0);
		if (!rdata || !rdata.num) {
			ViewManager.ins().open(Recharge1Win);
		} else {
			ViewManager.ins().open(ChargeFirstWin);
		}
	}
}

namespace GameSystem {
	export let recharge = Recharge.ins.bind(Recharge);
}