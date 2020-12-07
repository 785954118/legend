class PublicBossJiangliTipWin extends BaseEuiView {
	constructor() {
		super();
	}
	protected belongItem: ItemBase;
	protected joinItem: ItemBase;

	protected belongList: eui.List;
	protected joinList: eui.List;

	private proWordGroup1: eui.Group;
	private proWordGroup: eui.Group;

	public initUI(): void {
		super.initUI();

		this.skinName = "WorldBossJiangLiTishiSkin";
		this.isTopLevel = true;

		this.belongList.itemRenderer = ItemBase;
		this.joinList.itemRenderer = ItemBase;

	}

	public open(...param: any[]): void {
		this.addTouchEvent(this, this.otherClose);

		if (GwBoss.ins().isGwBoss || KFBossSys.ins().isKFBossBattle) {
			this.currentState = `gwboss`;
		} else if (GwBoss.ins().isGwTopBoss) {
			this.currentState = `tower`;
		} else if (GameMap.fbType == UserFb.FB_TYPE_HIDE_BOSS) {
			this.currentState = `hideboss`;
		} else {
			this.currentState = `normal`;
		}

		if (KFBossSys.ins().isKFBossBattle) {
			this.proWordGroup1.visible = false;
			this.proWordGroup.visible = false;
			let ar: number[] = [];
			for (let k in GlobalConfig.CrossBossConfig) {
				let dp = GlobalConfig.CrossBossConfig[k];
				if (dp.fbid == GameMap.fubenID) {
					let belongRewardshow = CommonUtils.copyDataHandler(dp.belongRewardshow);
					if (belongRewardshow)
						this.belongItem.data = belongRewardshow.shift();
					this.belongList.dataProvider = new eui.ArrayCollection(belongRewardshow);
					break;
				}
			}
		}
		else if (GameMap.fbType == UserFb.FB_TYPE_HIDE_BOSS) {
			let id = UserBoss.ins().hideBossData.lastId;
			let reward = GlobalConfig.HideBossConfig[id].rewardShow.concat();
			this.belongItem.data = reward.shift();
			this.belongList.dataProvider = new eui.ArrayCollection(reward);
		}
		else {
			let config = GlobalConfig.WorldBossConfig[UserBoss.ins().currBossConfigID];

			this.belongItem.data = config.belongRewardshow[0];
			this.belongList.dataProvider = new eui.ArrayCollection(config.belongRewardshow[1]);

			if (config.canRewardshow) {
				this.joinItem.data = config.canRewardshow[0];
				this.joinList.dataProvider = new eui.ArrayCollection(config.canRewardshow[1]);
			}
		}

	}
	public close(...param: any[]): void {
		this.removeTouchEvent(this, this.otherClose)
	}

	private otherClose(evt: egret.TouchEvent) {
		ViewManager.ins().close(PublicBossJiangliTipWin);
	}

	static openCheck() {

		if (!UserBoss.ins().currBossConfigID) {
			return false;
		}
		return true;
	}
}

ViewManager.ins().reg(PublicBossJiangliTipWin, LayerManager.UI_Popup);