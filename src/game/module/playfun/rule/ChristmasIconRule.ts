/**
 * Created by hrz on 2017/12/17.
 */

class ChristmasIconRule extends RuleIconBase {
    private firstTap: boolean = true;

    public constructor(id: number, t: egret.DisplayObjectContainer) {
        super(id, t);

        this.showMessage = [
            Activity.ins().postActivityIsGetAwards,
            Actor.ins().postLevelChange
        ];

        this.updateMessage = [
            Activity.ins().postActivityIsGetAwards,
            Actor.ins().postYbChange,
        ];
    }

    checkShowIcon(): boolean {
        if (!OpenSystem.ins().checkSysOpen(SystemType.CHRISTMAS))
            return false;

        let data = Activity.ins().activityData;
        let sum: string[] = Object.keys(data);
        if (!sum || !sum.length)
            return false;

        for (let k in data) {
            let actData = data[k];
            if (actData.pageStyle == ActivityPageStyle.CHRISTMAS) {
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
            if (actData.pageStyle == ActivityPageStyle.CHRISTMAS) {
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
        ViewManager.ins().open(ChristmasDayWin);
        if (this.firstTap) {
            this.firstTap = false;
            this.update();
        }
    }
}