class GuanQiaTipsWin extends BaseView {
	private reward: eui.Group;
	private item0: ItemBase;
	private rew: eui.Label;
	private rewardBtn: eui.Button;
	private leftIcon: eui.Image;
	private rightIcon: eui.Image;
	private chargeEff1: MovieClip;
	public chapter: number = 0;
	public constructor() {
		super();
		this.skinName = "CheckItemTipsSkin";
		this.item0 = new ItemBase();
		this.item0.x = 64;
		this.item0.y = 46;
		this.item0.scaleX = this.item0.scaleY = 0.8;
		this.reward.addChild(this.item0);
		this.item0.isShowName(false);
		this.addTouchEvent(this.rewardBtn, this.onTap);
		this.observe(UserFb.ins().postZhangJieAwardChange, this.reflashChapter);
		this.observe(UserFb.ins().postGuanqiaWroldReward, this.reflashChapter);
		this.rightIcon.visible = false;

		this.chargeEff1 = new MovieClip;
		this.chargeEff1.x = 100;
		this.chargeEff1.y = 127;
		this.chargeEff1.scaleX = 0.5;
		this.chargeEff1.scaleY = 0.5;
		this.addChild(this.chargeEff1);
	}

	private reflashChapter(): void {
		this.update(this.chapter);
	}

	public updateDir(isLeft: boolean): void {
		this.leftIcon.visible = isLeft;
		this.rightIcon.visible = !isLeft;
	}
	public update(chapter: number): void {
		this.chapter = chapter;
		let config: WorldRewardConfig = GlobalConfig.WorldRewardConfig[chapter];
		let lastConfig: WorldRewardConfig = GlobalConfig.WorldRewardConfig[chapter - 1];

		let laseLevel: number = 1;
		if (lastConfig) {
			laseLevel = lastConfig.needLevel + 1;
		}

		this.item0.data = config.rewards[0];
		let lastChapter: number = 0;
		lastChapter = laseLevel - UserFb.ins().guanqiaID;

		if (UserFb.ins().guanqiaID <= config.needLevel) {
			if (lastChapter > 0) {
				this.rew.text = `距离${config.name}还差${lastChapter}关`;
			} else {
				this.rew.text = `距离领取奖励还差${config.needLevel - UserFb.ins().guanqiaID + 1}关`;
			}
			this.rew.visible = true;
			this.rewardBtn.visible = false;
			this.chargeEff1.visible = false;
			this.chargeEff1.stop();
		} else {
			this.rewardBtn.visible = true;
			if (UserFb.ins().isGetReceiveBox(chapter)) {
				this.rew.text = ``;
				this.rewardBtn.enabled = false;
				this.chargeEff1.visible = false;
				this.chargeEff1.stop();
				this.rew.visible = true;
				this.rewardBtn.label = "已领取";
				this.rewardBtn.touchEnabled = false;
			} else {
				this.rewardBtn.enabled = true;
				this.rew.visible = false;
				this.rewardBtn.label = "领取";
				this.rewardBtn.touchEnabled = true;
				this.chargeEff1.visible = true;
				this.chargeEff1.playFile(RES_DIR_EFF + "chargeff1", -1);
			}
		}
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.rewardBtn:
				UserFb.ins().sendGuanqiaWroldReward(this.chapter);
				break;
		}
	}

}