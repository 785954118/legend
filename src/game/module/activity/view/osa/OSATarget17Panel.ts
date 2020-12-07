/**
 * 活动类型17
 * Created by MPeter 2017/12/17
 */
class OSATarget17Panel extends ActivityPanel {
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

        this.showPanel();
    }

    public close(...param: any[]): void {
        this.removeObserve();
        if (this.curPanel) this.curPanel.close();
    }


    /**
     * @param type 1 活动首页， 2 转盘
     */
    public showPanel(type: number = 1): void {
        if (!this.panelList[type]) {
            let Cls = egret.getDefinitionByName(`OSATarget17Panel${type}`);

            this.panelList[type] = new Cls();
            this.panelList[type].top = 0;
            this.panelList[type].bottom = 0;
            this.panelList[type].left = 0;
            this.panelList[type].right = 0;
            this.panelList[type].activityID = this.activityID;
            this.panelList[type].showPanel = this.showPanel.bind(this);
        }
        if (this.curPanel) {
            this.curPanel.close();
            DisplayUtils.removeFromParent(this.curPanel);
        }

        this.curPanel = this.panelList[type];
        this.curPanel.open();
        this.addChild(this.curPanel);
    }

    public updateData() {
        this.curPanel && this.curPanel.updateData();
    }

}