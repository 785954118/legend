/**
 * 关卡地图面板
 */
class GuanQiaWordMapWin extends BaseEuiView {
	public mapScroller: eui.Scroller;
	public map: eui.Group;
	private mapGroup: eui.Group;
	private mapItemArr: GuanQiaWorldMapItem[];
	private bigMapGroup: eui.Group;
	private bigMapItemArr: GuanQiaWorldBigMapItem[];
	public guanqia: eui.Group;
	private goldTxt0: eui.Label;
	private goldTxt2: eui.Label;

	private expTxt0: eui.Label;
	private expTxt2: eui.Label;
	private getRewordBtn: eui.Button;
	private rewordBtnGroup: eui.Group;

	private roleSelect: RoleSelectPanel;


	private bg: eui.Image;

	private backtobig: eui.Image;

	/** 地图类型 1 详细地图 2大地图 */
	private type: number;

	constructor() {
		super();
		this.isTopLevel = true;
	}

	public initUI(): void {
		super.initUI();

		this.skinName = "CheckInfoSkin";
		// this.setSkinPart("roleSelect", new RoleSelectPanel());
		this.bg.source = `chapterworld_jpg`;

		this.mapGroup = new eui.Group;
		this.map.addChild(this.mapGroup);
		this.mapItemArr = [];

		this.bigMapGroup = new eui.Group;
		this.map.addChild(this.bigMapGroup);
		this.bigMapItemArr = [];

		this.initBigMapItem();
		this.changeMap(MapType.chapterMap, -1);

	}

	/**
	 * 改变地图
	 *  type MapType 地图类型
	 *  id 当type为MapType.chapterMap才有效 大地图的章节id
	 */
	public changeMap(type: number, id: number = -1): void {
		if (this.type == type)
			return;
		switch (type) {
			case MapType.bigMap:
				this.map.removeChild(this.mapGroup);
				this.map.addChild(this.bigMapGroup);
				this.bg.source = "bigworld_jpg";
				this.backtobig.visible = false;
				let allcfg: AllWorldConfig = GlobalConfig.AllWorldConfig[UserFb.ins().groupID];
				let offX: number = allcfg.position.x + 80 - this.mapScroller.width / 2;
				let offY: number = allcfg.position.y + 80 - this.mapScroller.height / 2;
				if ((offX + this.map.width) >= 960) {
					offX = 960 - this.map.width;
				}

				if ((offY + this.map.height) >= 1010) {
					offY = 1010 - this.map.height;
				}
				this.map.scrollH = offX > 0 ? offX : 0;
				this.map.scrollV = offY > 0 ? offY : 0;
				this.rewordBtnGroup.x = 490;
				break;
			default:
				this.map.removeChild(this.bigMapGroup);
				this.map.addChild(this.mapGroup);
				this.bg.source = "chapterworld_jpg";
				this.backtobig.visible = true;
				this.initMapItem(id);
				let offsetY: number = 0;
				let mHeight = 745;
				if (this.rewardItemChapter != -1) {
					let posY: number = GlobalConfig.WorldRewardConfig[this.rewardItemChapter].position.y;
					offsetY = posY - 450 + 75;
				} else {
					offsetY = 860 - mHeight;
				}

				if ((offsetY + mHeight) > 860) {
					offsetY = 860 - mHeight;
				}

				this.map.scrollV = offsetY > 0 ? offsetY : 0;//900-832 75
				this.map.scrollH = 0;
				this.rewordBtnGroup.x = 410;
				break;
		}
		this.type = type;

	}

	private initBigMapItem(): void {
		this.bigMapItemArr = [];
		let config: AllWorldConfig[] = GlobalConfig.AllWorldConfig;
		for (let k in config) {
			let panel: GuanQiaWorldBigMapItem = new GuanQiaWorldBigMapItem();
			panel.x = config[k].position.x;
			panel.y = config[k].position.y;
			panel.update(config[k].id);
			this.bigMapGroup.addChild(panel);
			this.bigMapItemArr.push(panel);
		}
	}

