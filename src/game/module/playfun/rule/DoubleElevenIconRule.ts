class DoubleElevenIconRule extends RuleIconBase {

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
            Recharge.ins().postUpdateRecharge,
            Recharge.ins().postRechargeTotalDay,
            Recharge.ins().postUpdateRechargeEx,
            Activity.ins().postSpecials
        ];
    }

    checkShowIcon(): boolean {
        if (!OpenSystem.ins().checkSysOpen(SystemType.DOUBLEELEVEN)) {
            return false;
        }

        let data = Activity.ins().doubleElevenData;
        for (var k in data) {
            if (data[k].isOpenActivity())
                return true;
        }

        return false;
    }

    checkShowRedPoint(): number {
        let data = Activity.ins().doubleElevenData;
        for (var k in data) {
            let actData = data[k];
            if (actData.canReward()) {
                if (Activity.ins().doubleElevenSpecialIDs.indexOf(actData.id) != -1) {
                    if ((actData as ActivityType2Data).isSpecialOpen())
                        return 1;
                }
                else if (actData.isOpenActivity())
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
        ViewManager.ins().open(DoubleEleventWin);
        this.firstTap = false;
        this.update();
    }
}