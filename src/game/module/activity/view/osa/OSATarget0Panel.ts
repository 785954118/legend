class OSATarget0Panel extends ActivityPanel {

	public type0PanelList: any[] = [];
	public cruPanel: any;
	public static targetIndex = {
		1 : "OSATarget0Panel1", //开服活动-龙城争霸
		2 : "OSATarget0Panel2", //42日累计充值
		3 : "OSATarget0Panel3",//每日累计充值
		4 : "OSA3HeroesPanel",  //三英雄
		5 : "HefuXunbaoPanel", //合服寻宝
		6 : "HefuAncientBossPanel",//合服远古boss
		7 : "HefuLCZBPanel",//合服-龙城争霸
		8 : "OSATarget0Panel8",//二次合服展示充值
		9 : "OSATarget0Panel9",//翅膀暴击展示页
		11:"OSATarget0Panel4",//3日连环充值
	}
	constructor() {
		super();
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		this.initPanelList();
	}

	public open(...param: any[]): void {
		if (this.cruPanel) {
			this.cruPanel.close();
			DisplayUtils.removeFromParent(this.cruPanel);
		}
		let id:number = this.activityID - 10000;
		this.initPanelList();
		this.cruPanel = this.type0PanelList[id + ""];
		this.cruPanel.open();
		this.addChild(this.cruPanel);
	}

	public close(...param: any[]): void {
		if(this.cruPanel) this.cruPanel.close();
	}
	private initPanelList(){
		let aconfg:ActivityBtnConfig = GlobalConfig.ActivityBtnConfig[this.activityID];
		let id:number = this.activityID - 10000;
		if (!this.type0PanelList[id + ""]) {
			let clsStr = OSATarget0Panel.targetIndex[aconfg.showType] || "OSATarget0Panel1";
			let Cls = egret.getDefinitionByName(clsStr);

			this.type0PanelList[id + ""] = new Cls(this.activityID);
			this.type0PanelList[id + ""].top = 0;
			this.type0PanelList[id + ""].bottom = 0;
			this.type0PanelList[id + ""].left = 0;
			this.type0PanelList[id + ""].right = 0;
			this.type0PanelList[id + ""].activityID = this.activityID;
		}
	}

	public updateData() {
		this.cruPanel.updateData();
	}
}
