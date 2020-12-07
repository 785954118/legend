/**
 * Created by hrz on 2018/3/1.
 */

class FuncNoticeIconRule extends RuleIconBase {
    private funcNoticeLastLv: number = 0;
    constructor(id:number) {
        super(id);

        this.showMessage = [
            UserFb.ins().postGuanKaIdChange
        ];
    }

    checkShowIcon() {
        let lv: number = UserFb.ins().guanqiaID;
        let config = FuncNoticeWin.getFuncNoticeConfigById(lv);
        if (!config) return false;

        let bool = (config.openLv - lv <= 10);
        if (bool) {
            if (config.openLv - lv == 0) {
                if (lv - this.funcNoticeLastLv == 1)
                    UserTips.ins().showFuncNotice(lv);
                config = FuncNoticeWin.getFuncNoticeConfigById(lv + 1);
                if (!config || config.openLv - lv > 10)
                    bool = false;
            }
            if (bool && this.tar) {
                this.updateButton();
            }
        }
        this.funcNoticeLastLv = lv;
        return bool;
    }

    protected createTar() {
        let t = super.createTar();
        this.updateButton();
        return t;
    }

    private updateButton() {
        let lv: number = UserFb.ins().guanqiaID;
        let config = FuncNoticeWin.getFuncNoticeConfigById(lv);
        this.tar["iconDisplay"].source = "yg_" + config.index + "0";
        this.tar["txt"].text = `${config.openLv}关开启`;
        if (config.index == 2) {
            this.tar["iconDisplay"].x = 15;
            this.tar["iconDisplay"].y = 0;
        }
        else {
            this.tar["iconDisplay"].x = 3;
            this.tar["iconDisplay"].y = -30;
        }
    }

    tapExecute() {
        let lv: number = UserFb.ins().guanqiaID;
        let config: FuncNoticeConfig = FuncNoticeWin.getFuncNoticeConfigById(lv);
        if (config.openLv - lv == 0)
            lv += 1;

        UserTips.ins().showFuncNotice(lv);
    }
}