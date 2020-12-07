class BossHomeMainWin extends BaseView {
	private list: eui.List;

	private titleList: eui.List;
	/** 恢复次数剩余时间 */
	private timeTxt: eui.Label;
	/** boss提醒设置 */
	private setting: eui.Label;

	private titleText: eui.Label;

	private listData: eui.ArrayCollection;

	private titleListData: eui.ArrayCollection;

	/** 是否开始计时，防止重复注册计时器 */
	private isStartTime: boolean = false;

	private type: number = 0;

	private vipTipTxt: eui.Label;

	private mainGroup: eui.Group;

	private rukou: eui.Group;

	// private groupList: eui.List;
	private bosshome0: eui.Group;
	private bosshome1: eui.Group;
	private bosshome2: eui.Group;

	private rewardList0: eui.List;
	private rewardList1: eui.List;
	private rewardList2: eui.List;

	private currData;

	private restoreTime = 0;

	private lastIndex:number = -1;

	private isClickItem:boolean = false;

	constructor() {
		super();
		// this.skinName = `VipBossPanelSkin2`;
	}

	public childrenCreated(): void {
		this.init();
	}

	public init(): void {
		// this.groupList.itemRenderer = HomeBossGroupItem;

		this.list.itemRenderer = HomeBossItem;

		this.titleList.itemRenderer = VipBossItem;
		this.setting.textFlow = (new egret.HtmlTextParser).parser(`<a href="event:"><u>${this.setting.text}</u></a>`);
		this.setting.touchEnabled = true;
		// this.setting.visible = false;

		this.listData = new eui.ArrayCollection();
		this.list.dataProvider = this.listData;

		let tArr = []
		for (let k in GlobalConfig.BossHomeConfig) {
			tArr.push(k);
		}
		this.titleList.dataProvider = new eui.ArrayCollection(tArr);

		// this.groupList.dataProvider = new eui.ArrayCollection(tArrSp);
		this.setLoginView();
	}

	public open(...param): void {
		this.setGroupVis(true);
		this.type = UserBoss.BOSS_SUBTYPE_HOMEBOSS;
		this.lastIndex = -1;
		this.titleList.selectedIndex = 0;
		this.observe(UserBoss.ins().postWorldBoss, this.setData);
		this.setting.addEventListener(egret.TextEvent.LINK, this.onLink, this);
		this.titleList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickMenu, this);
		this.addTouchEvent(this.bosshome0, this.onTap);
		this.addTouchEvent(this.bosshome1, this.onTap);
		this.addTouchEvent(this.bosshome2, this.onTap);

		this.rewardList0.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTap, this);
		this.rewardList1.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTap, this);
		this.rewardList2.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTap, this);

		// this.groupList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onRukouClick, this);
		this.setData();
	}

	public close(): void {
		this.setting.removeEventListener(egret.TextEvent.LINK, this.onLink, this);
		this.rewardList0.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTap, this);
		this.rewardList1.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTap, this);
		this.rewardList2.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTap, this);
		this.removeObserve();
		TimerManager.ins().removeAll(this);
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.bosshome0:
				this.onRukouClick(0);
				break;
			case this.bosshome1:
				this.onRukouClick(1);
				break;
			case this.bosshome2:
				this.onRukouClick(2);
				break;
			case this.rewardList0:
			case this.rewardList1:
			case this.rewardList2:
				this.isClickItem = true;
				break;
		}
	}

	private onRukouClick(num: number): void {
		if(this.isClickItem) {
			this.isClickItem = false;
			return;
		}
		let config: BossHomeConfig = GlobalConfig.BossHomeConfig[num + 1];
		if (UserVip.ins().lv < config.vip) {
			UserTips.ins().showTips(`VIP${config.vip}开启`);
			return;
		}
		this.titleList.selectedIndex = num;
		this.setGroupVis(false);
		this.setData();
	}

	private setGroupVis(boo: boolean): void {
		this.rukou.visible = boo;
		this.mainGroup.visible = !boo;
	}

	private onClickMenu(e: eui.ItemTapEvent): void {
		// this.currData = this.list.dataProvider.getItemAt(e.itemIndex);
		this.setData();
	}

	private setLoginView(): void {
		for (let i: number = 0; i < 3; i++) {
			let config: BossHomeConfig = GlobalConfig.BossHomeConfig[i + 1];
			this[`rewardList${i}`].itemRenderer = ItemBase;
			this[`rewardList${i}`].dataProvider = new eui.ArrayCollection(config.icon);
			this[`vipImg${i}`].source = `vip_v${config.vip}_png`;
			// let str1:string = config.zsLevel>0?`${config.zsLevel}转`:`${config.level}级`;
			// let str2:string = config.zsLevel>0?`${config.zsLevel}转`:`${config.level}级`;

		}
	}

	setData() {
		if(this.lastIndex == this.titleList.selectedIndex){
			return;
		}
		this.lastIndex = this.titleList.selectedIndex;

		let scro:eui.Scroller = this.list.parent as eui.Scroller;
		scro.stopAnimation();
		this.list.scrollV = 0;

		let tempArr: WorldBossItemData[] = UserBoss.ins().worldInfoList[this.type].slice();
		let bossInfos: WorldBossItemData[] = [];
		// let dieArr: WorldBossItemData[] = [];
		let canPlayArr: WorldBossItemData[] = [];
		let canPlayDieArr: WorldBossItemData[] = [];
		let canNotPlayArr: WorldBossItemData[] = [];
		let canNotPlayDieArr: WorldBossItemData[] = [];
		let canNotLevel: WorldBossItemData[] = [];
		let roleLv: number = UserZs.ins().lv * 1000 + Actor.level;

		let index: number = this.titleList.selectedIndex + 1;
		let baseConfig = GlobalConfig.BossHomeConfig[index];
		let bossIdArr = baseConfig.boss;

		this.titleText.text = `BOSS之家 ${index}层`;

		this.vipTipTxt.text = `VIP${baseConfig.vip}无限挑战`;
		for (let i: number = 0; i < tempArr.length; i++) {
			if (bossIdArr.indexOf(tempArr[i].id) == -1) continue;
			let isDie: boolean = (tempArr[i].bossState == 2);

			let bossConfig: WorldBossConfig = GlobalConfig.WorldBossConfig[tempArr[i].id];
			let bossLv: number = bossConfig.zsLevel * 1000 + bossConfig.level;
			if (roleLv < bossLv) {
				canNotLevel.push(tempArr[i]);
			} else {
				let boo: boolean = UserBoss.ins().getBossRemindByIndex(tempArr[i].id);
				if (boo) {
					if (isDie) {
						canPlayDieArr.push(tempArr[i]);
					} else {
						canPlayArr.push(tempArr[i]);
					}
				} else {
					if (isDie) {
						canNotPlayDieArr.push(tempArr[i]);
					} else {
						canNotPlayArr.push(tempArr[i]);
					}
				}
			}

		}
		canPlayArr.sort(this.compareFn);
		canPlayDieArr.sort(this.compareFn);
		canNotPlayArr.sort(this.compareFn);
		canNotPlayDieArr.sort(this.compareFn);
		canNotLevel.sort(this.compareFn);
		bossInfos = canPlayArr.concat(canPlayDieArr, canNotPlayArr, canNotPlayDieArr,canNotLevel);
		this.listData.replaceAll(bossInfos);
		this.currData = bossInfos[0];
		// this.updateTime();
		// TimerManager.ins().doTimer(100, 0, this.updateTime, this);

		if (!this.isStartTime) {
			TimerManager.ins().doTimer(1000, 0, this.updateTime, this);
			this.restoreTime = UserBoss.ins().worldBossrestoreTime[this.type];
			this.isStartTime = true;
			this.updateTime();
		}
	}

	// private updateTime(): void {
	// 	let model: WorldBossItemData = this.currData;
	// 	let time: number = model.relieveTime - egret.getTimer();
	// 	this.timeTxt.text = `${DateUtils.getFormatBySecond(Math.floor(time / 1000), 1)}后刷新`;
	// 	if (time <= 0) {
	// 		// UserBoss.ins().sendBossList();
	// 		UserBoss.ins().sendWorldBossInfo(UserBoss.BOSS_SUBTYPE_HOMEBOSS);
	// 		TimerManager.ins().remove(this.updateTime, this);
	// 	}
	// }


	/** 更新恢复次数剩余时间计时 */
	private updateTime(): void {
		if (this.timeTxt == undefined) return;
		let model: WorldBossItemData = this.currData;
		let time: number = model.relieveTime - egret.getTimer();
		if (time <= 0) {
			//移除计时器
			TimerManager.ins().remove(this.updateTime, this);
			this.isStartTime = false;
			//挑战次数满了隐藏计时文本，否则请求计时数据
			this.timeTxt.visible = false;
			UserBoss.ins().sendWorldBossInfo(UserBoss.BOSS_SUBTYPE_HOMEBOSS);
		} else {
			if (!this.timeTxt.visible) this.timeTxt.visible = true;
			this.timeTxt.text = `${DateUtils.getFormatBySecond(Math.floor(time / 1000), 1)}后刷新`;
		}
	}

	private compareFn(a: WorldBossItemData, b: WorldBossItemData): number {
		let configA: WorldBossConfig = GlobalConfig.WorldBossConfig[a.id];
		let configB: WorldBossConfig = GlobalConfig.WorldBossConfig[b.id];

		if (configA.zsLevel < configB.zsLevel) {
			return 1;
		} else if (configA.zsLevel > configB.zsLevel) {
			return -1;
		}

		if (configA.level < configB.level)
			return 1;
		else if (configA.level > configB.level)
			return -1;
		else
			return 0;
		// }
	}

	private onTouch(): void {
		GameGuider.guidance(egret.getQualifiedClassName(ForgeWin), 2);
	}

	private onLink(): void {
		ViewManager.ins().open(PubBossRemindWin, UserBoss.BOSS_SUBTYPE_HOMEBOSS);
	}
}