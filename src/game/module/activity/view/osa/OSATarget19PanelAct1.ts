/**
 * 活动类型19-1
 * 嵌套活动类型1
 */
class OSATarget19PanelAct1 extends BaseComponent {
    private activityID:number;
    private maskGroup:eui.Group;
    private reward:ItemBase;
    private cost:eui.Label;
    private target:eui.Label;
    private state:number;//NotReached CanGet Geted(所有领完)
    private index:number;
    public constructor() {
        super();
        this.skinName = `ISCostTargetSkin`;
    }

    public close(...param: any[]): void {
        this.removeObserve();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.maskGroup,this.onClick);
        this.observe(Activity.ins().postActivityIsGetAwards, this.updateData);
        this.activityID = param[0];
        Activity.ins().sendChangePage(this.activityID)//请求数据
        // this.updateData();
    }
    private onClick(e:egret.TouchEvent){
        switch (e.currentTarget){
            case this.maskGroup:
                if( this.state == Activity.CanGet ){
                    Activity.ins().sendReward(this.activityID,this.index);
                }
                else{
                    let config:ActivityType1Config = GlobalConfig.ActivityType1Config[this.activityID][this.index];
                    let tips = 0;
                    switch (config.showType){
                        case ShowType.XIAOFEI:
                            let act:ActivityType1Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType1Data;
                            if( act.hFTotalConsumption < config.consumeYuanbao )
                                tips = config.consumeYuanbao - act.hFTotalConsumption;
                            break;
                    }
                    if( !tips ){
                        Activity.ins().sendReward(this.activityID,this.index);
                        return;
                    }
                    if( config.showType == ShowType.XIAOFEI )
                        UserTips.ins().showTips("再消费"+tips+"之后即领取奖励");
                }

                break;
        }
    }

    /**更新数据 */
    public updateData(): void {
        let activityData: ActivityType1Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType1Data;
        if(!activityData) return;
        if( !activityData.isOpenActivity() ){
            UserTips.ins().showTips(`异常:跨服达标领取活动结束!`);
            return;
        }
        let config:ActivityType1Config[] = GlobalConfig.ActivityType1Config[this.activityID];
        this.index = this.getRuleIndex();
        this.reward.data = config[this.index].rewards[0];
        this.reward.setImgBg1();
        this.reward.hideName();
        this.reward.clearEffect();
        this.reward.showNum(false);
        this.cost.text = activityData.hFTotalConsumption + "";
        this.target.text = "/"+config[this.index].consumeYuanbao;
    }
    //获取当前正在领取的档次
    private getRuleIndex():number{
        let activityData: ActivityType1Data = Activity.ins().getActivityDataById(this.activityID) as ActivityType1Data;
        let config:ActivityType1Config[] = GlobalConfig.ActivityType1Config[this.activityID];
        let index = 1;
        for( let i in config ){
            let acfg:ActivityType1Config = config[i];
            activityData.getRewardStateById(acfg.index);
            let btnType:number = activityData.getRewardStateById(acfg.index);
            let curget = activityData.rewardsSum[acfg.index];
            let sum = acfg.total?(acfg.total - curget):1;
            this.state = btnType;
            index = acfg.index;
            switch (btnType){
                case Activity.NotReached:
                    break;
                case Activity.CanGet:
                    if( sum <= 0 )
                        this.state = Activity.NotReached;
                    else
                        this.state = Activity.CanGet;
                    break;
                case Activity.Geted:

                    break;
            }
            if( this.state == Activity.CanGet ){
                this.currentState = "can";
                break;
            }
            if( this.state == Activity.NotReached ){
                this.currentState = "cannot";
                break;
            }
        }
        if( this.state == Activity.Geted ){
            this.currentState = "already";
        }
        this.validateNow();

        return index;
    }

}
