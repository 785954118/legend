/**
 * Created by wanghengshuai on 2018/3/15.
 *    版本庆典活动入口
 */
class VersionCeleIconRule extends RuleIconBase {
	private firstTap: boolean = true;

	public constructor(id: number, t: egret.DisplayObjectContainer) {
		super(id, t);

		this.showMessage = [
			Activity.ins().postActivityIsGetAwards,
			Actor.ins().postLevelChange,
		];

		this.updateMessage = [
			Activity.ins().postActivityIsGetAwards,
			Actor.ins().postYbChange,
			UserBag.ins().postItemAdd,
			UserBag.ins().postItemChange,
			UserBag.ins().postItemDel
		];
	}

	checkShowIcon(): boolean {
		if (!OpenSystem.ins().checkSysOpen(SystemType.VERSIONCEL))
			return false;

		let data = Activity.ins().activityData;
		let sum: string[] = Object.keys(data);
		if (!sum || !sum.length)
			return false;

		for (let k in data) {
			let actData = data[k];
			if (actData.pageStyle == ActivityPageStyle.VERSIONCELE) {
				if (actData.isOpenActivity() && !actData.getHide())
					return true;
			}
		}

		return false;
	}

	checkShowRedPoint(): number {
		let data = Activity.ins().activityData;
		for (let k in data) {
			let actData = data[k];
			if (actData.pageStyle == ActivityPageStyle.VERSIONCELE) {
				if (actData.isOpenActivity() && actData.canReward() && !actData.getHide())
					return 1;
			}
		}

		return 0;
	}

	getEffName(redPointNum: number): string {
		if (this.firstTap || redPointNum) {
			this.effX = 38;
			this.effY = 38;
			return "actIconCircle";
		}
		return undefined;
	}

	tapExecute(): void {
		ViewManager.ins().open(VersionCeleWin);
		if (this.firstTap) {
			this.firstTap = false;
			this.update();
		}
	}
}