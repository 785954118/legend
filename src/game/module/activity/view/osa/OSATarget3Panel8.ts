import Timer = egret.Timer;
/**
 * Created by hrz on 2017/12/15.
 */

class OSATarget3Panel8 extends BaseView {
    activityID:number;
    private actTime1:eui.Label;
    private actInfo1:eui.Label;
    private numLbl:eui.BitmapLabel;

    private rechargeBtn:eui.Group;

    private reward0:ChristmasRechargeItem;
    private reward1:ChristmasRechargeItem;
    private reward2:ChristmasRechargeItem;
    private reward3:ChristmasRechargeItem;
    private reward4:ChristmasRechargeItem;
    private reward5:ChristmasRechargeItem;

    private schedule0:eui.Group;
    private sche0bell0:eui.Image;
    private sche0bell1:eui.Image;
    private sche0bell2:eui.Image;
    private sche0bell3:eui.Image;
    private sche0bell4:eui.Image;

    private schedule1:eui.Group;
    private schedule2:eui.Group;
    private schedule3:eui.Group;
    private schedule4:eui.Group;

    private singleReward:ItemBase;
    private _sendConf:any;
    private actType:number;
    constructor(id) {
        super();
        this.activityID = id || 0;
        this.initSkin();
    }

    private initSkin() {
        this.actType = ActivityPanel.getActivityTypeFromId(this.activityID);
        let config:ActivityConfig|PActivityConfig;
        if( this.actType == ActivityType.Normal ){
            config = GlobalConfig.ActivityConfig[this.activityID];
            this.skinName = config.pageSkin;
        }else if( this.actType == ActivityType.Personal ){
            config = GlobalConfig.PActivityConfig[this.activityID];
            this.skinName = config.pageSkin;
        }
    }

    open() {
        this.initSkin();

        for (let i = 0; i < 6; i++) {
            this.addTouchEvent(this[`reward${i}`], this.onTap);
        }
        this.addTouchEvent(this.rechargeBtn, this.onTap);
        this.observe(Activity.ins().postActivityIsGetAwards, this.showAward);
        this.observe(PActivity.ins().postActivityIsGetAwards, this.showAward);
        this.initData();
        TimerManager.ins().doTimer(1000, 0, this.updateTime, this);
    }

    private initData() {
        let config:ActivityType3Config[]|PActivity3Config[];
        if( this.actType == ActivityType.Normal ){
            this.actInfo1.text = GlobalConfig.ActivityConfig[this.activityID].desc;
            config = GlobalConfig.ActivityType3Config[this.activityID];
        }else if( this.actType == ActivityType.Personal ){
            this.actInfo1.text = GlobalConfig.PActivityConfig[this.activityID].desc;
            config = GlobalConfig.PActivity3Config[this.activityID];
        }

        for (let i in config) {
            let conf = config[i];
            if (conf.type == 4) {
                this.singleReward.data = conf.rewards[0];
                break;
            }
        }

        this.updateTime();
        this.updateData();
    }

    private updateTime(){
        let act:ActivityType3Data|PActivityType3Data;
        if( this.actType == ActivityType.Normal ){
            act = Activity.ins().getActivityDataById(this.activityID) as ActivityType3Data;
        }else if( this.actType == ActivityType.Personal ){
            act = PActivity.ins().getActivityDataById(this.activityID) as PActivityType3Data;
        }
        let sec = act.getLeftTime();
        this.actTime1.text = DateUtils.getFormatBySecond(sec, DateUtils.TIME_FORMAT_5, 3);
    }

    private onTap(e:egret.TouchEvent) {
        if (e.currentTarget == this.rechargeBtn) {
            let rdata:RechargeData = Recharge.ins().getRechargeData(0);
            if(!rdata || rdata.num != 2 ){
                ViewManager.ins().open(Recharge1Win);
            }else{
                ViewManager.ins().open(ChargeFirstWin);
            }
            return;
        }
        let tar = e.currentTarget as ChristmasRechargeItem;
        if(tar) {
            let data:ActivityType3Config|PActivity3Config;
            let actData:ActivityType3Data|PActivityType3Data;
            if( this.actType == ActivityType.Normal ){
                data = tar.data as ActivityType3Config;
                Activity.ins().sendReward(data.Id, data.index);
                actData = Activity.ins().getActivityDataById(data.Id) as ActivityType3Data;
            }else if( this.actType == ActivityType.Personal ){
                data = tar.data as PActivity3Config;
                PActivity.ins().sendReward(data.Id, data.index);
                actData = PActivity.ins().getActivityDataById(data.Id) as PActivityType3Data;
            }
            let state = actData.getRewardStateById(data.index);
            if (state == Activity.CanGet) {
                this._sendConf = data;
            }
        }
    }

    private showAward() {
        if(this._sendConf) {
            let actData:ActivityType3Data|PActivityType3Data;
            if( this.actType == ActivityType.Normal ){
                actData = Activity.ins().getActivityDataById(this._sendConf.Id) as ActivityType3Data;
            }else if( this.actType == ActivityType.Personal ){
                actData = PActivity.ins().getActivityDataById(this._sendConf.Id) as PActivityType3Data;
            }
            let state = actData.getRewardStateById(this._sendConf.index);
            if (state == Activity.Geted) {
                UserTips.ins().showItemTips(this._sendConf.rewards[0].id);
            }
        }
    }

    close() {
        for (let i = 0; i < 6; i++) {
            this.removeTouchEvent(this[`reward${i}`], this.onTap);
        }
        this.removeTouchEvent(this.rechargeBtn, this.onTap);
        this.removeObserve();

        TimerManager.ins().remove(this.updateTime, this);
    }

    updateData() {
        let act:ActivityType3Data|PActivityType3Data;
        let config:ActivityType3Config[]|PActivity3Config[];
        if( this.actType == ActivityType.Normal ){
            act = Activity.ins().getActivityDataById(this.activityID) as ActivityType3Data;
            config = GlobalConfig.ActivityType3Config[this.activityID];
        }else if( this.actType == ActivityType.Personal ){
            act = PActivity.ins().getActivityDataById(this.activityID) as PActivityType3Data;
            config = GlobalConfig.PActivity3Config[this.activityID];
        }

        for (let i = 0; i < 5; i++) {
            let curConf = config[i+1];
            let nextConf = config[i+2];

            let v = Math.floor((act.chongzhiTotal - curConf.val) / (nextConf.val-curConf.val) * 5);

            for (let j = 0; j < 5; j++) {
                let key =  `sche${i}bell${j}`;
                if (v > j) {
                    this[key].source = "bell2"
                } else {
                    this[key].source = "bell1";
                }
            }
        }

        for (let i = 0; i < 6; i++) {
            this[`reward${i}`].data = config[i+1];
        }
        this.numLbl.text = `${Math.floor(act.chongzhiTotal/100)}`;
    }
}