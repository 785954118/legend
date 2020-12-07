/**
 * Created by MPeter on 2017/12/15.
 * 跨服-巅峰赛季图标规则
 */

class PeakedIconRule extends RuleIconBase {
    constructor(id:number, t: egret.DisplayObjectContainer) {
        super(id, t);

        this.showMessage = [
            Actor.ins().postLevelChange,
            UserFb.ins().postGuanqiaInfo,
            UserFb.ins().postGuanKaIdChange,
            SpecialRing.ins().postActiveRing,
            //跨天要校验是否显示
            GameApp.ins().postZeroInit,
            UserZs.ins().postZsLv
        ];

        this.updateMessage = [
            PeakedRedpoint.ins().postRedPoint,
        ];
    }
    update(): void {
        super.update();
        if (this.tar[`txt`]) {
            if (PeakedSys.ins().isKf()) {
                if (PeakedSys.ins().kfStatusIsEnd && PeakedSys.ins().kfStatus < KF_PeakStatus.Finals) {
                    this.tar[`txt`].text = PeakedData.STATE_KF_ICON_CN[PeakedSys.ins().kfStatus + 1];
                }
                else {
                    this.tar[`txt`].text = PeakedData.STATE_KF_ICON_CN[PeakedSys.ins().kfStatus];
                }
            }
            else {
                if (PeakedSys.ins().bfStatusIsEnd && PeakedSys.ins().bfStatus < BF_PeakStatus.Finals) {
                    this.tar[`txt`].text = PeakedData.STATE_ICON_CN[PeakedSys.ins().bfStatus + 1];
                }
                else {
                    this.tar[`txt`].text = PeakedData.STATE_ICON_CN[PeakedSys.ins().bfStatus];
                }
            }
        }
    }
    checkShowIcon(): boolean {
        return PeakedSys.ins().isOpen();
    }

    checkShowRedPoint(): number {
        return PeakedRedpoint.ins().redpoint;
    }

    tapExecute(): void {
        ViewManager.ins().open(PeakedMainWin);
    }
}