/**
 * 排行榜
 */
class RankIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer = null) {
		super(id, t);

		this.showMessage = [
			Actor.ins().postLevelChange,
			UserFb.ins().postGuanqiaInfo,
			UserFb.ins().postGuanKaIdChange,
		];

		// this.updateMessage = [
		// 	Rank.ins().postAllPraiseData,
		// 	Rank.ins().postPraiseData
		// ];
	}

	checkShowIcon(): boolean {
		return OpenSystem.ins().checkSysOpen(SystemType.RANK);
	}

	checkShowRedPoint(): number {
		if (OpenSystem.ins().checkSysOpen(SystemType.RANK)) {
			return 0;
		} else {
			return Rank.ins().canPraiseInAll() ? 1 : 0;
		}
	}

	tapExecute(): void {
		ViewManager.ins().open(RankingWin);
	}
}