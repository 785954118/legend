class MaBiIconRule extends RuleIconBase {
	private firstTap: boolean = true;
	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			Actor.ins().postLevelChange,
			UserVip.ins().postUpdateVipAwards,
		];

		this.updateMessage = [
			UserVip.ins().postUpdataExp,
		];
	}

	checkShowIcon(): boolean {
		return OpenSystem.ins().checkSysOpen(SystemType.MABI) && !(UserVip.ins().state >> 2 & 1);

	}

	checkShowRedPoint(): number {
		return UserVip.ins().lv >= 3 ? 1 : 0;
	}

	getEffName(redPointNum: number): string {
		if (this.firstTap) {
			this.effX = 38;
			this.effY = 38;
			return "actIconCircle";
		}
		return undefined;
	}

	tapExecute(): void {
		this.firstTap = false;
		this.update();

		ViewManager.ins().open(Vip3MWin,3);

	}
}