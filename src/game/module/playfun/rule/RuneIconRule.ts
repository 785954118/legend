/**
 * Created by Administrator on 2017/3/3.
 */
class RuneIconRule extends RuleIconBase {
	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			UserZs.ins().postZsData,
		];
	}

	checkShowIcon(): boolean {
		let otherCfg: RuneOtherConfig = RuneConfigMgr.ins().getOtherCfg();
		return UserZs.ins().lv >= otherCfg.zsLevel;
	}

	getEffName(): string {
		return undefined;
	}

	tapExecute(): void {
		let otherCfg: RuneOtherConfig = RuneConfigMgr.ins().getOtherCfg();
		let isOpen: boolean = UserZs.ins().lv >= otherCfg.zsLevel;
		if (!isOpen) {
			UserTips.ins().showTips(`${otherCfg.zsLevel}转开启战纹系统`);
			return;
		}
		ViewManager.ins().open(RuneWin);
	}
}