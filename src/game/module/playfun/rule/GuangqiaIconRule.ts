/**
 * Created by wangzhong on 2016/7/20.
 */
class GuangqiaIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			GameLogic.ins().postEnterMap,
			UserFb.ins().postGuanqiaInfo,
			UserFb.ins().postGuanKaIdChange,
			UserTask.ins().postUpdteTaskTrace,
			UserFb.ins().postAutoPk,//闯关
			UserFb.ins().postAutoPk2,//更新副本
		];
	}

	checkShowIcon(): boolean {
		return UserFb.ins().checkGuanqiaIconShow() && GameMap.sceneInMain();
	}

	// checkShowRedPoint(): number {
	// 	let config: ChaptersRewardConfig = GlobalConfig.ChaptersRewardConfig[UserFb.ins().guanqiaReward];
	// 	if (!config)
	// 		return 0;
	// 	let preConfig: ChaptersRewardConfig = GlobalConfig.ChaptersRewardConfig[UserFb.ins().guanqiaReward - 1];
	// 	let needLevel: number = preConfig ? config.needLevel - preConfig.needLevel : config.needLevel;
	// 	let curLevel: number = UserFb.ins().guanqiaID - (preConfig ? preConfig.needLevel : 0) - 1;
	// 	let state: number = curLevel >= needLevel ? 1 : 0;
	// 	return state || this.upDateGuanqiaWroldReward();
	// }

	private upDateGuanqiaWroldReward(): number {
		let boxPass = UserFb.ins().getWorldGuanQia();
		return UserFb.ins().isReceiveBox(boxPass) ? 1 : 0;
	}

	private canChallen: boolean = false;

	getEffName(redPointNum: number): string {
		let eff: string = "";

		// this.canChallen = UserFb.ins().isShowBossPK() && !UserFb.ins().bossIsChallenged;
		return eff;
	}

	tapExecute(): void {
		// if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
		// 	ViewManager.ins().open(BagFullTipsWin);
		// } else {
		// 	if (UserFb.ins().currentEnergy >= UserFb.ins().energy) {
		// 		this.cleanEff();
		// 		UserFb.ins().autoPk();
		// 		UserFb.ins().firstAutoGuilder = (UserFb.ins().guanqiaID == (UserFb.AUTO_GUANQIA - 1));
		// 	} else {
		// 		// UserTips.ins().showTips("|C:0xf3311e&T:能量不足|");
		// 	}
		//
		// }
	}
}