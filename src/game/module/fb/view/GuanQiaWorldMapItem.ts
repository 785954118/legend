class GuanQiaWorldMapItem extends BaseView {
	public nameTxt: eui.Label;
	public chapterCount: eui.Label;
	public box: eui.Image;
	public rewardGroup: eui.Group;
	private mc: MovieClip;
	private passImg: eui.Image;
	private itemIcon: ItemIcon;


	public constructor() {
		super();
		this.skinName = "CheckMapItemSkin";
		this.observe(UserFb.ins().postZhangJieAwardChange, this.reflashChapter);
		this.observe(UserFb.ins().postGuanqiaWroldReward, this.reflashChapter);
		this.addTouchEvent(this, this.onClick)
		this.mc = new MovieClip();
		this.mc.x = this.mc.y = 32;
		this.mc.scaleX = 0.45;
		this.mc.scaleY = 1.2;
		this.rewardGroup.addChild(this.mc);
	}
	protected childrenCreated(): void {
		super.childrenCreated();
		this.reflashChapter();
	}

	public close(): void {
		this.removeObserve();
		this.removeTouchEvent(this, this.onClick);
		egret.Tween.removeTweens(this.rewardGroup);
	}

	private onClick(e: egret.TouchEvent): void {
		let config: WorldRewardConfig = GlobalConfig.WorldRewardConfig[this.chapter];
		if (UserFb.ins().guanqiaID > config.needLevel)
			UserFb.ins().sendGuanqiaWroldReward(this.chapter);
		else if (!UserFb.ins().isGetReceiveBox(this.chapter))
			UserTips.ins().showTips(`还需要${config.needLevel - UserFb.ins().guanqiaID + 1}关可领取`);
	}

	private reflashChapter(): void {
		this.update(this.chapter);
	}

	public chapter: number = 0;
	public rewardChapter: number = -1;
	public update(chapter: number): void {
		this.chapter = chapter;
		this.rewardChapter = -1;
		let config: WorldRewardConfig = GlobalConfig.WorldRewardConfig[chapter];
		let lastConfig: WorldRewardConfig = GlobalConfig.WorldRewardConfig[chapter - 1];
		this.itemIcon.setData(GlobalConfig.ItemConfig[config.rewards[0].id]);
		let laseLevel: number = 1;
		if (lastConfig) {
			laseLevel = lastConfig.needLevel + 1;
		}

		this.nameTxt.text = config ? `${config.id}.${config.name}` : "";
		this.chapterCount.text = `${laseLevel}-${config.needLevel}关`;

		if (UserFb.ins().guanqiaID <= config.needLevel && UserFb.ins().guanqiaID >= laseLevel) {
			this.box.source = config.icon + "c";
		}
		else {
			this.box.source = config.icon;
		}
		let lastChapter: number = 0;
		lastChapter = laseLevel - UserFb.ins().guanqiaID;
		this.passImg.visible = false;
		let groupY: number = this.rewardGroup.y
		let offY: number = groupY - 10;

		egret.Tween.removeTweens(this.rewardGroup);
		if (UserFb.ins().guanqiaID > config.needLevel) {
			if (UserFb.ins().isGetReceiveBox(chapter)) {
				this.mc.visible = false;
				this.mc.stop();
				this.rewardGroup.visible = false;
				this.passImg.visible = true;
			} else {
				this.rewardGroup.visible = true;
				this.mc.visible = true;
				this.rewardChapter = chapter;
				this.mc.playFile(`${RES_DIR_EFF}chargeff1`, -1);
				egret.Tween.get(this.rewardGroup, { loop: true }).to({ y: offY }, 1000).to({ y: groupY }, 1000);
			}
		}
		else {
			// egret.Tween.get(this.rewardGroup, { loop: true }).to({ y: offY }, 1000).to({ y: groupY }, 1000);
			this.rewardGroup.visible = (UserFb.ins().guanqiaID <= config.needLevel && UserFb.ins().guanqiaID >= laseLevel);
			this.mc.visible = false;
			this.mc.stop();
		}
	}

}