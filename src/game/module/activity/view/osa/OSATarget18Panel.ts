
class OSATarget18Panel extends ActivityPanel {
    public typePanelList: any[] = [];
    public cruPanel: any;

    public constructor() {
        super();
    }

    public open(...param: any[]): void {
        this.observe(Activity.ins().postActivityIsGetAwards, this.updateData);
        this.observe(Activity.ins().postRewardResult, this.updateData);

        if (this.cruPanel)
        {
            this.cruPanel.close();
            DisplayUtils.removeFromParent(this.cruPanel);
        }

        let config:ActivityType18Config[] = GlobalConfig.ActivityType18Config[this.activityID];
        if (!this.typePanelList[this.activityID]) {
            let showType = config[0].showType || 1;
            let panel: ActivityPanel = ObjectPool.pop(`OSATarget18Panel${showType}`, [this.activityID]);
            panel.top = 0;
            panel.bottom = 0;
            panel.left = 0;
            panel.right = 0;
            panel.activityID = this.activityID;
            this.typePanelList[this.activityID + ""] = panel;
        }

        this.cruPanel = this.typePanelList[this.activityID + ""];
        this.cruPanel.open();
        this.addChild(this.cruPanel);
    }

    public close(...param: any[]): void {
        if(this.cruPanel) this.cruPanel.close();
    }

    public updateData() {
        this.cruPanel && this.cruPanel.updateData();
    }

}