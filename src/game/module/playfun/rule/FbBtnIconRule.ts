/**
 * Created by Administrator on 2016/8/3.
 */
class FbBtnIconRule extends RuleIconBase {

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			GameLogic.ins().postEnterMap,
			Actor.ins().postLevelChange,
			UserTask.ins().postUpdteTaskTrace,
		];

		this.updateMessage = [
			FbRedPoint.ins().postRedPoint,
		];
	}

	checkShowIcon(): boolean {
		return OpenSystem.ins().checkSysOpen(SystemType.FB)  && !UserFb.ins().pkGqboss;
	}

	checkShowRedPoint(): number {
		return FbRedPoint.ins().redpoint ? 1 : 0;
	}

	tapExecute(): void {
		ViewManager.ins().open(FbWin);
	}
}