/**
 * Created by hrz on 2017/10/12.
 *
 * 连充返利 13 3天6天可领奖
 */

class OSATarget3Panel3 extends BaseView {
    private reward:eui.List;
    private gift0:OSATarget3BigRewardItemRender;
    private gift1:OSATarget3BigRewardItemRender;
    private actTime:eui.Label;
    private actDesc:eui.Label;
    private already:eui.Label;
    private state:eui.Label;
    private getBtn:eui.Button;
    private redPoint:eui.Image;
    private show0:eui.Image;
    private show1:eui.Image;
    private bar:eui.ProgressBar;

    public activityID:number;
    private _index:number;
    private _state:number;
    private _time:number;
    private actType:number;
    constructor(){
        super();
        this.skinName = `OSASeriesRechargeSkin`;
    }

    protected childrenCreated() {
        super.childrenCreated();
        this.reward.itemRenderer = ItemBase;
    }

    open() {
        this.addTouchEvent(this.getBtn, this.onTap);
        this.addTouchEvent(this.gift0, this.onTap);
        this.addTouchEvent(this.gift1, this.onTap);
        TimerManager.ins().doTimer(1000,0,this.setTime,this);
        this.actType = ActivityPanel.getActivityTypeFromId(this.activityID);
        this.initData();
    }
    private initData(){
        let act:ActivityType3Data|PActivityType3Data;
        let configs:ActivityType3Config[]|PActivity3Config[];
        if( this.actType == ActivityType.Normal ){
            act = Activity.ins().getActivityDataById(this.activityID) as ActivityType3Data;
            configs = GlobalConfig.ActivityType3Config[this.activityID];
        }else if( this.actType == ActivityType.Personal ){
            act = PActivity.ins().getActivityDataById(this.activityID) as PActivityType3Data;
            configs = GlobalConfig.PActivity3Config[this.activityID];
        }
        let minIndex:number = -1;

        let indexStr = Object.keys(configs);
        for (let i in configs) {
            let config = configs[i];
            let index = +i;
            if ((act.dabiao[index-1] || 0) < config.day ) {
                if(minIndex == -1){
                    minIndex = indexStr.length;//index;
                }
            }
            else if( ((act.recrod>>index) & 1) == 0 && (act.dabiao[index-1] || 0) >= config.day){
                minIndex = index;
            }
            this['gift'+(index-1)].setData(this.activityID, index);
        }

        let keys = Object.keys(configs);
        let maxIndex = +(keys[keys.length-1]);
        this.bar.maximum = configs[maxIndex].day;
        this.bar.value = act.dabiao[maxIndex-1];


        if(minIndex == -1) minIndex = act.getCurIndex();
        this.setSelectIndex(minIndex);

        this.updateTime();
    }

    private setSelectIndex(index:number) {
        this._index = index;
        let config:ActivityType3Config|PActivity3Config;
        let act:ActivityType3Data|PActivityType3Data;
        if( this.actType == ActivityType.Normal ){
            config = GlobalConfig.ActivityType3Config[this.activityID][index];
            act = Activity.ins().getActivityDataById(this.activityID) as ActivityType3Data;
        }else if( this.actType == ActivityType.Personal ){
            config = GlobalConfig.PActivity3Config[this.activityID][index];
            act = PActivity.ins().getActivityDataById(this.activityID) as PActivityType3Data;
        }

        this.reward.dataProvider = new eui.ArrayCollection(config.rewards);

        this.redPoint.visible = false;
        if ((act.dabiao[index-1]||0)>=config.day) {
            let state = (act.recrod>>index) & 1;
            if (state == 0) {
                this.getBtn.label = `领取`;
                this.getBtn.visible = true;
                this.getBtn.enabled = true;
                this.already.visible = false;
                this.redPoint.visible = true;
                this._state = 1;
            } else {
                this.getBtn.label = `已领取`;
                this.getBtn.visible = false;
                this.already.visible = true;
                // this.state.visible = false;
                this._state = 2;
            }
        } else {
            this.getBtn.label = `未完成`;
            this.getBtn.visible = true;
            this.getBtn.enabled = false;
            this.already.visible = false;
            this._state = 0;
        }

        if (index == 1) {
            this.show0.visible = true;
            this.show1.visible = false;
            this.gift0.setSelected(true);
            this.gift1.setSelected(false);
        } else {
            this.show0.visible = false;
            this.show1.visible = true;
            this.gift0.setSelected(false);
            this.gift1.setSelected(true);
        }
    }

    private updateTime(){
        let act:ActivityType3Data|PActivityType3Data;
        let config: ActivityConfig|PActivityConfig;
        if( this.actType == ActivityType.Normal ){
            act = Activity.ins().getActivityDataById(this.activityID) as ActivityType3Data;
            config = GlobalConfig.ActivityConfig[this.activityID];
        }else if( this.actType == ActivityType.Personal ){
            act = PActivity.ins().getActivityDataById(this.activityID) as PActivityType3Data;
            config = GlobalConfig.PActivityConfig[this.activityID];
        }

        let sec = act.getLeftTime();
        this._time = sec;

        this.actTime.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5, 3);

        this.actDesc.text = config.desc;
    }

    private setTime() {
        if(this._time > 0) {
            this._time -= 1;
            this.actTime.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5,3);
        }
    }

    private onTap(e:egret.TouchEvent){
        let tar = e.currentTarget;
        if (tar == this.getBtn) {
            if(this._state == 1) {
                if( this.actType == ActivityType.Normal ){
                    Activity.ins().sendReward(this.activityID, this._index);
                }else if( this.actType == ActivityType.Personal ){
                    PActivity.ins().sendReward(this.activityID, this._index);
                }

            }
        } else if (tar == this.gift0) {
            this.setSelectIndex(1);
        } else if (tar == this.gift1) {
            this.setSelectIndex(2);
        }
    }

    close(){
        this.removeTouchEvent(this.getBtn, this.onTap);
        this.removeTouchEvent(this.gift0, this.onTap);
        this.removeTouchEvent(this.gift1, this.onTap);
        TimerManager.ins().removeAll(this);
    }

    updateData(){
        this.initData();
    }
}