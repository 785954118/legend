/**
 * 双12活动 ICON
 * Created by Peach.T on 2017/12/6.
 */
class DoubleTwelveActivityIconRule extends RuleIconBase {
    private firstTap: boolean = true;

    public constructor(id: number, t: egret.DisplayObjectContainer) {
        super(id, t);

        this.showMessage = [
            Actor.ins().postLevelChange,
            Activity.ins().postActivityIsGetAwards,
        ];

        this.updateMessage = [
            Activity.ins().postActivityIsGetAwards,
        ];
    }

    checkShowIcon(): boolean {
        if (!OpenSystem.ins().checkSysOpen(SystemType.DOUBLE_TWELVE)) {
            return false;
        }
        let data = Activity.ins().doubleTwelveData;
        for (let k in data) {
            if (data[k].isOpenActivity())
                return true;
        }
        return false;
    }

    checkShowRedPoint(): number {
        let data = Activity.ins().doubleTwelveData;
        for (let i in data) {
            if (data[i].isOpenActivity() && data[i].type == 9) {
                for (let j = 0; j < 3; j++) {
                    if (Activity.ins().isGetRollReward(data[i].id, j))return 1;
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
        ViewManager.ins().open(DoubleTwelveWin);
        this.firstTap = false;
        this.update();
    }
}
