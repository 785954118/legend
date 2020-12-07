/**转生BOSS标签面板 主面板=BossWin*/
class ZsBossPanel extends BaseComponent {
	//ZSBossPanelSkin
	public head1: eui.Image;
	public rank1: eui.Label;
	public bossName1: eui.Label;
	public rewardList1: eui.List;
	public head2: eui.Image;
	public rank2: eui.Label;
	public bossName2: eui.Label;
	public rewardList2: eui.List;
	public head3: eui.Image;
	public rank3: eui.Label;
	public bossName3: eui.Label;
	public rewardList3: eui.List;
	public head4: eui.Image;
	public rank4: eui.Label;
	public bossName4: eui.Label;
	public rewardList4: eui.List;
	public seeReward: eui.Label;
	public enterGame: eui.Button;

	public bossBg1: eui.Image;
	public bossBg2: eui.Image;
	public bossBg3: eui.Image;
	public bossBg4: eui.Image;


	public cd: eui.Group;
	public clearBtn: eui.Button;
	public timeLable: eui.Label;

	private remainM: number;

	public sign: eui.Image;

	public warnWin: WarnWin;

	constructor() {
		super();
	}

	public childrenCreated(): void {
	}

	public initData(): void {
		let config: OtherBoss1Config;
		for (let i: number = 1; i < 5; i++) {
			config = GlobalConfig.OtherBoss1Config[i];
			(<eui.Image>this["head" + i]).source = "monhead" + GlobalConfig.MonstersConfig[config.bossId].head+"_png";
			(<eui.Label>this["bossName" + i]).text = GlobalConfig.MonstersConfig[config.bossId].name + "(" + config.llimit + "-" + config.hlimit + "转)";
			(<eui.List>this["rewardList" + i]).itemRenderer = ItemBase;
			(<eui.List>this["rewardList" + i]).dataProvider = new eui.ArrayCollection(config.showReward);
		}
		this.seeReward.textFlow = new egret.HtmlTextParser().parser(StringUtils.addColor(`<u>查看奖励</u>`,'#23C42A'));
	}

	public open(): void {
		ZsBoss.ins().sendGetBossList();
		let playIn: string = ZsBoss.ins().acIsOpen ? "查看排名" : "上次排名";
		for (let i: number = 1; i < 5; i++) {
			(<eui.Label>this["rank" + i]).textFlow = new egret.HtmlTextParser().parser(StringUtils.addColor(`<u>${playIn}</u>`,'#23C42A'));
			this.addTouchEvent((<eui.Image>this["head" + i]), this.onTouch);
			this.addTouchEvent((<eui.Label>this["rank" + i]), this.onTouch);
		}
		this.addTouchEvent(this.seeReward, this.onTouch);
		this.addTouchEvent(this.enterGame, this.onTouch);
		this.addTouchEvent(this.clearBtn, this.onTouch);
		this.observe(ZsBoss.ins().postRrmainTime, this.reliveInfoChange);
		this.observe(ZsBoss.ins().postBossList, this.refushBtn);

		this.reliveInfoChange();
		this.refushBtn();
		this.initData();
	}

	public close(): void {
		for (let i: number = 1; i < 5; i++) {
			this.removeTouchEvent((<eui.Image>this["head" + i]), this.onTouch);
			this.removeTouchEvent((<eui.Label>this["rank" + i]), this.onTouch);
		}
		this.removeTouchEvent(this.seeReward, this.onTouch);
		this.removeTouchEvent(this.enterGame, this.onTouch);
		this.removeTouchEvent(this.clearBtn, this.onTouch);

		this.removeObserve();
	}

	public cleanWarnWin(): void {
		if (this.warnWin) {
			ViewManager.ins().close(WarnWin);
		}
	}

