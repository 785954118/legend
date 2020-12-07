/**
 * Created by Administrator on 2016/7/21.
 */
class FirstRechargeIconRule extends RuleIconBase {
	private firstTap: boolean = true;
	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			Actor.ins().postLevelChange,
			UserFb.ins().postGuanqiaInfo,
			UserFb.ins().postGuanKaIdChange,
			Recharge.ins().postUpdateRecharge,
			Recharge.ins().postUpdateRechargeEx
		];

		this.updateMessage = [
			Recharge.ins().postUpdateRecharge,
			Recharge.ins().postUpdateRechargeEx
		];
	}

	protected createTar() {
		super.createTar();

		let data = Recharge.ins().getRechargeData(0);
		if( data.num !=2 )
			this.tar["icon"] = `zjmshouchong`;//首充
		else if(!data.isAwards)
			this.tar["icon"] = `zjmshouchong2`;//每日首充
		else
			this.tar["icon"] = `zjmlibao`;//每日礼包

		return this.tar;
	}

	checkShowIcon(): boolean {

		if(!OpenSystem.ins().checkSysOpen(SystemType.FIRSTCHARGE)) { return false;}

		if(Recharge.ins().getCurDailyRechargeIsAllGet()){
			return false;
		}

		if (this.tar) {
			let data = Recharge.ins().getRechargeData(0);
			if( data.num !=2 )
				this.tar["icon"] = `zjmshouchong`;//首充
			else if(!data.isAwards)
				this.tar["icon"] = `zjmshouchong2`;//每日首充
			else
				this.tar["icon"] = `zjmlibao`;//每日礼包
		}



		// let f = ()=>{
		// 	if( data.num !=2 || !data.isAwards ){
		// 		return true;
		// 	}else{
		// 		return false;
		// 	}
		// }
		// if( this.self == this.playPunView.rechargeBtn0 ){
		// 	return f();
		// } else {
		// 	return !f();
		// }
		return true;
	}

	checkShowRedPoint(): number {
		let count: number = 0;
		let data: RechargeData = Recharge.ins().getRechargeData(0);
		if (data.num == 1) {//可领取
			count = data.num;
		} else if (data.num == 2) {
			let config: any = Recharge.ins().getCurRechargeConfig();
			for (let k in config) {
				let state: number = ((data.isAwards >> config[k].index) & 1);
				if (state == 0 && data.curDayPay >= config[k].pay) {
					return 1;
				}
			}
		}
		return count;
	}

	getEffName(redPointNum: number): string {
		if (this.firstTap || redPointNum) {
			this.effX = 38;
			this.effY = 38;
			return "actIconCircle";
		}
		return undefined;
	}

	tapExecute(): void {
		let data = Recharge.ins().getRechargeData(0);
		if (data.num == 2) {
			ViewManager.ins().open(Recharge2Win);
		} else {
			ViewManager.ins().open(Recharge1Win);
		}
	}
}
