/**
 * Created by hrz on 2018/1/15.
 */

class YBZhuanPanIconRule extends RuleIconBase {
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
            Actor.ins().postYbChange,
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
                if (actData.pageStyle == ActivityPageStyle.YBZHUANPAN) {
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
        let actData: ActivityType10Data = data[this.activityId] as ActivityType10Data;
        if (!actData) {
            this.alertText.text = ``;
            return;
        }

        if (!actData.getLeftTime()) {
            this.removeTime();
        }

        let time: string = actData.getRemainTime();
        this.alertText.text = time;
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
            if (actData.pageStyle == ActivityPageStyle.YBZHUANPAN) {
                if (actData.isOpenActivity() && !actData.getHide()) {
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
            if (actData.pageStyle == ActivityPageStyle.YBZHUANPAN) {
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
        ViewManager.ins().open(YBZhuanPanWin);
        if (this.firstTap) {
            this.firstTap = false;
            this.update();
        }
    }
}