/**
 * Created by hrz on 2017/9/18.
 */

class FengceIconRule extends RuleIconBase {
    constructor(id, t) {
        super(id, t);
    }

    checkShowIcon(): boolean {
        return OpenSystem.ins().checkSysOpen(SystemType.FENGCE);
    }

    checkShowRedPoint(): number {
        return 0;
    }

    tapExecute(): void {
        ViewManager.ins().open(FengceActivityWin);
    }
}