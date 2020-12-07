/**
 * 活动类型19-1
 * 跨服排行类型
 */
class OSATarget19Panel1 extends BaseView {
    public activityID:number;
    private viewStack:eui.ViewStack;
    private tab:eui.TabBar;

    private panelArr:any[];
    private curSelectIndex:number;

    private ranking:KfRankPanel;
    private costTarget:OSATarget1Panel;
    private reward:KfRankRewardPanel;
    // private target:OSATarget19PanelAct1;
    private redPoint1:eui.Image;
    public constructor() {
        super();
        this.skinName = `ISCostWinSkin`;
    }

    public close(...param: any[]): void {
        // this.target.close();
        this.panelArr[this.curSelectIndex].close();
        this.removeObserve();
        TimerManager.ins().removeAll(this);
    }

    public open(...param: any[]): void {
        this.addChangeEvent(this.tab, this.onTabTouch);
        this.observe(Activity.ins().postActivityIsGetAwards, this.updateRedPoint);
        // this.observe(Activity.ins().postKuaFuRank, this.updateData);
        let config = GlobalConfig.ActivityType19Config[this.activityID][1];
        this.costTarget.activityType = ActivityType.Normal;//虽然活动是嵌套活动 但面板是正常活动
        this.costTarget.activityID = config.activityID;
        // this.costTarget.activityID = 1102;
        this.panelArr = [this.ranking,this.costTarget,this.reward];
        //嵌套活动
        // this.openActPanel();
        this.setSelectedIndex(0);
        this.updateRedPoint();
    }
    private onTabTouch(e: egret.TouchEvent): void {
        this.panelArr[this.curSelectIndex].close();
        let selectedIndex = e.currentTarget.selectedIndex;
        this.setSelectedIndex(selectedIndex);
    }

    private setSelectedIndex(selectedIndex: number) {
        this.curSelectIndex = selectedIndex;
        // this.roleSelectPanel.visible = false;
        this.panelArr[selectedIndex].open(this.activityID);
        this.viewStack.selectedIndex = selectedIndex;
        // this.target.visible = (!selectedIndex)?true:false
    }
    private updateRedPoint(){
        let data = Activity.ins().getActivityDataById(this.activityID) as ActivityType19Data;
        this.redPoint1.visible = data.canReward();
    }

    /**更新数据 */
    public updateData(): void {

    }

    // private openActPanel(){
    //     this.target.close();
    //     let config: ActivityType19Config = GlobalConfig.ActivityType19Config[this.activityID][1];
    //     this.target.open(config.activityID);
    // }

}
