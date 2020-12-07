/**
 * Created by Peach.T on 2017/12/6.
 */
class DoubleTwelveRechargeIconRule extends RuleIconBase {
    private firstTap: boolean = true;

    private alertText: eui.Label;
    private time: number = 0;

    public constructor(id: number, t: egret.DisplayObjectContainer) {
        super(id, t);

        this.showMessage = [
            Activity.ins().postActivityIsGetAwards,
            Actor.ins().postLevelChange
        ];

        this.updateMessage = [
            Activity.ins().postActivityIsGetAwards,
            Recharge.ins().postUpdateRecharge,
            Recharge.ins().postUpdateRechargeEx,
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

        return t;
    }

    private runTime(): void {
        let time = this.time;
        this.time -= 1;
        if (time > 0) {
            this.alertText.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_12)
        } else {
            this.alertText.text = "";
            TimerManager.ins().remove(this.runTime, this);
            this.updateShow();
        }
    }

    checkShowIcon(): boolean {
        if (!OpenSystem.ins().checkSysOpen(SystemType.DOUBLE_TWELVE_RECHARGE)) {
            return false;
        }
        let rechargeData = Activity.ins().doubleTwelveRechargeData;
        for (let k in rechargeData) {
            if (rechargeData[k].isOpenActivity()) {

                let data = rechargeData[Activity.ins().doubleTwelveRechargeIDAry[0]] as ActivityType3Data;
                if (data) {
                    TimerManager.ins().remove(this.runTime, this);
                    this.time = data.getLeftTime();
                    TimerManager.ins().doTimer(1000, 0, this.runTime, this);
                }
                return true;
            }
        }
        return false;
    }

    checkShowRedPoint(): number {
        let data = Activity.ins().doubleTwelveRechargeData;
        for (let k in data) {
            if (data[k].canReward()) {
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
        ViewManager.ins().open(DoubleTwelveRechargeWin);
        this.firstTap = false;
        this.update();
    }
}