	public open(...param: any[]): void {
		super.open(param);
		this.addTouchEvent(this.getRewordBtn, this.onTap)
		this.addTouchEvent(this.backtobig, this.onClick)
		this.observe(UserFb.ins().postGuanqiaWroldReward, this.upDateItemGroup);
		this.upDateItemGroup();
	}

	public close(...param: any[]): void {
		super.close(param);

		while (this.bigMapItemArr.length != 0) {
			let panel: GuanQiaWorldBigMapItem = this.bigMapItemArr.pop();
			panel.close();
		}
		this.clearMapItem();
	}

	private onClick(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.backtobig:
				this.changeMap(MapType.bigMap);
				break;
		}
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.getRewordBtn:
				if (UserBag.ins().getSurplusCount() >= 4)
					UserFb.ins().sendGetAward();
				else
					UserTips.ins().showTips("|C:0xf3311e&T:背包已满，请清理背包|");
				break;
		}
	}

	private clearMapItem(): void {
		while (this.mapItemArr.length != 0) {
			let panel: GuanQiaWorldMapItem = this.mapItemArr.pop();
			this.mapGroup.removeChild(panel);
			panel.close();
		}
		this.rewardItemChapter = -1;
	}

	private rewardItemChapter: number = -1;

	private WorldMapItem: WorldRewardConfig[];

	/** 根据大地图的章节ID 进入对应的详细地图*/
	private initMapItem(groupId: number = -1): void {
		this.clearMapItem();
		let chapterId: number = -1;
		if (groupId == -1) {
			let config: WorldRewardConfig[] = GlobalConfig.WorldRewardConfig;
			for (let k in config) {
				if (UserFb.ins().guanqiaID > config[k].needLevel && !UserFb.ins().isGetReceiveBox(config[k].id)) {
					groupId = config[k].groupId;
					chapterId = config[k].id;
					break;
				}
			}
			if (groupId == -1)
				groupId = UserFb.ins().groupID;
		}
		let groups: number[] = GlobalConfig.AllWorldConfig[groupId].mapGroup;
		this.WorldMapItem = [];
		for (let i: number = 0; i < groups.length; i++) {
			this.WorldMapItem.push(GlobalConfig.WorldRewardConfig[groups[i]]);
		}

		for (let k in this.WorldMapItem) {
			let panel: GuanQiaWorldMapItem = new GuanQiaWorldMapItem();
			panel.x = this.WorldMapItem[k].position.x;
			panel.y = this.WorldMapItem[k].position.y;
			panel.chapter = this.WorldMapItem[k].id;
			this.mapGroup.addChild(panel);
			this.mapItemArr.push(panel);
			if (panel.rewardChapter != -1) this.rewardItemChapter = panel.rewardChapter;
		}
	}

	private pass: number = 0;

	private upDateItemGroup(): void {
		this.pass = UserFb.ins().getWorldGuanQiaBox();
		let config: ChaptersRewardConfig = GlobalConfig.ChaptersRewardConfig[UserFb.ins().guanqiaReward];

		let guanqiaID: number = UserFb.ins().guanqiaID;

		let preConfig: ChaptersRewardConfig = GlobalConfig.ChaptersRewardConfig[UserFb.ins().guanqiaReward - 1];

		let needLevel: number = preConfig ? config.needLevel - preConfig.needLevel : config.needLevel;
		let curLevel: number = UserFb.ins().guanqiaID - (preConfig ? preConfig.needLevel : 0) - 1;
		let state: boolean = curLevel >= needLevel;

		this.rewordBtnGroup.visible = state;
		this.getRewordBtn.enabled = state;

		this.goldTxt2.text = UserFb.ins().goldEff + "/小时";
		this.expTxt2.text = UserFb.ins().expEff + "/小时";

		this.goldTxt0.text = "";
		this.expTxt0.text = "";
	}
}

ViewManager.ins().reg(GuanQiaWordMapWin, LayerManager.UI_Main);