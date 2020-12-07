/**
 * Created by hrz on 2017/12/25.
 */

class TotalRechargeWin extends BaseEuiView {
    public bg: eui.Image;
    public title: eui.Image;
    public rechargeCount: eui.BitmapLabel;
    public list: eui.List;
    public btn: eui.Group;
    public rechargeBtn: eui.Button;
    public recharge: eui.Label;
    public get: eui.Label;
    public limitTime: eui.Label;
    public first: eui.Group;
    public count0: eui.BitmapLabel;
    public unit0: eui.Image;
    public second: eui.Group;
    public count1: eui.BitmapLabel;
    public unit1: eui.Image;
    public third: eui.Group;
    public count2: eui.BitmapLabel;
    public unit2: eui.Image;
    public select0: eui.Image;
    public select1: eui.Image;
    public select2: eui.Image;
    public closeBtn: eui.Button;
    public chooseBtn0: eui.Button;
    public chooseBtn1: eui.Button;
    public chooseBtn2: eui.Button;
    public bgClose:eui.Rect;

    private _activityId:number;
    private _index:number;

    constructor(){
        super();
        this.skinName = `DTRechargeSkin`;
        this.isTopLevel = true;
    }

    public open(...args: any[]): void {
        this.list.itemRenderer = DoubleTwelveRechargeItem;
        this.addTouchEvent(this.closeBtn, this.closeWin);
        this.addTouchEvent(this.bgClose, this.closeWin);
        this.addTouchEvent(this.chooseBtn0, this.onSelect);
        this.addTouchEvent(this.chooseBtn1, this.onSelect);
        this.addTouchEvent(this.chooseBtn2, this.onSelect);
        this.addTouchEvent(this.rechargeBtn, this.onRecharge);

        this.observe(Recharge.ins().postUpdateRecharge, this.update);
        this.observe(Recharge.ins().postUpdateRechargeEx, this.update);
        this.observe(Activity.ins().postChangePage, this.update);
        this.observe(Activity.ins().postRewardResult,this.update);
        this.observe(Activity.ins().postActivityIsGetAwards,this.update);

        this.updateView();
    }

    private onRecharge(e: egret.TouchEvent): void
    {
        if(this.recharge.visible)//充值
        {
            let rdata:RechargeData = Recharge.ins().getRechargeData(0);
            if(!rdata || rdata.num != 2 ){
                ViewManager.ins().open(Recharge1Win);
            }else{
                ViewManager.ins().open(ChargeFirstWin);
            }
        }
        else //领取奖励
        {
            Activity.ins().sendReward(this._activityId, this._index);
        }
    }

    private update(){
        TimerManager.ins().remove(this.updateView, this);
        TimerManager.ins().doTimer(80, 1, this.updateView, this);
    }

    private getActivityId():number {
        let datas = Activity.ins().activityData;
        for (let i in datas) {
            if(datas[i].pageStyle == ActivityPageStyle.TOTALRECHARGE) {
                if (Activity.ins().getActivityDataById(datas[i].id).isOpenActivity() && !Activity.ins().getActivityDataById(datas[i].id).getHide()) {
                    return datas[i].id;
                }
            }
        }
        return 0;
    }

    private updateView(): void {
        let id = this.getActivityId();
        this._activityId = id;
        let data: ActivityType3Data = Activity.ins().getActivityDataById(id) as ActivityType3Data;
        let time = data.getLeftTime();
        let timedesc = Math.floor(time * 1000 / DateUtils.MS_PER_DAY);
        let desc;
        if(timedesc == 0){
            timedesc = Math.floor(time * 1000 / (DateUtils.MS_PER_DAY/24));
            desc = `${timedesc}小时`;
        }
        else
        {
            desc = `${timedesc}天`;
        }
        this.limitTime.text = `距离活动结束仅剩${desc}`;
        for (let i = 1; i <= 3; i++) {
            this.setText(i);
        }

        let selectId = 1;
        let configs: ActivityType3Config[] = GlobalConfig.ActivityType3Config[id];
        for (let i = 1; i <= 3; i++) {
            let config = configs[i];
            if (config.val > data.chongzhiTotal || ((data.recrod >> config.index) & 1) == 0) {
                selectId = i;
                break;
            }
        }
        this.selectActivity(selectId);
    }

    private selectBtn(index: number): void {
        this.select0.visible = false;
        this.select1.visible = false;
        this.select2.visible = false;
        this[`select${index}`].visible = true;
    }

    private selectActivity(index:number): void {
        let activityId = this._activityId;
        this._index = index;
        let data: ActivityType3Data = Activity.ins().getActivityDataById(activityId) as ActivityType3Data;
        let config = GlobalConfig.ActivityType3Config[activityId][index];
        let needMoney = Math.max(0, config.val - data.chongzhiTotal);
        this.rechargeCount.text = needMoney.toString();

        if (((data.recrod >> index) & 1) == 1) {
            this.btn.visible = false;
            this.get.visible = false;
            this.recharge.visible = false;
        }
        else {
            this.btn.visible = true;
            if (needMoney > 0) {
                this.recharge.visible = true;
                this.get.visible = false;
            }
            else {
                this.recharge.visible = false;
                this.get.visible = true;
            }
        }

        this.list.dataProvider = new ArrayCollection(config.rewards);

        this.selectBtn(index-1);
    }

    private setText(index: number): void {
        let id = this._activityId;
        let cfg: ActivityType3Config = GlobalConfig.ActivityType3Config[id][index];
        let val = cfg.val;
        if (val >= 10000) {
            val = Math.floor(val / 10000);
            this[`unit${index-1}`].source = `dt_wan`;
        } else {
            val = Math.floor(val / 1000);
            this[`unit${index-1}`].source = `dt_qian`;
        }

        this[`count${index-1}`].text = val.toString();
    }

    private onSelect(e: egret.TouchEvent): void {
        let btn = e.currentTarget;
        let index = 1;
        if(btn == this.chooseBtn0){
            index = 1;
        }
        else if(btn == this.chooseBtn1){
            index = 2;
        }else {
            index = 3;
        }
        this.selectActivity(index);
    }

    private closeWin(): void {
        ViewManager.ins().close(this);
    }
}

ViewManager.ins().reg(TotalRechargeWin, LayerManager.UI_Popup);