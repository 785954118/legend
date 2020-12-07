/**
 * 世界boss标签页
 */
class WorldBossMainPanel extends BaseView {

	private list: eui.List;

	private leftText: eui.Label;
	private nameTxt: eui.Label;
	private bossImage: MovieClip;
	private challengeBtn: eui.Button;
	private bossGroup: eui.Group;
	private playerNameTxt: eui.Label;
	private leftCDText: eui.Label;
	private stateImage: eui.Image;
	/** boss提醒设置 */
	private remindTpis: eui.Label;

	// private joinRewardList: eui.List;
	private dropRewardList: eui.List;
	private getItemTxt: eui.Label;
	private juan:eui.Group;
	private jcount:eui.Label;
	private jicon:eui.Image;
	private listData:eui.ArrayCollection;

	constructor() {
		super();
	}

	public childrenCreated(): void {
		this.init();
	}

	public init(): void {
		this.list.itemRenderer = WorldBossItemMain;

		// this.joinRewardList.itemRenderer = ItemBase;
		this.dropRewardList.itemRenderer = ItemBase;
		this.bossImage = new MovieClip;
		this.bossImage.scaleX = -1;
		this.bossImage.scaleY = 1;
		this.bossImage.x = 78;
		this.bossImage.y = 165;
		this.bossGroup.touchEnabled = this.bossGroup.touchChildren = false;
		this.getItemTxt.textFlow = new egret.HtmlTextParser().parser(`<u>${this.getItemTxt.text}</u>`);

		this.remindTpis.textFlow = (new egret.HtmlTextParser).parser(`<a href="event:"><u>${this.remindTpis.text}</u></a>`);
		this.remindTpis.touchEnabled = true;

		this.listData = new eui.ArrayCollection();
		this.list.dataProvider = this.listData;
	}