	private refushBtn(): void {
		let isPlay: boolean = false;
		let model: ZsBoss = ZsBoss.ins();
		if (model.acIsOpen) {
			let bossListLen: number = model.getBossListLength();
			let data: BossInfoData;
			for (let i: number = 0; i < bossListLen; i++) {
				data = model.getBossInfoByIndex(i);
				if (data.challengeIn) {
					(<eui.Image>this["bossBg" + (i + 1)]).source = "zsboss_04";
					if (data.kill) {
						//被击杀
						this.sign.source = "zsboss_03";
						model.reliveTime = 0;
						this.reliveInfoChange();
					} else {
						//挑战中
						this.sign.source = "zsboss_07";
					}
					this.setSignPoint(i);
					isPlay = true;
					break;
				} else {
					(<eui.Image>this["bossBg" + (i + 1)]).source = "zsboss_01";
				}
			}
			if (!isPlay) {
				let canIndex: number = model.canPlayBossIndex();
				if (canIndex > 0) {
					(<eui.Image>this["bossBg" + canIndex]).source = "zsboss_04";
					data = model.getBossInfoByIndex(canIndex - 1);
					if (data) {
						if (data.kill) {
							//被击杀
							this.sign.source = "zsboss_03";
							model.reliveTime = 0;
							this.reliveInfoChange();
						} else {
							this.sign.source = "";
						}
						this.setSignPoint(canIndex - 1);
					}
				}
			}
		} else {
			this.sign.source = "";
			let canIndex: number = model.canPlayBossIndex();
			if (canIndex > 0) {
				(<eui.Image>this["bossBg" + canIndex]).source = "zsboss_04";
			}
		}
		//设置未激活标示
		for (let index: number = 2; index < 5; index++) {
			if (index > model.aliveBossNum)
				(<eui.Image>this["sign" + index]).source = "zsboss_17";
			else
				(<eui.Image>this["sign" + index]).source = "";
		}
	}

	private setSignPoint(i: number): void {
		this.sign.x = (i % 2) * 210 + 133;
		this.sign.y = Math.floor(i / 2) * 230 + 25;
	}

	private reliveInfoChange(): void {
		let model: ZsBoss = ZsBoss.ins();
		// this.cd.visible = model.checkisAutoRelive();
		this.timeLable.text = "CD：" + model.reliveTime + "秒";
		TimerManager.ins().remove(this.refushLabel, this);
		if (this.cd.visible) {
			this.remainM = model.reliveTime;
			TimerManager.ins().doTimer(1000, this.remainM, this.refushLabel, this, this.overTime, this);
		}
	}

	private overTime(): void {
		this.cd.visible = false;
		this.cleanWarnWin();
	}

	private refushLabel(): void {
		this.remainM--;
		this.timeLable.text = "CD：" + this.remainM + "秒";
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.head1:
			case this.rank1:
				this.openRankWin(1);
				break;
			case this.head2:
			case this.rank2:
				this.openRankWin(2);
				break;
			case this.head3:
			case this.rank3:
				this.openRankWin(3);
				break;
			case this.head4:
			case this.rank4:
				this.openRankWin(4);
				break;
			case this.seeReward:
				ViewManager.ins().open(ZsBossRewardShowWin);
				break;
			case this.enterGame:
				if (ZsBoss.ins().checkIsShowNoticeWin()) {
					this.warnWin = WarnWin.show("每天只能参加<font color='#FFB82A'>1次</font>转生BOSS,确定要进入挑战吗？", () => {
						ZsBoss.ins().sendRequstChallenge();
						ZsBoss.ins().firstShowWin = true;
					}, this);
				} else {
					ZsBoss.ins().sendRequstChallenge();
				}
				break;
			case this.clearBtn:
				if (ZsBoss.ins().checkIsMoreMoney()) {
					this.warnWin = WarnWin.show("确定要消耗<font color='#FFB82A'>300元宝</font>清除CD吗？", () => {
						ZsBoss.ins().sendBuyCd();
					}, this);
				} else {
					UserTips.ins().showTips("元宝不足");
				}
				break;

		}
	}

	private openRankWin(index: number): void {
		// let bossId:number =  GlobalConfig.OtherBoss1Config[index].bossId;
		ZsBoss.ins().sendRequstBossRank(index);
		ViewManager.ins().open(ZsBossRankWin);
	}
}