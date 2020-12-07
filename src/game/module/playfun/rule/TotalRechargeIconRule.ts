/**
 * Created by hrz on 2017/12/25.
 */

class TotalRechargeIconRule extends RuleIconBase {
    private firstTap: boolean = true;
    private alertText: eui.Label;
    private activityId: number = 0;

    constructor(id: number, t: egret.DisplayObjectContainer) {
        super(id, t);

        this.showMessage = [
            Activity.ins().postActivityIsGetAwards,
            Actor.ins().postLevelChange
        ];

        this.updateMessage = [
            Activity.ins().postActivityIsGetAwards,
            Recharge.ins().postUpdateRecharge,
        ];
    }

    protected createTar() {
        let t = super.createTar();
        this.alertText = new eui.Label();
        // this.alertText.fontFamily = "黑体";
        this.alertText.size = 14;
        this.alertText.width = 120;
        this.alertText.textAlign = "center";
        this.alertText.textColor = 0x35e62d;
        this.alertText.horizontalCenter = 0;
        t.addChild(this.alertText);
        this.alertText.y = 70;

        this.runTime();
        this.addTime();

        return t;
    }

    private addTime() {
        TimerManager.ins().doTimer(1000, 0, this.runTime, this);
    }

    private removeTime() {
        TimerManager.ins().remove(this.runTime, this);
    }

    private runTime(): void {
        let data = Activity.ins().activityData;
        if (!this.activityId) {
            for (let k in data) {
                let actData = data[k];
                if (actData.pageStyle == ActivityPageStyle.TOTALRECHARGE) {
                    if (actData.isOpenActivity() && !actData.getHide()) {
                        this.activityId = +k;
                        break;
                    }
                }
            }
        }
        if (!this.activityId) {
            this.alertText.text = ``;
            return;
        }
        let actData: ActivityType3Data = data[this.activityId] as ActivityType3Data;
        if (!actData) {
            this.alertText.text = ``;
            return;
        }
        let time: number = actData.getLeftTime();
        if (time > 0) {
            this.alertText.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_12)
        } else {
            let panel: PlayFunView = ViewManager.ins().getView(PlayFunView) as PlayFunView;
            if (panel) {
                this.removeTime();
                this.update();
            }

            //this.alertText.text = "活动结束";
            //this.update();
        }
    }

    checkShowIcon(): boolean {
        this.removeTime();
        if (!OpenSystem.ins().checkSysOpen(SystemType.DOUBLE_TWELVE_RECHARGE))
            return false;

        let data = Activity.ins().activityData;
        let sum: string[] = Object.keys(data);
        if (!sum || !sum.length)
            return false;

        for (let k in data) {
            let actData = data[k];
            if (actData.pageStyle == ActivityPageStyle.TOTALRECHARGE) {
                if (actData.isOpenActivity() && !actData.getHide()) {
                    this.activityId = +k;
                    let data3: ActivityType3Data = data[this.activityId] as ActivityType3Data;
                    if (data3.getLeftTime() > 0) {
                        this.addTime();
                        return true;
                    }
                }
            }
        }

        return false;
    }

    checkShowRedPoint(): number {
        let data = Activity.ins().activityData;
        for (let k in data) {
            let actData = data[k];
            if (actData.pageStyle == ActivityPageStyle.TOTALRECHARGE) {
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
        ViewManager.ins().open(TotalRechargeWin);
        if (this.firstTap) {
            this.firstTap = false;
            this.update();
        }
    }
}