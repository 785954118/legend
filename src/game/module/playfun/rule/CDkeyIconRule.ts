class CDkeyIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);
		this.showMessage = [
			Actor.ins().postLevelChange,
			UserFb.ins().postGuanqiaInfo,
			UserFb.ins().postGuanKaIdChange,
		];

		this.updateMessage = [
			UserFuLi.ins().postMoneyInfoChange,
			Notice.ins().postGameNotice,
			DailyCheckIn.ins().postCheckInData,
			Activity.ins().postSevendayIsAwards,
			Recharge.ins().postFranchiseInfo,
			Activity.ins().postActivityIsGetAwards
		];
	}

	checkShowIcon(): boolean {
		return OpenSystem.ins().checkSysOpen(SystemType.FULI);
	}

	checkShowRedPoint(): number {
		if (DailyCheckIn.ins().showRedPoint() || Activity.ins().getSevenDayStast() || (Recharge.ins().franchise && Recharge.ins().franchiseget) || Activity.ins().checkNoticeRed()) {
			return 1;
		}
		return 0;
	}

	getEffName(redPointNum: number): string {
		return undefined;
	}

	tapExecute(): void {
		ViewManager.ins().open(FuliWin);
		this.update();
	}
}