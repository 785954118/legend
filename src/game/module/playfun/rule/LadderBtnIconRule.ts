class LadderBtnIconRule extends RuleIconBase {
	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			GameLogic.ins().postEnterMap,
			Actor.ins().postLevelChange,
			UserFb.ins().postGuanKaIdChange,
			UserTask.ins().postUpdteTaskTrace,
		];

		this.updateMessage = [
			Ladder.ins().postTadderChange,
			Encounter.ins().postEncounterDataChange,
			Mine.ins().postRedPoint,
			KFBattleRedPoint.ins().postRedPoint,
			UserFb.ins().postShowRedChange,
		];
	}

	checkShowIcon(): boolean {

		return (UserFb.ins().guanqiaID >= GlobalConfig.SkirmishBaseConfig.openLevel && !Encounter.ins().isGuiding && !UserFb.ins().pkGqboss);
	}

	checkShowRedPoint(): number {
		let num: number = Encounter.ins().isHasRed();
		if (num) {
			return num;
		}
		if (Ladder.ins().checkRedShow()) {
			return 1;
		}
		if (Mine.redpointCheck()) {
			return 1;
		}
		// if (KFBattleRedPoint.ins().postRedPoint()) {
		// 	return 1;
		// }

		if (UserFb.ins().checkTFRed())
			return 1;

		if (Hungu.ins().showHunShouRed())
			return 1;

		return 0;
	}

	getEffName(redPointNum: number): string {
		// return "";
		return undefined;
	}


	tapExecute(): void {
		ViewManager.ins().open(LadderWin, 0);
	}
}