/**
 * 关卡奖励面板
 */
class GuanQiaWorldRewardWin extends BaseEuiView {
	private closeBtn: eui.Button;
	private closeBtn0: eui.Button;//领取关闭
	private requireLabel: eui.Label;

	private specialItem0: ItemBase;
	private specialItem1: ItemBase;
	private specialItem2: ItemBase;
	private specialItem3: ItemBase;
	/** 是否可以领取 */
	private isReceive: boolean = false;
	private pass: number = 0;
	private rewardCount: number = 0;

	constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();
		this.skinName = "CheckWorldRewardSkin";
		this.isTopLevel = true;
	}
	public open(...param: any[]): void {
		super.open(param);
		this.addTouchEvent(this.closeBtn, this.onTap);
		this.addTouchEvent(this.closeBtn0, this.onTap);
		this.update(param[0]);
	}

	public close(...param: any[]): void {
		super.close(param);
		this.removeTouchEvent(this.closeBtn, this.onTap);
		this.removeTouchEvent(this.closeBtn0, this.onTap);
	}

	/**
	 * 更新
	 * @param	pass	关卡
	 */
	public update(pass: number): void {
		//设置领取按钮状态
		this.isReceive = UserFb.ins().isReceiveBox(pass);
		this.pass = pass > 0 ? pass : 1;
		let config: WorldRewardConfig = GlobalConfig.WorldRewardConfig[this.pass];
		this.rewardCount = config.rewards.length;
		//设置奖励内容
		this.specialItem0.data = config.rewards[0];
		this.specialItem1.data = config.rewards[1];
		this.specialItem2.data = config.rewards[2];
		this.specialItem3.data = config.rewards[3];

		let levelStr: string;
		let chapterStr: string;
		if (pass > 1) {
			let lastConfig: WorldRewardConfig = GlobalConfig.WorldRewardConfig[this.pass - 1];
			levelStr = this.getLevelStr(lastConfig.needLevel, config.needLevel);
			chapterStr = `${lastConfig.needLevel + 1}-${config.needLevel}`;
		}
		else {
			levelStr = this.getLevelStr(config.needLevel - 1, config.needLevel);
			chapterStr = `${config.needLevel}`;
		}
		this.requireLabel.text = `通关第${chapterStr}章（${levelStr}关）的奖励`;

		if (this.isReceive)
			this.closeBtn0.label = "领取";//可领取
		else
			this.closeBtn0.label = "确定";//不可领取
	}

	private getLevelStr(value: number, total: number) {
		return `${value * 10 + 1}-${total * 10}`;
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn://关闭按钮
				ViewManager.ins().close(this);
				break;
			case this.closeBtn0://领取关闭
				if (this.isReceive)
					this.sendReceiveReward();
				else
					UserTips.ins().showTips("|C:0xf3311e&T:通关地图才能领取奖励|");
				ViewManager.ins().close(this);
				break;
		}
	}

	/** 领取奖励 */
	private sendReceiveReward(): void {
		if (UserBag.ins().getSurplusCount() >= this.rewardCount)
			UserFb.ins().sendGuanqiaWroldReward(this.pass);
		else
			UserTips.ins().showTips("|C:0xf3311e&T:背包已满，请清理背包|");
	}
}
ViewManager.ins().reg(GuanQiaWorldRewardWin, LayerManager.UI_Popup);