/**
 * 关卡 - 地区标签页
 */
class GuanQiaRewardPanel extends BaseComponent {
	/** 普通通关奖励 */
	private reward: ItemBase[];
	/** 特殊大奖 */
	private specialItem: ItemBase;
	private specialItem1: ItemBase;
	/** 挑战按钮 */
	public challengeBtn: eui.Button;
	/** 领取奖励 */
	public getawardBtn: eui.Button;
	/** 进度条 */
	private bar: eui.ProgressBar;
	/** 描述 */
	private desc: eui.Label;
	/** 还需波数 */
	private needWave: eui.Label;
	/** 奖励描述 */
	private rewardDesc: eui.Label;
	public seeRank: eui.Label;
	public harm2: eui.Label;
	public name2: eui.Label;
	public harm1: eui.Label;
	public name1: eui.Label;
	public harm0: eui.Label;
	public name0: eui.Label;
	private info: eui.Group;
	private award: eui.Group;
	public rankDis: eui.Group;
	/** 装备信息*/
	private labelInfo: eui.Label;
	//新加
	/** 地区奖励宝箱 */
	private mapImage: eui.Image;
	/** 地区奖励宝箱红点 */
	private redPointBox: eui.Image;
	/** 地图名字 */
	private mapNameTxt: eui.Label;
	/** 宝箱指向关卡 */
	private boxPass: number = 0;
	private headGroup: eui.Group;

	private goldTxt0: eui.Label;
	private goldTxt1: eui.Label;

	private expTxt0: eui.Label;
	private expTxt1: eui.Label;

	constructor() {
		super();
	}

	public childrenCreated(): void {
		this.init();
	}

	public init(): void {
		this.reward = [];
		for (let i = 0; i < 5; i++) {
			this.reward[i] = this['item' + i]
		}

		let str: string = "<font color='#20A208'><u>查看排行</u></font>";
		this.seeRank.textFlow = new egret.HtmlTextParser().parser(str);

		this.bar.value = 0;
		this.award.visible = false;
		this.challengeBtn.visible = true;

		this.mapImage.touchEnabled = true;
		this.bar.slideDuration = 0;
		this.headGroup.removeChildren();
	}

	public open(): void {
		this.addTouchEvent(this.challengeBtn, this.onTouchTap);
		this.addTouchEvent(this.seeRank, this.onTouchTap);
		this.addTouchEvent(this.getawardBtn, this.onTouchTap);
		this.addTouchEvent(this.mapImage, this.onTouchTap);
		this.observe(GameLogic.ins().postEnterMap, this.upDataGuanqia);
		this.observe(UserFb.ins().postZhangJieAwardChange, this.upDataGuanqia);
		this.observe(UserFb.ins().postGuanqiaWroldReward, this.upDateGuanqiaWroldReward);
		this.observe(Rank.ins().postRankingData, this.updataFirstThree);
		Rank.ins().sendGetRankingData(RankDataType.TYPE_PASS);
		this.upDateGuanqiaWroldReward();
		this.update();
	}

	public close(): void {
		this.removeTouchEvent(this.challengeBtn, this.onTouchTap);
		this.removeTouchEvent(this.seeRank, this.onTouchTap);
		this.removeTouchEvent(this.getawardBtn, this.onTouchTap);
		this.removeTouchEvent(this.mapImage, this.onTouchTap);
		this.removeObserve();
	}

