/**
 * Created by wangzhong on 2016/7/20.
 */
class SevenDayIconRule extends RuleIconBase {

	private firstTap: boolean = true;

	constructor(id:number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			Activity.ins().postSevendayIsAwards,
			Actor.ins().postLevelChange
		];

		this.updateMessage = [
			Activity.ins().postSevendayIsAwards,
		];
	}

	checkShowIcon(): boolean {
		return Actor.level >= 10 && Activity.ins().getSevenDayLogIsVisible();
	}

	checkShowRedPoint(): number {
		return Activity.ins().getSevenDayStast() ? 1 : 0;
	}

	getEffName(redPointNum: number): string {
		// if (this.firstTap || redPointNum) {
		// 	this.effX = 38;
		// 	this.effY = 38;
		// 	return "actIconCircle";
		// }
		return undefined;
	}


	tapExecute(): void {
		ViewManager.ins().open(SevenDayLogWin);
		this.firstTap = false;
		this.update();
	}
}