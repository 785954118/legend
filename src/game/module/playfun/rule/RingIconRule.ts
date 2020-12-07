/**
 * 特戒
 */
class RingIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			Actor.ins().postLevelChange,
			UserFb.ins().postGuanqiaInfo,
			UserFb.ins().postGuanKaIdChange,
			SpecialRing.ins().postActiveRing,
		];

		this.updateMessage = [
			SpecialRing.ins().postActiveRing,
			UserBag.ins().postItemDel,
			UserBag.ins().postItemAdd
		];
	}

	checkShowIcon(): boolean {
		let b = OpenSystem.ins().checkSysOpen(SystemType.RING);
		if (b) {
			//没全部激活
			let maxCount = Object.keys(GlobalConfig.ActorExRingConfig).length;
			b = SpecialRing.ins().ringActiNum < maxCount;
		}
		return b;
	}

	checkShowRedPoint(): number {
		let flag: boolean = SpecialRing.ins().checkHaveUpRing();
		if (flag)
			return 1;
		return 0;
	}

	getEffName() {
		// if (this.checkShowRedPoint()) {
		// 	this.effX = 38;
		// 	this.effY = 38;
		// 	return "actIconCircle";
		// }
		return undefined;
	}

	tapExecute(): void {
		if (SpecialRing.ins().checkRingOpen()) {
			ViewManager.ins().open(RingInfoView);
		} else {
			UserTips.ins().showTips(`激活神器 神龙之戒 后开启`);
		}
	}
}