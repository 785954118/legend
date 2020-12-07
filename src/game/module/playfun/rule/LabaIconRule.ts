/**
 * Created by hjh on 2018/1/15.
 */
class LabaIconRule extends RuleIconBase {
    private firstTap: boolean = true;

    public constructor(id: number, t: egret.DisplayObjectContainer) {
        super(id, t);

        this.showMessage = [
            Activity.ins().postActivityIsGetAwards,
            Actor.ins().postLevelChange
        ];

        this.updateMessage = [
            Activity.ins().postActivityIsGetAwards,
        ];
    }

    checkShowIcon(): boolean {
        if (!OpenSystem.ins().checkSysOpen(SystemType.LABA))return false;
        let data = Activity.ins().activityData;
        for (let k in data) {
            let actData = data[k];
            if (actData.pageStyle == ActivityPageStyle.LABA) {
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
            if (actData.pageStyle == ActivityPageStyle.LABA) {
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
        if (!OpenSystem.ins().checkSysOpen(SystemType.LABA))return;
        ViewManager.ins().open(LabaWin);
        if (this.firstTap) {
            this.firstTap = false;
            this.update();
        }
    }
}