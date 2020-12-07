/**
 * Created by hrz on 2017/12/28.
 */

class DesktopIconRule extends RuleIconBase {
    constructor(id:number, t) {
        super(id, t);

        this.showMessage = [
            PfActivity.ins().postGameDesktop
        ];
    }

    checkShowIcon(): boolean {
        return OpenSystem.ins().checkSysOpen(SystemType.FOCUS) && !!PfActivity.ins().isShowGameDesktop;
    }

    checkShowRedPoint(): number {
        return 0;
    }

    tapExecute(): void {
        PfActivity.ins().saveGameDesktop();
    }
}