/** 活动类型11界面 */
class OSATarget11Panel extends ActivityPanel {
    public type2PanelList: any[] = [];
    public cruPanel: any;

    public constructor() {
        super();
    }

	public open(...param: any[]): void {
		if (this.cruPanel) 
		{
			this.cruPanel.close();
			DisplayUtils.removeFromParent(this.cruPanel);
		}

		let config:ActivityType11_1Config[] = GlobalConfig.ActivityType11_1Config[this.activityID];
		if (!this.type2PanelList[this.activityID]) {
			let panel: ActivityPanel = ObjectPool.pop(`OSATarget11Panel${config[1].showType}`, [this.activityID]);
			panel.top = 0;
			panel.bottom = 0;
			panel.left = 0;
			panel.right = 0;
			panel.activityID = this.activityID;
			this.type2PanelList[this.activityID + ""] = panel;
		}
		
		this.cruPanel = this.type2PanelList[this.activityID + ""];
		this.cruPanel.open();
		this.addChild(this.cruPanel);
	}

	public close(...param: any[]): void {
		if(this.cruPanel) this.cruPanel.close();
	}
	
	public updateData() {
		this.cruPanel.updateData();
	}

}