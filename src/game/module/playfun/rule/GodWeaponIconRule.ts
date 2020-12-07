class GodWeaponIconRule extends RuleIconBase {

	public constructor(id:number, t:egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			UserZs.ins().postZsLv,
			Actor.ins().postLevelChange,
			GameApp.ins().postZeroInit
		];

		this.updateMessage = [
			GodWeaponRedPoint.ins().postGodWeapon,
		];
	}

	checkShowRedPoint(): number {
		let num: number = GodWeaponRedPoint.ins().godWeaponRed ? 1 : 0;
		return num;
	}

	checkShowIcon(): boolean {
		if (Actor.level >= GlobalConfig.GodWeaponBaseConfig.noticeOpenLv && (GameServer.serverOpenDay >= GlobalConfig.GodWeaponBaseConfig.openDay)) {
			return true;
		} else {
			return false;
		}
	}

	tapExecute(): void {
		ViewManager.ins().open(GodWeaponWin);
	}
}