	private onTouchTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.challengeBtn://挑战按钮
				UserFb.ins().autoPk();
				break;
			case this.getawardBtn://通关领取章节奖励按钮
				let config: ChaptersRewardConfig = GlobalConfig.ChaptersRewardConfig[UserFb.ins().guanqiaReward];
				let awards: RewardData[] = config.rewards;
				let num: number = 0;
				for (let i: number = 0; i < awards.length; i++) {
					if (awards[i].type == 1 && awards[i].id < 200000)
						num++;
				}
				if (UserBag.ins().getSurplusCount() >= num)
					UserFb.ins().sendGetAward();
				else
					UserTips.ins().showTips("|C:0xf3311e&T:背包已满，请清理背包|");
				break;
			case this.seeRank://查看排名按钮
				if (Rank.ins().rankModel[RankDataType.TYPE_PASS] && Rank.ins().rankModel[RankDataType.TYPE_PASS].getDataList().length > 0) {
					ViewManager.ins().open(FbAndLevelsRankWin, RankDataType.TYPE_PASS);
				} else {
					UserTips.ins().showTips("|C:0xf3311e&T:排行榜暂时未开放|");
				}
				break;
			case this.mapImage://地区奖励宝箱按钮
				ViewManager.ins().open(GuanQiaWorldRewardWin, UserFb.ins().getWorldGuanQiaBox());
				break;
		}
	}

	private upDataGuanqia(): void {
		this.update();
	}

	private upDateGuanqiaWroldReward(): void {
		this.boxPass = UserFb.ins().getWorldGuanQia();
		this.redPointBox.visible = UserFb.ins().isReceiveBox(this.boxPass);
	}

	public update(): void {
		let guanqiaID: number = UserFb.ins().guanqiaID;
		let config: ChaptersRewardConfig = GlobalConfig.ChaptersRewardConfig[UserFb.ins().guanqiaReward];
		let preConfig: ChaptersRewardConfig = GlobalConfig.ChaptersRewardConfig[UserFb.ins().guanqiaReward - 1];
		if (!config) {
			config = preConfig;
			this.award.visible = false;
			this.info.visible = true;

			this.goldTxt0.text = "";
			this.expTxt0.text = "";

			this.goldTxt1.text = "";
			this.expTxt1.text = "";
		} else {
			this.bar.maximum = preConfig ? config.needLevel - preConfig.needLevel : config.needLevel;
			this.bar.value = guanqiaID - (preConfig ? preConfig.needLevel : 0) - 1;
			this.award.visible = this.bar.value == this.bar.maximum;
			this.info.visible = !this['award'].visible;

			this.goldTxt0.text = UserFb.ins().goldEff + "/小时";
			this.expTxt0.text = UserFb.ins().expEff + "/小时";

			this.goldTxt1.text = "";
			this.expTxt1.text = "";
		}
		//更新boss头像 
		this.mapNameTxt.text = `第${config.id}章 ${config.name}`;

		this.specialItem.data = config.rewards[0];
		this.specialItem1.data = config.rewards[0];
		if (this.specialItem1.getText() == "麻痹碎片") {
			this.labelInfo.text = "麻痹戒指：每次攻击有几率麻痹敌人，使敌人无法攻击";
		} else if (this.specialItem1.getText() == "护身碎片") {
			this.labelInfo.text = "护身戒指：被攻击时优先消耗魔法值抵消伤害";
		} else {
			this.labelInfo.text = "";
		}
		this.desc.text = `通关 ${config.name} 所有关卡可获得特戒碎片奖励`;
		this.rewardDesc.text = `通关 ${config.name} 全部关卡奖励`;


		this.updateChallenge();

		this.updataFirstThree(Rank.ins().rankModel[RankDataType.TYPE_PASS]);

		//挑战引导
		this.showChallengeGuide();
	}

	private updateChallenge(): void {
		this.needWave.visible = false;
		if (UserFb.ins().guanqiaID >= UserFb.ins().maxLen) {
			this.challengeBtn.visible = false;
			this.needWave.visible = true;
			this.needWave.text = "恭喜通关所有关卡";
		}
	}

	/**
	 * 显示挑战引导
	 * @returns void
	 */
	private showChallengeGuide(): void {
		//前4个关卡 + 可以打 + 没打过
		if (UserFb.ins().guanqiaID <= 1
			&& UserFb.ins().isShowBossPK()
			&& !UserFb.ins().bossIsChallenged) {
		}
	}

	public updataFirstThree(rankModel: RankModel): void {
		if (!rankModel) {
			this.name0.text = this.name1.text = this.name2.text = "暂无";
			this.harm0.text = this.harm1.text = this.harm2.text = "0";
			return;
		}
		if (rankModel.type != RankDataType.TYPE_PASS)
			return;
		for (let i: number = 0; i < 4; i++) {

			if (i == 3) {
				this["rank" + i].text = 0 < rankModel.selfPos && rankModel.selfPos <= 1000 ? rankModel.selfPos + '' : "未上榜";
				this["harm" + i].text = UserFb.ins().guanqiaID + "关";
				return;
			}
			let data = rankModel.getDataList(i);
			if (data) {
				this["name" + i].text = data[RankDataType.DATA_PLAYER];
				this["harm" + i].text = data[RankDataType.DATA_COUNT] + "关";
			} else {
				this["name" + i].text = "暂无";
				this["harm" + i].text = "0";
			}
		}
	}
}