	public open(): void {
		let dataList = [];
		let type = UserBoss.BOSS_SUBTYPE_WORLDBOSS;
		let canPlayList: WorldBossItemData[] = UserBoss.ins().worldBossPlayList[type].slice();
		if( !canPlayList.length ){
			UserBoss.ins().updateBossPlayList(type);
			canPlayList = UserBoss.ins().worldBossPlayList[type].slice();
		}
		canPlayList.sort(this.sortList);

		dataList.push({type:type, arr:canPlayList, selectIndex:0, clickCall:this.onClickList.bind(this)});

		if (UserZs.ins().lv >= 5 && GameServer.serverOpenDay >= GlobalConfig.WorldBossBaseConfig.canSeeDarkBossDay-1) {
			type = UserBoss.BOSS_SUBTYPE_DARKBOSS;
			canPlayList = UserBoss.ins().worldBossPlayList[type].slice();
			if( !canPlayList.length ){
				UserBoss.ins().updateBossPlayList(type);
				canPlayList = UserBoss.ins().worldBossPlayList[type].slice();
			}
			canPlayList.sort(this.sortList);

			dataList.push({type:type, arr:canPlayList, selectIndex:-1, clickCall:this.onClickList.bind(this)});
		}


		if (this.bossImage && !this.bossImage.parent) {
			this.bossGroup.addChild(this.bossImage);
		}
		this.observe(UserBoss.ins().postWorldBoss, this.setWin);
		this.observe(UserBoss.ins().postWorldBoss, this.joinWorldBoss);
		this.observe(UserBag.ins().postItemCountChange,this.UseToItem);

		this.listData.source = dataList;
		this.list.scrollV = 0;
		this.list.selectedIndex = 0;

		this.currData = dataList[0].arr[0];
		this.addTouchEvent(this.challengeBtn, this.onTap);
		this.addTouchEvent(this.getItemTxt, this.onTap);
		this.remindTpis.addEventListener(egret.TextEvent.LINK, this.onLink, this);

		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickMenu, this);
		this.setWin();
	}

	private sortList(a,b) {
		if(a.id < b.id)
			return -1;
		return 1;
	}

	private currData: any;

	private onClickMenu(e: eui.ItemTapEvent): void {
		let data = this.list.dataProvider.getItemAt(e.itemIndex);
		if (data.type == UserBoss.BOSS_SUBTYPE_DARKBOSS && data.arr.length == 0) {
			UserTips.ins().showTips(`6转即可开启暗之秘境`);
		}
	}

	private onClickList(data) {
		this.currData = data;
		let config: WorldBossConfig = GlobalConfig.WorldBossConfig[this.currData.id];
		for (let i = 0; i < this.listData.length; i++) {
			let source = this.listData.getItemAt(i);
			if (config.type == source.type) {
				source.selectIndex = source.arr.indexOf(data);
			} else {
				source.selectIndex = -1;
				this.listData.itemUpdated(source);
			}
		}
		this.setWin();
	}

	private endTime: number = 0;

	private setWin(): void {
		if (!this.currData) return;
		let config: WorldBossConfig = GlobalConfig.WorldBossConfig[this.currData.id];
		let bossBaseConfig: MonstersConfig = GlobalConfig.MonstersConfig[config.bossId];
		let lvStr: string = config.zsLevel > 0 ? `${config.zsLevel}转` : `${config.level}级`
		// this.nameTxt.text = `${bossBaseConfig.name}(${lvStr})`;
		this.nameTxt.text = `${bossBaseConfig.name}(${config.zslook[0]}转-${config.zslook[config.zslook.length-1]}转)`;
		let str: string = "无";
		if (this.currData.roleName != "") {
			str = this.currData.roleName;
			if (this.currData.guildName != "") str = `${str}(${this.currData.guildName})`;
		}

		if (this.currData.bossState == 2) {
			this.stateImage.source = "zdbossyijisha";
		} else if (this.currData.bossState == 1) {
			this.stateImage.source = "zdbosskejisha";
		} else {
			this.stateImage.source = "";
		}

		// let joinArr:number[] = [];
		// joinArr.push(config.joinReward);
		// this.joinRewardList.dataProvider = new eui.ArrayCollection([200013]);

		if (!this.dropRewardList.dataProvider) {
			this.dropRewardList.dataProvider = new eui.ArrayCollection(config.showReward.concat());
		} else {
			this.dropRewardList.dataProvider['source'] = config.showReward.concat();
		}

		this.playerNameTxt.text = str;
		// this.guildText.text = this.bossData.guildName == "" ? "无" : this.bossData.guildName;
		let count: number = UserBoss.ins().worldBossLeftTime[config.type];
		let txt = config.type == UserBoss.BOSS_SUBTYPE_WORLDBOSS ? "秘境BOSS" : "暗之秘境BOSS";
		this.leftText.text = `${txt}剩余次数:${count}次`;
		this.getItemTxt.visible = (count > 0 || config.type == UserBoss.BOSS_SUBTYPE_DARKBOSS) ? false : true;
		this.endTime = Math.floor((UserBoss.ins().worldBossCd[config.type] - egret.getTimer()) / 1000);

		if (this.endTime > 0) {
			this.challengeBtn.visible = false;
			this.updateTime();
			TimerManager.ins().doTimer(100, 0, this.updateTime, this);
			str = DateUtils.getFormatBySecond(this.endTime, 5, 3);
			this.leftCDText.text = `挑战CD:${str}`;
		} else {
			this.leftCDText.text = ``;
		}

		this.bossImage.playFile(RES_DIR_MONSTER + `monster${bossBaseConfig.avatar}_3s`, -1);
		for (let i: number = 0; i < 4; i++) {
			let item: ItemConfig;
			switch (i) {
				case 0:
					item = GlobalConfig.ItemConfig[config.joinReward];
					break;
				case 1:
					item = GlobalConfig.ItemConfig[config.shieldReward];
					break;
				case 2:
					item = GlobalConfig.ItemConfig[config.belongReward];
					break;
				case 3:
					item = GlobalConfig.ItemConfig[config.killReward];
					break;
			}
		}

		if (config.type == UserBoss.BOSS_SUBTYPE_WORLDBOSS) {
			let itemData: ItemData = UserBag.ins().getBagItemById(ItemConst.WORLDBOSS);
			this.showJuan(itemData);
		} else {
			this.showJuan(null);
		}
	}
	private showJuan(itemData:ItemData){
		if( !itemData ){
			this.juan.visible = false;
			return;
		}
		this.juan.visible = true;
		this.jicon.source = itemData.itemConfig.icon + "_png";
		this.jcount.text = itemData.count + "";
	}

	private updateTime(): void {
		if (!this.currData) return;
		let config: WorldBossConfig = GlobalConfig.WorldBossConfig[this.currData.id];
		let time: number = Math.floor((UserBoss.ins().worldBossCd[config.type] - egret.getTimer()) / 1000);
		this.leftCDText.text = `挑战CD:${DateUtils.getFormatBySecond(time, 5, 3)}`;
		if (time <= 0) {
			TimerManager.ins().remove(this.updateTime, this);
			this.leftCDText.text = ``;
			this.challengeBtn.visible = true;
		}
	}
	/**新提示语*/
	private isUse:boolean;
	private showTips():boolean{
		if (!this.currData) return;
		let config: WorldBossConfig = GlobalConfig.WorldBossConfig[this.currData.id];
		let count: number = UserBoss.ins().worldBossLeftTime[config.type];
		if( count > 0 ){
			return true;
		}

		if (config.type == UserBoss.BOSS_SUBTYPE_DARKBOSS) {
			UserTips.ins().showTips(`暗之秘境BOSS挑战次数已用完`);
			return;
		}

		let tipText = "";
		let item:ItemData = UserBag.ins().getBagGoodsByTypeAndId(UserBag.BAG_TYPE_OTHTER,ItemConst.WORLDBOSS);
		if( item ){
			tipText = `确定使用1个<font color='#FFB82A'>秘境boss</font>道具进入挑战？\n`;

			WarnWin.show(tipText, function () {
				this.isUse = true;
				UserBag.ins().sendUseItem(item.configID,1);
			}, this);
		}else{
			let vipConfig: VipConfig = GlobalConfig.VipConfig[UserVip.ins().lv];
			if (!vipConfig) {
				UserTips.ins().showTips(`|C:0xf3311e&T:成为VIP可购买挑战次数|`);
				return false;
			}
			if (!vipConfig.boss2buy) {
				UserTips.ins().showTips(`|C:0xf3311e&T:VIP等级不足，提升VIP等级可购买挑战次数|`);
				return false;
			}
			let currentUse: number = UserBoss.ins().worldChallengeTime[config.type];
			//购买次数
			if ( count <= 0 && currentUse >= vipConfig.boss2buy) {
				UserTips.ins().showTips(`|C:0xff0000&T:挑战次数不足,无法挑战`);
				return;
			}

			if (Actor.yb < GlobalConfig.WorldBossBaseConfig.buyCountPrice[config.type - 1]) {
				UserTips.ins().showTips(`|C:0xf3311e&T:元宝不足|`);
				return false;
			}
			tipText = `确定花费<font color='#FFB82A'>${GlobalConfig.WorldBossBaseConfig.buyCountPrice[config.type - 1]}元宝</font>购买1次挑战次数吗？\n` +
				`今日已购买：${currentUse}/${vipConfig.boss2buy}`

			WarnWin.show(tipText, function () {
				UserBoss.ins().sendBuyChallengeTimes(config.type);
			}, this);
		}

		return false;
	}
	private UseToItem(){
		if (!this.currData) return;
		let config: WorldBossConfig = GlobalConfig.WorldBossConfig[this.currData.id];
		if( this.isUse ){
			this.isUse = false;
			UserBoss.ins().sendWorldBossInfo(config.type);
		}
	}
	private joinWorldBoss(){
		if( !this.isJoin || !this.currData)return;
		let config: WorldBossConfig = GlobalConfig.WorldBossConfig[this.currData.id];
		this.isJoin = false;
		if (UserFb.ins().checkInFB()) return;
		if (Math.floor((UserBoss.ins().worldBossCd[config.type] - egret.getTimer()) / 1000) > 0) {
			UserTips.ins().showTips(`挑战CD中`);
			return;
		}
		let roleLv: number = UserZs.ins().lv * 1000 + Actor.level;
		let bossBaseConfig: MonstersConfig = GlobalConfig.MonstersConfig[config.bossId];
		let bossLv: number = config.zsLevel * 1000 + config.level;
		if (bossLv > roleLv) {
			let str: string = config.zsLevel > 0 ? `${config.zsLevel}转` : `${config.level}级`;
			UserTips.ins().showTips(`只有${str}才可以挑战。`);
			return;
		}
		if (UserBag.ins().getSurplusCount() < UserBoss.WB_BAG_ENOUGH) {
			ViewManager.ins().open(BagFullTipsWin, UserBoss.WB_BAG_ENOUGH);
		} else {
			ViewManager.ins().close(BossWin);
			UserBoss.ins().sendChallengWorldBoss(this.currData.id, config.type);
		}
		ViewManager.ins().close(LimitTaskView);
	}
	private isJoin:boolean;
	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.challengeBtn:
				this.isJoin = true;
				if( !this.showTips() ) return;
				this.joinWorldBoss();
				break;
			case this.getItemTxt:
				if( !this.showTips() ) return;
				// let vipConfig: VipConfig = GlobalConfig.VipConfig[UserVip.ins().lv];
				// if (!vipConfig) {
				// 	UserTips.ins().showTips(`|C:0xf3311e&T:成为VIP可购买挑战次数|`);
				// 	return;
				// }
				// if (!vipConfig.boss2buy) {
				// 	UserTips.ins().showTips(`|C:0xf3311e&T:VIP等级不足，提升VIP等级可购买挑战次数|`);
				// 	return;
				// }
				// let currentUse: number = UserBoss.ins().worldChallengeTime[this.type];
				// //购买次数
				// if (vipConfig.boss2buy == currentUse) {
				// 	UserTips.ins().showTips(`|C:0xf3311e&T:今日购买次数已达上限|`);
				// 	return;
				// }
                //
				// if (Actor.yb < GlobalConfig.WorldBossBaseConfig.buyCountPrice[this.type - 1]) {
				// 	UserTips.ins().showTips(`|C:0xf3311e&T:元宝不足|`);
				// 	return;
				// }
				// if( !vipConfig.boss2buy ){
				// 	UserTips.ins().showTips(`|C:0xf3311e&T:当前vip等级不能购买|`);
				// 	return;
				// }
                //
				// WarnWin.show(`确定花费<font color='#FFB82A'>${GlobalConfig.WorldBossBaseConfig.buyCountPrice[this.type - 1]}元宝</font>购买1次挑战次数吗？\n` +
				// 	`今日已购买：${currentUse}/${vipConfig.boss2buy}`, function () {
				// 		UserBoss.ins().sendBuyChallengeTimes(this.type);
				// 	}, this);
				break;
		}
	}
	private onLink(): void {
		ViewManager.ins().open(PubBossRemindWin, UserBoss.BOSS_SUBTYPE_DARKBOSS);
	}
	public close(): void {
		this.removeObserve();
		this.list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickMenu, this);
		this.removeTouchEvent(this.challengeBtn, this.onTap);
		this.removeTouchEvent(this.getItemTxt, this.onTap);
		this.remindTpis.removeEventListener(egret.TextEvent.LINK, this.onLink, this);
	}
}