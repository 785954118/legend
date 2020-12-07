class OSATarget12Panel extends ActivityPanel {

	public type2PanelList: any[] = [];
	public cruPanel: any;


	constructor() {
		super();
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	public open(...param: any[]): void {
		if (this.cruPanel) {
			this.cruPanel.close();
			DisplayUtils.removeFromParent(this.cruPanel);
		}

		let config:ActivityType12Config[] = GlobalConfig.ActivityType12Config[this.activityID];
		if (!this.type2PanelList[this.activityID + ""]) {
			let panel: ActivityPanel = ObjectPool.pop(`OSATarget12Panel${config[1].showType}`);
			panel.top = 0;
			panel.bottom = 0;
			panel.left = 0;
			panel.right = 0;
			panel.activityID = this.activityID;
			panel.activityType = this.activityType;
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
