/**
 * 活动类型17 幸运转盘
 * Created by MPeter 2017/12/17
 */
class OSATarget17Panel2 extends ActivityPanel {
    public title: eui.Image;

    //抽奖指针
    private tttzhi: eui.Image;
    /**抽奖按钮 */
    private choujiangBtn: eui.Button;
    /**当前积分 */
    private inte: eui.Label;
    /**条件标签 */
    private termLabel: eui.Label;
    /**日志列表 */
    private list: eui.List;
    /**返回按钮 */
    private back: eui.Button;


    private rolling: boolean;
    private isClick: boolean;//是否点击了抽奖

    public showPanel: Function;
    public constructor() {
        super();
        this.skinName = `luckyTurntableSkin2`;
    }

    public close(...param: any[]): void {
        this.removeObserve();
        egret.Tween.removeTweens(this.tttzhi);
        TimerManager.ins().removeAll(this);

        this.rolling = false;
        this.isClick = false;
    }

    public open(...param: any[]): void {
        this.observe(Activity.ins().postRewardResult, this.resultCallBack);

        this.addTouchEvent(this.choujiangBtn, this.startLottery);
        this.addTouchEvent(this.back, this.gotoHome)

        this.list.itemRenderer = NoticeListRenderer;

        this.updateView();
        this.updateData();
    }

    private updateView(): void {
        let data: ActivityType17Data = Activity.ins().activityData[this.activityID] as ActivityType17Data;
        let config2: ActivityType17_2Config = GlobalConfig.ActivityType17_2Config[this.activityID];
        let config3: ActivityType17_3Config[] = GlobalConfig.ActivityType17_3Config[this.activityID];


        // this.termLabel.text = `消耗${config2.score}积分可转动转盘`;

        let showAwards: RewardData[] = config3[CommonUtils.getObjectLength(config3)].group;
        let max: number = showAwards.length;
        for (let i: number = 0; i < max; i++) {
            this[`item${i}`].itemIcon.data = <RewardData>showAwards[i];
            this[`item${i}`].rewardState((data.recrod >> (i + 1) & 1));
        }

        this.listRefush();

        let btnCfg: ActivityBtnConfig = GlobalConfig.ActivityBtnConfig[this.activityID];
        if (btnCfg)
            this.title.source = btnCfg.title;
    }
    public updateData(): void {
        let data: ActivityType17Data = Activity.ins().activityData[this.activityID] as ActivityType17Data;
        this.inte.text = `当前积分 ${data.score}`;
    }
    /**抽奖结果回调*/
    private resultCallBack(id: number) {
        if (!Activity.ins().isSuccee) return;
        if (!this.isClick) return;
        if (this.activityID != id) return;

        let data: ActivityType17Data = Activity.ins().activityData[this.activityID] as ActivityType17Data;
        let index: number = data.awardIndex;

        if (index) this.beginLottery(index);
        this.updateView();
        this.listRefush();
    }
    /**开始抽奖 */
    private beginLottery(index: number): void {
        let rotat: number = 360 * 4 + (index - 1) * (360 / 12);
        let tween: egret.Tween = egret.Tween.get(this.tttzhi);
        this.rolling = true;
        tween.to({ "rotation": rotat }, 4000, egret.Ease.circOut).call(() => {
            Activity.ins().sendReward(this.activityID, 0);
            Activity.ins().isSuccee = false;
            this.flyItemEx(this["item" + (index - 1)]);
            setTimeout(() => {
                this.rolling = false;
                this.isClick = false;
            }, 2000);
        }, this);
    }

    private flyItemEx(itemicon: BabelLotteryItem) {
        let flyItem: eui.Image = new eui.Image(itemicon.itemIcon.getItemSoure());
        flyItem.x = itemicon.x;
        flyItem.y = itemicon.y;
        flyItem.scaleX = 1;
        flyItem.scaleY = 1;
        itemicon.parent.addChild(flyItem);
        GameLogic.ins().postFlyItemEx(flyItem);
    }

    private startLottery(): void {
        if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
            ViewManager.ins().open(BagFullTipsWin);
            return;
        }

        let data: ActivityType17Data = Activity.ins().activityData[this.activityID] as ActivityType17Data;
        let cfg2: ActivityType17_2Config = GlobalConfig.ActivityType17_2Config[this.activityID];

        if (this.rolling) {
            UserTips.ins().showTips("正在抽奖，请稍候");
            return;
        }
        if (this.isClick) {
            UserTips.ins().showTips("等待抽奖结果 请稍后");
            return;
        }

        if (Activity.ins().getRollSum(this.activityID) || data.score >= cfg2.score) {
            this.isClick = true;
            Activity.ins().sendReward(this.activityID, 1);//1抽奖，0领取奖励
        } else {
            UserTips.ins().showTips(`积分不够`);
            this.isClick = false;
        }
    }


    private listRefush(): void {
        let data: ActivityType17Data = Activity.ins().activityData[this.activityID] as ActivityType17Data;
        if (data) {
            let arr = [];
            for (let i = 0; i < data.noticeArr.length; i++) {
                let notice = { activityID: this.activityID, activityType: ActivityDataFactory.ACTIVITY_TYPE_17, name: data.noticeArr[i].name, index: data.noticeArr[i].index };
                arr.push(notice);
            }
            this.list.dataProvider = new eui.ArrayCollection(arr);
        }
    }

    private gotoHome(): void {
        if (this.showPanel) this.showPanel(1);
    }

}
