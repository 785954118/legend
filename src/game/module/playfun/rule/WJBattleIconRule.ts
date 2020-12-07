/**
 * Created by MPeter on 2017/12/15.
 * 无极战场图标规则类
 */

class WJBattleIconRule extends RuleIconBase {
    constructor(id:number, t: egret.DisplayObjectContainer) {
        super(id, t);

        // this.showMessage = [
        //     WJBattlefieldSys.ins().postStateInfo,
        //     WJBattlefieldSys.ins().postInfo,
        // ];
        // this.updateMessage = [
        //     KFBattleRedPoint.ins().postRedPoint1
        // ]
    }

    checkShowIcon(): boolean {
        // if (!WJBattlefieldSys.ins().isOpen) return false;
        // if (!OpenSystem.ins().checkSysOpen(SystemType.VIPGIFT)) {
        //     return false;
        // }

        return WJBattlefieldSys.ins().isOpen;
    }

    checkShowRedPoint(): number {
      
        return KFBattleRedPoint.ins().redPoint1;
    }

    tapExecute(): void {
        ViewManager.ins().open(WJBattlefieldWin);
    }
}