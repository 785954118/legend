/**
 * 活动类型19
 */
class OSATarget19Panel extends ActivityPanel {
    private panelList: any[];
    private curPanel: any;
    constructor() {
        super();
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        this.panelList = [];
    }

    public open(...param: any[]): void {
        this.observe(Activity.ins().postActivityIsGetAwards, this.updateData);
        this.observe(Activity.ins().postChangePage, this.updateData);
        this.observe(Activity.ins().postRewardResult, this.updateData);
        // this.observe(Activity.ins().postKuaFuRank, this.updateData);

        this.showPanel();
    }

    public close(...param: any[]): void {
        this.removeObserve();
        if (this.curPanel) this.curPanel.close();
    }


    /**
     * 19类型活动首页
     */
    public showPanel(): void {
        let config:ActivityType19Config[] = GlobalConfig.ActivityType19Config[this.activityID];
        if( !config )return;
        let showType = config[1].showType;
        if (!this.panelList[showType]) {
            let Cls = egret.getDefinitionByName(`OSATarget19Panel${showType}`);

            this.panelList[showType] = new Cls();
            this.panelList[showType].top = 0;
            this.panelList[showType].bottom = 0;
            this.panelList[showType].left = 0;
            this.panelList[showType].right = 0;
            this.panelList[showType].activityID = this.activityID;
            this.panelList[showType].showPanel = this.showPanel.bind(this);
        }
        if (this.curPanel) {
            this.curPanel.close();
            DisplayUtils.removeFromParent(this.curPanel);
        }

        this.curPanel = this.panelList[showType];
        this.curPanel.open();
        this.addChild(this.curPanel);
    }

    public updateData() {
        this.curPanel && this.curPanel.updateData();
    }

}