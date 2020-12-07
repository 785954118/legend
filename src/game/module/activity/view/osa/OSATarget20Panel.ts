
class OSATarget20Panel extends ActivityPanel {
    private actTime:eui.Label;
    private actDesc:eui.Label;
    private _time:number;
    private eff1:eui.Group;
    private mc1:MovieClip;
    private eff2:eui.Group;
    private mc2:MovieClip;
    public activityID:number;
    private goBtn:eui.Button;
    private bossModel:MovieClip;
    private Boss:eui.Group;
    private redPoint:eui.Image;
    private rewardList:eui.List;
    private time:eui.Label;
    private readyTime:number;
    private dit:number;
    constructor() {
        super();
        this.skinName = `LaBaBossSkin`;
    }

    protected childrenCreated() {
        super.childrenCreated();
    }
    close(){
        this.removeTouchEvent(this.goBtn,this.onTap);
        TimerManager.ins().remove(this.setTime,this);
    }
    open() {
        this.addTouchEvent(this.goBtn, this.onTap);
        this.initData();
        TimerManager.ins().doTimer(1000,0,this.setTime,this);
    }
    private initData(){
        this.rewardList.itemRenderer = ItemBase;
        this.updateData();
    }
    private onTap(e:egret.TouchEvent){
        switch (e.currentTarget){
            case this.goBtn:
                let activityData: ActivityType20Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType20Data;
                if( activityData.IsEnd() ){
                    UserTips.ins().showTips(`已经全部消灭，请期待下次！`);
                    return;
                }
                if( activityData.go2BossFb() ){
                    Activity.ins().sendReward(this.activityID,activityData.index);
                }else{
                    UserTips.ins().showTips(`未到刷新时间`);
                }
                break;
        }
    }

    updateData(){
        let activityData: ActivityType20Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType20Data;
        let beganTime = Math.floor(DateUtils.formatMiniDateTime(activityData.startTime)/DateUtils.MS_PER_SECOND - GameServer.serverTime / DateUtils.MS_PER_SECOND);
        let endedTime = Math.floor(DateUtils.formatMiniDateTime(activityData.endTime)/DateUtils.MS_PER_SECOND - GameServer.serverTime / DateUtils.MS_PER_SECOND);

        if (beganTime >= 0) {
            this.actTime.text = "活动未开启";
            this.readyTime = 0;
        } else if (endedTime <= 0) {
            this.actTime.text = "活动已结束";
            this.readyTime = 0;
        } else {
            this._time = endedTime;
            if (this._time < 0) this._time = 0;
            this.readyTime = activityData.getStartTimer();
            this.actTime.text = DateUtils.getFormatBySecond(endedTime, DateUtils.TIME_FORMAT_5, 3);
        }
        let config:ActivityConfig = GlobalConfig.ActivityConfig[this.activityID];
        this.actDesc.textFlow = TextFlowMaker.generateTextFlow1(config.desc);

        this.redPoint.visible = activityData.checkRedPoint();
        let cfg:ActivityType20Config = GlobalConfig.ActivityType20Config[this.activityID][activityData.index];
        if( cfg ){
            this.rewardList.dataProvider = new eui.ArrayCollection(cfg.showReward);
        }
        this.playModel();
        this.setDate();
    }

    //日期
    private setDate(){
        let activityData: ActivityType20Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType20Data;
        if( activityData.IsEnd() ){
            this.time.text = `今天已全部消灭，请期待下次！`;
            return;
        }
        let curTimer = Math.floor(GameServer.serverTime/DateUtils.MS_PER_SECOND);
        let et = activityData.getEndTimer();
        if( curTimer >= et ){
            //当前已结束 因为服务器会更新到下一个Index(最后一个的话会发下一天的第一个index) 活动期间客户端一分钟获取腊八boss数据
            this.time.text = `已结束`;
            return;
        }
        let st = activityData.getStartTimer();
        if( curTimer >= st && curTimer < et ){
            this.time.text = `BOSS已出现，请前往击杀！`;
            return;
        }
        // let curTimer = Math.floor(GameServer.serverTime/DateUtils.MS_PER_SECOND);
        // if( !this.dit ){
        //     this.dit = Math.floor(st - curTimer);
        // }
        let config:ActivityType20Config = GlobalConfig.ActivityType20Config[this.activityID][activityData.index];
        let mconfig:MonstersConfig = GlobalConfig.MonstersConfig[config.monsterId.id];
        let secondTime = DateUtils.getFormatBySecond(st,DateUtils.TIME_FORMAT_6);
        this.time.text = `${mconfig.name}将在${secondTime}后出现`;


        // let actconfig:ActivityConfig = GlobalConfig.ActivityConfig[this.activityID];
        // let config:ActivityType20Config = GlobalConfig.ActivityType20Config[this.activityID][activityData.index];
        // let date = new Date(activityData.getStartTimer());
        // let month = date.getMonth()+1;
        // let day = date.getDate();
        // let hours = date.getHours();
        // let min = date.getMinutes();
        // this.time.text = `${month}月${day}日 ${hours}:${min}开启`;
    }
    private setTime() {
        if(this._time > 0) {
            this._time -= 1;
            this.actTime.text = DateUtils.getFormatBySecond(this._time, DateUtils.TIME_FORMAT_5, 3);
        }
        // if( this.dit > 0 ){
        //     this.dit --;
        // }
    }
    private playModel(){
        if( !this.bossModel )
            this.bossModel = new MovieClip;
        if( !this.bossModel.parent )
            this.Boss.addChild(this.bossModel);
        let activityData: ActivityType20Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType20Data;
        let config:ActivityType20Config = GlobalConfig.ActivityType20Config[this.activityID][activityData.index];
        if( config ){
            this.bossModel.playFile(RES_DIR_MONSTER + config.monsterId.monster, -1);
            this.bossModel.scaleX = this.bossModel.scaleY = config.monsterId.scale/100;
        }
    }


}