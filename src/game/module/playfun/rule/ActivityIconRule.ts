/**
 * Created by wangzhong on 2016/7/20.
 */
class ActivityIconRule extends RuleIconBase {

    private firstTap: boolean = true;

    constructor(id: number, t: egret.DisplayObjectContainer) {
        super(id, t);

        this.showMessage = [
            Actor.ins().postLevelChange,
            UserFb.ins().postGuanqiaInfo,
            UserFb.ins().postGuanKaIdChange,

            Activity.ins().postActivityIsGetAwards,
            PActivity.ins().postActivityIsGetAwards
        ];

        this.updateMessage = [
            Actor.ins().postYbChange,
            Recharge.ins().postUpdateRecharge,
            Recharge.ins().postRechargeTotalDay,
            Recharge.ins().postUpdateRechargeEx,
            Activity.ins().postActivityIsGetAwards,
            PActivity.ins().postActivityIsGetAwards
        ];
    }

    protected createTar() {
        let tar = super.createTar();
        if (GameServer.serverOpenDay < 7) {
            if (tar) tar['icon'] = `zjmkaifu`;
        } else {
            if (tar) tar['icon'] = `zjmhuodong`;
        }
        return tar;
    }

    checkShowIcon(): boolean {

        if (GameServer.serverOpenDay < 7) {
            if (this.tar) this.tar['icon'] = `zjmkaifu`;
        } else {
            if (this.tar) this.tar['icon'] = `zjmhuodong`;
        }

        if (!OpenSystem.ins().checkSysOpen(SystemType.ACTIVITY)) {
            return false;
        }

        let data = Activity.ins().activityData;
        let sum: string[] = Object.keys(data);
        if (!sum.length)
            return false;
        for (let k in data) {
            let actData = data[k];
            if (!actData.pageStyle && actData.timeType != ActivityDataFactory.TimeType_Total) {
                if (actData.isOpenActivity() && !actData.getHide()) {
                    return true;
                }
            }
        }

        data = PActivity.ins().activityData;
        for (let k in data) {
            let actData = data[k];
            if (actData.isOpenActivity() && !actData.getHide()) {
                return true;
            }
        }

        return false;
    }

    checkShowRedPoint(): number {
        let data = Activity.ins().activityData;
        for (let k in data) {
            let actData = data[k];
            if (!actData.pageStyle && actData.timeType != ActivityDataFactory.TimeType_Total) {
                if (actData.isOpenActivity() && actData.canReward()) {
                    return 1;
                }
            }
        }
        data = PActivity.ins().activityData;
        for (let k in data) {
            let actData = data[k];
            if (actData.isOpenActivity() && actData.canReward()) {
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
        ViewManager.ins().open(ActivityWin);
        this.firstTap = false;
        this.update();
    }
}
