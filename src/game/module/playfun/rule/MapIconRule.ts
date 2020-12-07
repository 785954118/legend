/**
 * 关卡地图
 */
class MapIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = this.updateMessage = [
			Actor.ins().postLevelChange,
			UserFb.ins().postGuanqiaInfo,
			UserFb.ins().postGuanKaIdChange,
		];
	}

	checkShowIcon(): boolean {
		return OpenSystem.ins().checkSysOpen(SystemType.WORLDMAP);
	}

	checkShowRedPoint(): number {
		let preConfig: ChaptersRewardConfig = GlobalConfig.ChaptersRewardConfig[UserFb.ins().guanqiaReward - 1];
		let cfg: ChaptersRewardConfig = GlobalConfig.ChaptersRewardConfig[UserFb.ins().guanqiaReward];
		if (!cfg) {
			return 0
		}
		let needLevel: number = preConfig ? cfg.needLevel - preConfig.needLevel : cfg.needLevel;
		let curLevel: number = UserFb.ins().guanqiaID - (preConfig ? preConfig.needLevel : 0) - 1;
		if (curLevel >= needLevel)
			return 1;
		let config: WorldRewardConfig[] = GlobalConfig.WorldRewardConfig;
		for (let k in config) {
			if (UserFb.ins().guanqiaID > config[k].needLevel && !UserFb.ins().isGetReceiveBox(config[k].id)) {
				return 1;
			}
		}
		return 0;
	}

	tapExecute(): void {
		ViewManager.ins().open(GuanQiaWordMapWin);
	}
}