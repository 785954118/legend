/**
 * 关卡 - 世界标签页
 */
class GuanQiaEfficiencyPanel extends BaseComponent {
	//地图数量
	private static MAP_COUNT: number = 15;
	private static MAP_ONE_COUNT: number = 7;
	private static MAP_TWO_COUNT: number = 8;
	public bg: eui.Image;
	//地图一背景
	public mapGroup: eui.Group;
	public map0: eui.Image;
	public map1: eui.Image;
	public map2: eui.Image;
	public map3: eui.Image;
	public map4: eui.Image;
	public map5: eui.Image;
	public map6: eui.Image;
	//地图二背景
	public map7: eui.Image;
	public map8: eui.Image;
	public map9: eui.Image;
	public map10: eui.Image;
	public map11: eui.Image;
	public map12: eui.Image;
	public map13: eui.Image;
	public map14: eui.Image;
	//地图二图标
	public itemGroup2: eui.Group;
	public item7: GuanQiaMapItem;
	public item8: GuanQiaMapItem;
	public item9: GuanQiaMapItem;
	public item10: GuanQiaMapItem;
	public item11: GuanQiaMapItem;
	public item12: GuanQiaMapItem;
	public item13: GuanQiaMapItem;
	public item14: GuanQiaMapItem;
	//地图一图标
	public itemGroup1: eui.Group;
	public item0: GuanQiaMapItem;
	public item1: GuanQiaMapItem;
	public item2: GuanQiaMapItem;
	public item3: GuanQiaMapItem;
	public item4: GuanQiaMapItem;
	public item5: GuanQiaMapItem;
	public item6: GuanQiaMapItem;
	//左右箭头
	public rightArrow: eui.Image;
	public leftArrow: eui.Image;
	//地图背景列表
	private maps: eui.Image[];
	//地图宝箱列表
	private boxs: eui.Image[];
	//地图
	private items: GuanQiaMapItem[];

	constructor() {
		super();
		this.name = "世界";
		// this.skinName = "CheckInfoSkin";
	}

	public childrenCreated(): void {
		super.childrenCreated();
		this.init();
	}

	public init(): void {
		this.initMap();
	}

	private initMap() {
		this.boxs = [];
		this.maps = [];
		this.items = [];
		for (let i = 0; i < GuanQiaEfficiencyPanel.MAP_COUNT; i++) {
			this["item" + i].visible = false;
		}
		for (let i = 0; i < GuanQiaEfficiencyPanel.MAP_COUNT; i++) {
			let item: GuanQiaMapItem = this["item" + i];
			let config: WorldRewardConfig = GlobalConfig.WorldRewardConfig[i + 1];
			let lastConfig: WorldRewardConfig = GlobalConfig.WorldRewardConfig[i];
			let laseLevel: number = i == 0 ? 0 : lastConfig.needLevel + 1;
			item.touchChildren = true;
			item.visible = config != undefined;
			item.nameTxt.text = config ? `${config.name}` : "";
			item.levelLabel.text = `${laseLevel}-${config.needLevel}章`;
			this.items[i] = item;
			this.boxs[i] = item.box;
			this.maps[i] = this["map" + i];
		}
	}

	public open(): void {
		for (let box of this.boxs) {
			this.addTouchEvent(box, this.onTouchTap);
		}
		this.addTouchEvent(this.leftArrow, this.onTouchArrow);
		this.addTouchEvent(this.rightArrow, this.onTouchArrow);
		this.observe(UserFb.ins().postGuanqiaWroldReward, this.upDateGuanqiaWroldReward);
		//地图状态
		let isTow: boolean = UserFb.ins().worldReward > GuanQiaEfficiencyPanel.MAP_ONE_COUNT - 1;
		this.currentState = isTow ? "map1" : "map0";
		this.rightArrow.visible = isTow;
		this.update();
	}

	public close(): void {
		for (let box of this.boxs) {
			this.removeTouchEvent(box, this.onTouchTap);
		}
		this.removeTouchEvent(this.leftArrow, this.onTouchArrow);
		this.removeTouchEvent(this.rightArrow, this.onTouchArrow);
		this.removeObserve();
	}

	private onTouchTap(e: egret.TouchEvent): void {
		let pass: number = this.boxs.indexOf(e.currentTarget) + 1;
		ViewManager.ins().open(GuanQiaWorldRewardWin, pass);
	}

	private onTouchArrow(event: egret.TouchEvent) {
		this.currentState = (event.currentTarget == this.leftArrow) ? "map0" : "map1";
		this.update();
	}

	private upDateGuanqiaWroldReward(): void {
		this.update();
	}

	public update(): void {
		let i: number = this.currentState == "map0" ? 0 : GuanQiaEfficiencyPanel.MAP_TWO_COUNT - 1;
		let len: number = this.currentState == "map0" ? GuanQiaEfficiencyPanel.MAP_ONE_COUNT : this.items.length;
		let index: number = UserFb.ins().worldReward;
		for (; i < len; i++) {
			let item: GuanQiaMapItem = this.items[i];
			let map = this.maps[i];
			if (!item || !map) continue;
			//地图灰化设置
			item.visible = i <= index;
			map.visible = i <= index;
			//隐藏所有进度条
			item.barGroup.visible = false;
			//宝箱领取显示
			item.box.visible = item.levelLabel.visible = item.redPointBox.visible = UserFb.ins().isReceiveBox(i + 1);
		}
		//进度条设置
		let item: GuanQiaMapItem = this.items[index];
		let config: WorldRewardConfig = GlobalConfig.WorldRewardConfig[UserFb.ins().worldReward + 1];
		let preConfig: WorldRewardConfig = GlobalConfig.WorldRewardConfig[UserFb.ins().worldReward];
		if (config && item) {
			item.box.visible = true;
			item.barGroup.visible = true;
			item.levelLabel.visible = true;
			item.bar.value = UserFb.ins().guanqiaReward - (preConfig ? preConfig.needLevel : 0) - 1;
			item.bar.maximum = preConfig ? config.needLevel - preConfig.needLevel : config.needLevel;
		}
	}

}