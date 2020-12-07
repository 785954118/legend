/**
 * Created by hujinheng on 2017/11/20
 */
class ThanksIconRule extends RuleIconBase {

    private firstTap: boolean = true;

    constructor(id: number, t: egret.DisplayObjectContainer) {
        super(id, t);
        this.showMessage = [
            Actor.ins().postLevelChange,
            UserFb.ins().postGuanqiaInfo,
            UserFb.ins().postGuanKaIdChange,
            Activity.ins().postActivityIsGetAwards,
        ];

        this.updateMessage = [
            Activity.ins().postActivityIsGetAwards,
            Actor.ins().postYbChange,
            Recharge.ins().postUpdateRecharge,
            Recharge.ins().postRechargeTotalDay,
            Recharge.ins().postUpdateRechargeEx
        ];
    }

    checkShowIcon(): boolean {
        if (!OpenSystem.ins().checkSysOpen(SystemType.THANKS)) return false;

        let data = Activity.ins().activityData;
        let sum: string[] = Object.keys(data);
        if (!sum.length)
            return false;
        for (let k in data) {
            let actData = data[k];
            if (actData.pageStyle == ActivityPageStyle.THANKS) {
                if (actData.isOpenActivity()) {
                    return true;
                }
            }
        }

        return false;
    }

    checkShowRedPoint(): number {
        let data = Activity.ins().activityData;
        for (let k in data) {
            let actData = data[k];
            if (actData.pageStyle == ActivityPageStyle.THANKS) {
                if (actData.isOpenActivity() && actData.canReward() && actData.specialState()) {
                    return 1;
                }
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
        ViewManager.ins().open(ThanksGivingWin);
        this.firstTap = false;
        this.update();
    }
}
