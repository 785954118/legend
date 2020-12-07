

class OSATarget5Panel4 extends BaseView {
    private reward: eui.List;
    private getBtn: eui.Button;
    private btnMC: MovieClip;
    private _activityData: ActivityType5Data;
    public activityID: number;
    private day: number;


    constructor() {
        super();
        this.skinName = `OSADailyDoubleRechargeSkin`;
        this.addTouchEvent(this.getBtn, this.onTouch);
        this.reward.itemRenderer = ItemBase;
    }

    public open(...param: any[]): void {
        let config: ActivityType5Config[] = GlobalConfig.ActivityType5Config[this.activityID];
        for(let i in config){
            if(config[i].rewards){
                this.reward.dataProvider = new eui.ArrayCollection(config[i].rewards);
            }
        }
        
        this.updateData()
    }

    private onTouch(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.getBtn:
                Activity.ins().sendReward(this.activityID, this.day);
                break;
        }
    }
    updateData() {
        this._activityData = Activity.ins().getActivityDataById(this.activityID) as ActivityType5Data;
        let conf: any = GlobalConfig['ActivityType5Config'][this.activityID]
        for(let i in conf){
            if(conf[i].day){
                this.day = conf[i].day;
            }
        }
        let flag: boolean = ((this._activityData.recrod >> this.day & 1) == 1);
        if (!flag) {
            this.getBtn.visible = true
        } else {
            this.getBtn.enabled = false;
			this.getBtn.label = "已领取";
        }
    }
    public close(...param: any[]): void {
        this.removeTouchEvent(this.getBtn, this.onTouch);
        DisplayUtils.removeFromParent(this.btnMC);
        this.removeObserve();
        TimerManager.ins().removeAll(this);
    }



}