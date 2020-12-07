/**
 * Created by hrz on 2017/9/4.
 */

class VipGiftItemView extends BaseView {
    private reward:eui.List;
    private getBtn:eui.Button;
    private already:eui.Label;

    private ggtxt:eui.Image;
    private txt:eui.Image;
    private tu:eui.Image;
    private redPoint:eui.Image;

    public curId:number;
    constructor() {
        super();
        this.skinName = `VipGiftItemSkin`;
    }

    protected childrenCreated(){
        super.childrenCreated();
        this.reward.itemRenderer = ItemBase;
    }

    open(...param:any[]) {
        this.curId = param[0] || 1;
        this.updateData();

        this.close();
        this.addTouchEvent(this.getBtn, this.onGet);
        this.observe(UserVip.ins().postVipGiftBuy, this.updateData);
    }

    close() {
        this.removeTouchEvent(this, this.onGet);
        this.removeObserve();
    }

    private onGet() {
        let config = GlobalConfig.VipGiftConfig[this.curId];
        if (UserVip.ins().lv < config.vipLv) {
            UserTips.ins().showTips(`VIP等级不足`);
            return;
        }
        if (Actor.yb < config.needYb) {
            UserTips.ins().showTips(`元宝不足`);
            return;
        }
        if (UserBag.ins().getSurplusCount() <= 0) {
            UserTips.ins().showTips("|C:0xf3311e&T:背包已满，请先清理背包|");
            return;
        }
        UserVip.ins().sendGetVipGift(this.curId);
    }

    updateData() {
        let config = GlobalConfig.VipGiftConfig[this.curId];
        let awards = config.awards;
        this.reward.dataProvider = new eui.ArrayCollection(awards.concat());

        this.ggtxt.source = config.adImg;
        this.txt.source = config.nameImg;
        this.tu.source = config.bgImg;

        this.getBtn.visible  = UserVip.ins().getVipGiftCanBuy(this.curId) && !UserVip.ins().getVipGiftIsBuy(this.curId);
        this.getBtn.label = config.needYb+"元宝";

        this.redPoint.visible = UserVip.ins().getVipGiftRedPoint(this.curId);

        this.already.visible = UserVip.ins().getVipGiftIsBuy(this.curId);
    }
}