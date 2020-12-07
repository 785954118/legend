/**
 * 玩法显示
 */
class PlayFunView extends BaseEuiView {
	public destoryView() {
	}

	private topGroup: eui.Group;
	private topMain: eui.Group;
	private downGroup: eui.Group;
	private leftGroup: eui.Group;
	private rightGroup: eui.Group;

	private reliveBossLab: eui.Label;
	private newBossRelive: eui.Label;

	public taskTraceBtn: eui.Group;
	public taskTraceName: eui.Label;
	private taskTraceAwards: eui.Label;

	/** 野外boss提示 */
	private willBossPrompt: MovieClip;

	/** 自动挑战 */
	public autoPkBoss: eui.ToggleButton;


	/** 图标规则列表（RuleIconBase） */
	private ruleList = {};
	private ruleParent = {};
	private ruleIdList = {};
	public ruleEff = {};

	private btn_toolbar: eui.ToggleButton;

	/** 金钱 */
	private goldTxt: eui.Label;
	/** 元宝 */
	private ybTxt: eui.Label;

	/** 名字 */
	private nameTxt: eui.Label;
	/** 等级 */
	private lvTxt: eui.Label;

	public recharge1: eui.Button;
	public recharge2: eui.Button;
	// public testPay: eui.Button;

	private warmImage: eui.Image;
	private iconGroup: eui.Group;
	private headRedPoint: eui.Image;

	private bossWarmMc: MovieClip;
	private mcGroup: eui.Group;
	private alphaGroup: eui.Group;
	private levelNum: eui.BitmapLabel;

	private mapName0: eui.Label;

	private groupGuanqia: eui.Group;
	public guanqiaBtn: eui.Button;
	private guanQicMc: MovieClip;

	private guanqiaEff0: eui.Group;
	private guanqiaBar: eui.ProgressBar;

	private guanQiaLineMc: MovieClip;

	private taskAsseptMc: MovieClip;
	private taskComMc: MovieClip;
	private taskEffTypes: number[] = [];

	public pkBossBtnGroup: eui.Group;

	private maskImg: eui.Image;

	public location: eui.Group;
	public hejiguide: eui.Group;
	public hejiRule: any;

	private flameMC: MovieClip;
	private flameGroup: eui.Group;
	private fightImg: eui.Image;
	private power: egret.DisplayObjectContainer;

	private vipGroup: eui.Group;
	private face: eui.Image;
	private vipImg0: eui.Image;
	private vipNum: egret.DisplayObjectContainer;
	private vipBtn0: eui.Button;

	public btnGuanQiaGroup: eui.Group;

	private redPointVip0: eui.Image;

	private expGroup: eui.Group;
	private expTxt: eui.Label;

	public preRecharge: boolean = false;
	public preVip: boolean = false;

	public flower: eui.Group;

	private _flowerShowItem: FlowerShowItem;

	private showViewList: { [key: number]: egret.DisplayObject };

	private rulePos: { [key: number]: egret.DisplayObjectContainer };

	public hongbao: eui.Group;

	constructor() {
		super();
		this.touchEnabled = false;
		// doGuanqiaUpdate
	}
	
	@callLater
	public initData(): void {
		CommonUtils.labelIsOverLenght(this.goldTxt, Actor.gold);
		CommonUtils.labelIsOverLenght(this.ybTxt, Actor.yb);
		//设置名字
		this.nameTxt.text = Actor.myName;
		//设置等级
		this.expChange();

		BitmapNumber.ins().changeNum(this.power, Actor.power, "8", 5);

		this.vipNum.x = UserVip.ins().lv >= 10 ? this.vipImg0.x + this.vipImg0.width + 5 : this.vipNum.x = this.vipImg0.x + this.vipImg0.width + 10;
		BitmapNumber.ins().changeNum(this.vipNum, UserVip.ins().lv, "zv0", 8);
		this.upDataVipBtnRedPoint()

		// UserFb.ins().doGuanqiaUpdate
	}

	public initUI(): void {
		super.initUI();

		this.skinName = "PlayFunSkin";

		this.showViewList = {};
		this.showViewList[PlayFunShow.topMain] = this.topMain;
		this.showViewList[PlayFunShow.leftGroup] = this.leftGroup;
		this.showViewList[PlayFunShow.rightGroup] = this.rightGroup;
		this.showViewList[PlayFunShow.downGroup] = this.downGroup;
		this.showViewList[PlayFunShow.topGroup] = this.topGroup;

		this.rulePos = {
			0: this.downGroup,
			1: this.iconGroup,
			2: this.leftGroup,
			3: this.rightGroup
		}

		this.flameMC = new MovieClip();
		this.flameMC.x = 72;
		this.flameMC.y = 21;
		this.flameGroup.addChildAt(this.flameMC, 0);

		this.power = BitmapNumber.ins().createNumPic(0, "8", 5);
		this.power.scaleX = this.power.scaleY = 0.8;
		this.power.x = this.fightImg.x + 53;
		this.power.y = this.fightImg.y + 4;
		this.flameGroup.addChild(this.power);

		this.guanQicMc = new MovieClip();
		// this.guanQicMc.x = 83;
		// this.guanQicMc.y = 81;
		this.guanQicMc.touchEnabled = false;

		this.expBallMc = new MovieClip;
		this.expBallMc.x = 80;
		this.expBallMc.y = 86;
		this.expBallMc.touchEnabled = false;

		this.guanQiaLineMc = new MovieClip();
		this.guanQiaLineMc.x = 83;
		this.guanQiaLineMc.y = 107;
		this.guanQiaLineMc.touchEnabled = false;

		this.taskAsseptMc = new MovieClip();
		this.taskAsseptMc.x = 140;
		this.taskAsseptMc.y = -50;
		this.taskAsseptMc.touchEnabled = false;

		this.taskComMc = new MovieClip();
		this.taskComMc.x = 140;
		this.taskComMc.y = -80;
		this.taskComMc.touchEnabled = false;

		let roleData: Role = SubRoles.ins().getSubRoleByIndex(0);
		this.face.source = `yuanhead${roleData.job}${roleData.sex}`;

		this.vipNum = BitmapNumber.ins().createNumPic(UserVip.ins().lv, "zv0", 8);
		this.vipNum.x = UserVip.ins().lv >= 10 ? this.vipImg0.x + this.vipImg0.width + 5 : this.vipNum.x = this.vipImg0.x + this.vipImg0.width + 10;

		this.vipNum.y = this.vipImg0.y;
		this.vipGroup.addChild(this.vipNum);

		this.guanqiaBar.slideDuration = 0;


		this.publicBossRelive(false);

		RuleIconBase.update = this.updateRule.bind(this);
		RuleIconBase.updateShow = this.updateRuleAndSort.bind(this);

		this.initRuleList();
	}

	private initRuleList() {
		let configs = GlobalConfig.PlayFunConfig;
		for (let id in configs) {
			let config = configs[id];
			let cls = egret.getDefinitionByName(config.cls);
			if (!cls) {
				alert(`功能入口配置错误，id:${id} cls:${config.cls}`);
			} else {

				this.addRuleList(new cls(config.id));
			}
		}

		this.groupGuanqia.touchEnabled = false;
		this.addRuleList(new GuangqiaIconRule(0, this.groupGuanqia));
		this.addRuleList(new TaskTraceIconRule(0, this.taskTraceBtn));
		this.hejiRule = new HejiIconRule(0, this.hejiguide);
		this.addRuleList(this.hejiRule);
	}

	public addRuleList(rule: RuleIconBase) {

		this.ruleList[rule.hashCode] = rule;

		if (rule.id) {
			this.ruleIdList[rule.id] = rule;
		}


		if (rule.tar && rule.tar.parent) {
			this.ruleParent[rule.hashCode] = rule.tar.parent;
			rule.tar.parent.removeChild(rule.tar);
		} else {

			let config = GlobalConfig.PlayFunConfig[rule.id];

			this.ruleParent[rule.hashCode] = this.rulePos[config.pos];
		}
	}

	private showViews([handle, reverse]) {
		let value = 1;
		while (PlayFunShow[value]) {
			var b = (handle & value) == value;
			this.showView(value, reverse ? !b : b);
			value *= 2;
		}
	}

	public showView(handle: number, b: boolean) {
		this.showViewList[handle].visible = b;
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.btn_toolbar, this.onTap);
		this.addTouchEvent(this.autoPkBoss, this.onChange);
		this.addTouchEvent(this.vipBtn0, this.onTap);
		this.addTouchEvent(this.taskTraceBtn, this.onTaskTrace);
		this.addTouchEvent(this.guanqiaBtn, this.onTaskTrace);
		this.addTouchEvent(this.guanqiaBtn, this.guanqiaBtnClick);
		this.addTouchEvent(this.face, this.onTap);
		this.addTouchEvent(this.expGroup, this.onTap);
		this.addTouchEvent(this.mapName0, this.onTap);
		this.observe(GameLogic.ins().postEnterMap, this.upDataGuanqia);
		this.observe(UserFb.ins().postGuanqiaInfo, this.upDataGuanQiaInfo);
		this.observe(UserFb.ins().postGuanKaIdChange2, this.updateExp);//下发新红包
		this.observe(UserTask.ins().postUpdteTaskTrace, this.changeTaskTrace);
		this.observe(UserTask.ins().postUpdteTaskTrace, this.updateTaskState);
		this.observe(UserFb.ins().postGuanKaIdChange, this.guanqiaChange);

		this.observe(GameLogic.ins().postSubRoleChange, this.initData);
		this.observe(Actor.ins().postGoldChange, this.initData);
		this.observe(Actor.ins().postYbChange, this.initData);
		this.observe(Actor.ins().postNameChange, this.initData);
		this.observe(Actor.ins().postPowerChange, this.initData);
		this.observe(GameLogic.ins().postExpMc, this.addExpFlyMc);
		this.observe(UserFb.ins().postAddEnergy, this.upDataGuanqia);
		this.observe(UserFb.ins().postPlayWarm, this.warmWord);

		this.observe(UserVip.ins().postUpdateVipData, this.initData);

		this.observe(UserVip.ins().postUpdataExp, this.upDataVipBtnRedPoint);
		this.observe(UserVip.ins().postUpdateVipAwards, this.upDataVipBtnRedPoint);
		this.observe(UserVip.ins().postUpdateWeekAwards, this.upDataVipBtnRedPoint);
		this.observe(Actor.ins().postLevelChange, this.updateHeadRedPoint);
		this.observe(GameLogic.ins().postLevelBarChange, this.updateLevelBar);
		this.observe(Actor.ins().postExp, this.checkGuide);

		this.observe(PlayFun.ins().postShowViews, this.showViews);
		this.observe(UserFb.ins().postTeamFbFlowarRecords, this.updateFlower);
		this.observe(UserFb.ins().postAutoPk, this.GuanQiaEffLogic);
		this.observe(UserFb.ins().postAutoPk2, this.GuanQiaEffLogic);

		this.addTouchEvent(this.recharge1, this.onTap);
		this.addTouchEvent(this.recharge2, this.onTap);
		// this.addTouchEvent(this.testPay, this.onTap);

		this.initData();

		this.upDataGuanQiaInfo();

		this.changeTaskTrace();

		this.addRuleEvent();
		this.updateRules();
		this.upDataWillBoss(Encounter.ins().willBossID);
		this.updateHeadRedPoint();
		// HBSystem.ins().updateHongBao();
		this.flameMC.playFile(RES_DIR_EFF + "zhanduolibeijing", -1);
	}

	public close(...param: any[]): void {
		this.removeGuanQiaEnergy();
		this.removeRuleEvent();
		this.hongbao.removeChildren();
		DisplayUtils.removeFromParent(this._flowerShowItem);
	}

	/** 设置等级 */
	private expChange(lvl?: number): void {
		let lv: number = lvl || Actor.level;
		let zs: number = UserZs.ins() ? UserZs.ins().lv : 0;
		let strLv: string = "|C:0xF1D715&T:" + (zs ? zs + "转" : "") + "|";
		strLv = strLv + lv + "级";
		this.lvTxt.textFlow = TextFlowMaker.generateTextFlow(strLv);
	}

	public hideBtn(): void {
		this.iconGroup.visible = !this.btn_toolbar.selected;
	}

	private addRuleEvent(): void {
		for (let i in this.ruleList) {
			let rule: RuleIconBase = this.ruleList[i];
			rule.addShowEvents();
			if (rule.isShow) {
				rule.addRedEvents();
				ResourceMgr.ins().reloadContainer(rule.tar);
			}
		}
	}

	private removeRuleEvent(): void {
		for (let i in this.ruleList) {
			let rule: RuleIconBase = this.ruleList[i];
			rule.removeEvents();
		}
	}

	private updateRules(): void {
		TimerManager.ins().doTimer(1000, 1, function () {
			if (!TimerManager.ins().isExists(this.startUpdateRule, this)) TimerManager.ins().doTimer(60, 1, this.startUpdateRule, this);
		}, this);
	}

	private startUpdateRule(): void {
		let isChanged: boolean = false;
		for (let i in this.ruleList) {
			let rule: RuleIconBase = this.ruleList[i];
			let hasChanged = this.updateShow(rule);
			if (hasChanged) isChanged = true;

			//若没有改变并且已经显示的，则检查红点
			if (!hasChanged && rule.isShow) {
				this.updateRule(rule);
			}
		}
		//排序按钮
		if (isChanged) this.sortBtnList();
		//检测相关引导弹出页面
		this.checkGuide();
	}

	private checkGuide() {
		DieGuide.ins().checkFirstChargeOrVIPWin();
	}

	private updateRuleAndSort(rule: RuleIconBase): void {
		/**延迟刷新,缓解因为通信延迟而造成的update不及时*/
		TimerManager.ins().doTimer(100, 1, function () {
			//如果按钮有显示改变，则排序按钮
			if (this.updateShow(rule)) {
				this.sortBtnList(rule);
			}

		}, this);
	}

	private updateShow(rule: RuleIconBase): boolean {
		let isShow = rule.checkShowIcon();
		let tar: egret.DisplayObjectContainer;
		//跨服场景中不开启任何图标
		if (KFServerSys.ins().isLinkingKF) isShow = false;
		if (rule.isShow == isShow) return false;

		rule.isShow = isShow;

		if (isShow) {
			rule.addRedEvents();
			tar = rule.getTar();
			tar.addEventListener(egret.TouchEvent.TOUCH_TAP, rule.tapExecute, rule);

			let tarParent = this.ruleParent[rule.hashCode];
			tarParent.addChild(tar);

			ResourceMgr.ins().reloadContainer(tar);

			this.updateRule(rule);
		} else {
			rule.removeRedEvents();

			tar = rule.tar;

			if (tar) {
				tar.removeEventListener(egret.TouchEvent.TOUCH_TAP, rule.tapExecute, rule);
				DisplayUtils.removeFromParent(tar);
				DisplayUtils.removeFromParent(this.ruleEff[tar.hashCode]);
			}
		}

		return true;
	}

	private updateRule(rule: RuleIconBase) {
		let count = 0;
		let tar = rule.getTar();
		if (tar['redPoint']) {
			count = rule.checkShowRedPoint();
			tar['redPoint'].visible = count;

			// if (tar['txt']) {
			// 	tar['txt'].text = count ? count : "";
			// }
		}
		let effName = rule.getEffName(count);
		if (effName) {
			if (!this.ruleEff[tar.hashCode] || !this.ruleEff[tar.hashCode].parent) {
				let mc = this.getEff(tar.hashCode, effName);
				if (effName == 'achieveCom') {
					mc.x = rule.effX + 85 ;
					mc.y = rule.effY - 10;
				} else if (effName == 'GWOpenEff') {
					mc.x = rule.effX + 85;
					mc.y = rule.effY - 10;
				} else {
					mc.x = rule.effX;
					mc.y = rule.effY;
				}

				tar.addChildAt(mc, 100);
			}
			else {
				(<MovieClip>this.ruleEff[tar.hashCode]).play(-1);
			}
		} else {
			DisplayUtils.removeFromParent(this.ruleEff[tar.hashCode]);
		}
	}

	private getEff(value: number, effName?: string): MovieClip {
		this.ruleEff[value] = this.ruleEff[value] || new MovieClip;
		if (effName)
			(this.ruleEff[value] as MovieClip).playFile(RES_DIR_EFF + effName, -1);
		// console.log('播放的动销名称 ： ' + effName)
		return this.ruleEff[value];
	}


	private onChange(e: egret.Event): void {
		if (UserFb.ins().guanqiaID <= 10) {
			UserTips.ins().showTips(`通关到第${10}关开启`);
			this.autoPkBoss.selected = false;
		} else if (this.autoPkBoss.selected) {
			if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
				UserTips.ins().showTips(`背包剩余空位不足，请先清理`);
				this.autoPkBoss.selected = false;
			} else if (UserFb.ins().guanqiaID < UserFb.AUTO_GUANQIA) {
				UserTips.ins().showTips(`|C:0xff0000&T:挑战至${UserFb.AUTO_GUANQIA}关开启`);
				this.autoPkBoss.selected = false;
			} else if (UserFb.ins().guanqiaID >= GlobalConfig.InstanceBaseConfig.maxCheckPoint) {
				UserTips.ins().showCenterTips(`当前已达最大关卡`);
				this.autoPkBoss.selected = false;
			} else {
				this.GuanQiacleanEff();
				PlayFun.ins().openAuto();
			}
		} else {
			PlayFun.ins().closeAuto();
		}
		e.stopPropagation();
		e.stopImmediatePropagation();
	}

	private guanqiaChange(): void {
		this.maskImg.visible = (UserFb.ins().guanqiaID <= 10);
	}

	private onTaskTrace(e: egret.TouchEvent) {
		let data: AchievementData = UserTask.ins().taskTrace;
		if (data && data.state == 0) {
			let config = UserTask.ins().getAchieveConfById(data.id);
			switch (config.control) {
				case GuideType.ChallengeBoss:
				case GuideType.AutoPk:
					if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
						return;
					}
					if (UserFb.ins().currentEnergy < UserFb.ins().energy) {
						this.showTaskTips(`能量未满无法挑战，请继续清怪。`);
					}
					if (config.control == GuideType.AutoPk) {
						// let cfg:AchievementTaskConfig = GlobalConfig.AchievementTaskConfig[UserTask.ins().taskTrace.id];
						Hint.ins().postKillBoss(config);
					}
					break;
				case GuideType.KillDeer:
					let text = `正在完成清怪任务，还差|C:0xf8b141&T:${config.target - data.value}|个。`;
					this.showTaskTips(text);
					break;
			}
		}
	}

	private guanqiaBtnClick(e: egret.TouchEvent) {
		if (UserFb.ins().guanqiaID >= GlobalConfig.InstanceBaseConfig.maxCheckPoint) {
			UserTips.ins().showCenterTips(`当前已达最大关卡`);
			return;
		}
		if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
			ViewManager.ins().open(BagFullTipsWin);
		} else {
			if (UserFb.ins().currentEnergy >= UserFb.ins().energy) {
				this.GuanQiacleanEff();
				UserFb.ins().autoPk();
				UserFb.ins().firstAutoGuilder = (UserFb.ins().guanqiaID == (UserFb.AUTO_GUANQIA - 1));
			} else {
				// UserTips.ins().showTips("|C:0xf3311e&T:能量不足|");
			}

		}
	}

	public showTaskTips(text) {
		UserTips.ins().showTaskTips(text);
		// let tips = this.taskTip;
		// let label = tips.getChildAt(1) as eui.Label;
		// label.textFlow = TextFlowMaker.generateTextFlow1(text);
		// egret.Tween.removeTweens(tips);
		// tips.bottom = 182;
		// tips.visible = true;
		// egret.Tween.get(tips).to({bottom: 232}, 500).wait(2000).call(() => {
		// 	tips.visible = false;
		// });
	}

	private onTap(e: egret.TouchEvent): void {
		let tar = e.currentTarget;
		switch (tar) {
			case this.willBossPrompt:
				ViewManager.ins().open(BossWin, 1);
				break;
			case this.btn_toolbar:
				this.hideBtn();
				break;
			case this.recharge1:
				let rdata: RechargeData = Recharge.ins().getRechargeData(0);
				if (!rdata || rdata.num != 2) {
					ViewManager.ins().open(Recharge1Win);
				} else {
					ViewManager.ins().open(ChargeFirstWin);
				}

				break;
			case this.recharge2:
				// if (GameServer.serverOpenDay < 2) {
				// 	UserTips.ins().showTips("|C:0xf3311e&T:开服第三天开启摇钱树|");
				// 	return;
				// }
				// ViewManager.ins().open(FuliWin);
				Shop.openBuyGoldWin();
				break;
			case this.vipBtn0:
				ViewManager.ins().open(VipWin);
				break;
			case this.face:
				ViewManager.ins().open(SettingView);
				if (this.headRedPoint.visible) {
					Setting.ins().setValue(ClientSet.headRed, 1);
					this.updateHeadRedPoint();
				}
				break;
			case this.expGroup:
			case this.mapName0:
				ViewManager.ins().open(EffectivenessTip, 1);
				break;
		}
	}

	private changeTaskTrace(): void {
		let data: AchievementData = UserTask.ins().taskTrace;
		if (data) {
			let config: AchievementTaskConfig = UserTask.ins().getAchieveConfById(data.id);
			if (!config) {
				console.log(`任务配置${data.id}不存在！`);
				return;
			}

			if (config.type == 79) {
				this.taskTraceAwards.textFlow = TextFlowMaker.generateTextFlow("|C:0x40df38&T:" + config.desc + "|");
			} else {
				this.taskTraceAwards.text = "" + config.desc;
			}
			switch (data.state) {
				case 0:
					let maxtarget = config.target;
					let value = data.value;
					if (config.type == 79) {//79写死0/1
						value = 0;
						maxtarget = 1;
					}
					//目标描述有误
					if (config.type == 36) {
						value -= 1;
						maxtarget -= 1;
					}
					this.taskTraceName.textFlow = TextFlowMaker.generateTextFlow(config.name + "|C:0xf3311e&T: (" + value + "/" + maxtarget + ")|");
					if (data.value == 0) GameGuider.stopTaskEffect();
					GameGuider.startTaskEffect();
					break;
				case 1:
					this.taskTraceName.textFlow = TextFlowMaker.generateTextFlow(config.name + "|C:0x35e62d&T: (已完成)|");
					GameGuider.stopTaskEffect();
					GameGuider.startTaskEffect();
					break;
			}
			let t: egret.Tween = egret.Tween.get(this.taskTraceAwards);
			t.to({
				"x": this.taskTraceAwards.x + 100,
				"alpha": 0
			}, 200).to({ "x": 0 }, 200).to({ "x": 61, "alpha": 1 }, 200);
			let t1: egret.Tween = egret.Tween.get(this.taskTraceName);
			t1.to({
				"x": this.taskTraceName.x + 100,
				"alpha": 0
			}, 200).to({ "x": 0 }, 200).to({ "x": 61, "alpha": 1 }, 200);
		} else {
			GameGuider.stopTaskEffect();
		}
	}

	private updateTaskState() {
		let data: AchievementData = UserTask.ins().taskTrace;
		if (data) {
			if (data.state == 1) {
				if (this.taskAsseptMc.parent) {
					if (this.taskEffTypes.indexOf(1) < 0) this.taskEffTypes.push(1);
				} else if (!this.taskComMc.parent) {
					this.addTaskEffectIndex(1);
				}
			} else if (data.state == 0 && data.value == 0) {
				if (this.taskComMc.parent) {
					if (this.taskEffTypes.indexOf(0) < 0) this.taskEffTypes.push(0);
				} else if (!this.taskAsseptMc.parent) {
					this.addTaskEffectIndex(0);
				}
			}
		}
	}

	private addTaskEffectIndex(index: number) {
		if (index == 0) {
			this.taskTraceBtn.addChild(this.taskAsseptMc);
			this.taskAsseptMc.playFile(`${RES_DIR_EFF}receive`, 1, () => {
				TimerManager.ins().doNext(() => {
					if (this.taskEffTypes.length) {
						this.addTaskEffectIndex(this.taskEffTypes.shift());
					}
				}, this);
			});
			SoundUtil.ins().playEffect(SoundUtil.TASK);
			this.taskAsseptMc.y = -50;
		} else if (index == 1) {
			this.taskTraceBtn.addChild(this.taskComMc);
			this.taskComMc.playFile(`${RES_DIR_EFF}complete`, 1, () => {
				TimerManager.ins().doNext(() => {
					if (this.taskEffTypes.length) {
						this.addTaskEffectIndex(this.taskEffTypes.shift());
					}
				}, this);
			});
			this.taskComMc.y = -80;
		}
	}

	public lastEnergy: number = -1;

	private updateExp(): void{
		if(UserFb.ins().doubleTime > 0){
			this.expTxt.textFlow = TextFlowMaker.generateTextFlow(`|C:0xF40909&T:${UserFb.ins().doubleExp}|/小时`);
		}else{
			this.expTxt.textFlow = TextFlowMaker.generateTextFlow(`|C:0x35e62d&T:${UserFb.ins().expEff}|/小时`);
		}
	}
	private upDataGuanQiaInfo(): void {
		if(UserFb.ins().doubleTime > 0){
			this.expTxt.textFlow = TextFlowMaker.generateTextFlow(`|C:0xF40909&T:${UserFb.ins().doubleExp}|/小时`);
		}else{
			this.expTxt.textFlow = TextFlowMaker.generateTextFlow(`|C:0x35e62d&T:${UserFb.ins().expEff}|/小时`);
		}
		
		this.mapName0.textFlow = TextFlowMaker.generateTextFlow(`第|C:0x35e62d&T:${UserFb.ins().guanqiaID}|关`);
		this.upDataGuanqia();
	}

	private upDataGuanqia(): void {
		let gqID = UserFb.ins().guanqiaID;
		if (gqID >= 0 && GameMap.sceneInMain()) {
			this.upDataExpMcBall(UserFb.ins().currentEnergy, UserFb.ins().energy);
			if (UserFb.ins().energy && UserFb.ins().currentEnergy >= UserFb.ins().energy) {
				if (this.guanQicMc && !this.guanQicMc.parent) {
					this.guanQicMc.playFile(RES_DIR_EFF + "guankabtn", -1);
					// this.groupGuanqia.addChild(this.guanQicMc);
					this.guanqiaEff0.addChild(this.guanQicMc);
					this.guanqiaEff0.touchEnabled = this.guanQicMc.touchEnabled = false;
				}
			} else {
				if (UserFb.ins().energy > 0 && this.lastEnergy != UserFb.ins().currentEnergy && this.lastEnergy != -1) {
					this.playGuanQiaDoorMc();
				}
				DisplayUtils.removeFromParent(this.guanQicMc);
			}
			this.lastEnergy = UserFb.ins().currentEnergy;
		}
		else {
			DisplayUtils.removeFromParent(this.guanQicMc);
			this.lastEnergy = -1;
		}
		if (gqID < UserFb.AUTO_GUANQIA)
			this.pkBossBtnGroup.visible = false;
		else
			this.pkBossBtnGroup.visible = true;
	}

	private removeGuanQiaEnergy(): void {
		DisplayUtils.removeFromParent(this.guanQicMc);
		UserFb.ins().currentEnergy = 0;
	}

	private upDataExpMcBall(value, total): void {
		this.setGuanQiaBar(value, total);
	}

	public upDataWillBoss(id: number): void {
		if (id) {
			this.willBossPrompt = this.willBossPrompt || new MovieClip();
			this.willBossPrompt.playFile(RES_DIR_EFF + "zaoyuBoss", -1);
			this.willBossPrompt.y = 500;
			this.willBossPrompt.x = 330;
			this.willBossPrompt.touchEnabled = true;
			this.addTouchEvent(this.willBossPrompt, this.onTap);
			this.addChild(this.willBossPrompt);
		}
		else if (this.willBossPrompt) {
			DisplayUtils.removeFromParent(this.willBossPrompt);
			this.removeTouchEvent(this.willBossPrompt, this.onTap);
		}
	}

	public updateHeadRedPoint(): void {
		if (Actor.level >= 30 && !Setting.ins().getValue(ClientSet.headRed)) {
			this.headRedPoint.visible = true;
		} else {
			this.headRedPoint.visible = false;
		}
	}

	public updateLevelBar(lv: number) {
		this.expChange(lv);
	}


	public publicBossRelive(isShow: boolean, bossName: string = ""): void {
		//取消提示，且boss名字不对应，则跳出处理
		if (!isShow && bossName && bossName != this.reliveBossLab.name) return;
		let boo: boolean = UserBoss.ins().checkBossIconShow();

		let isVisible = isShow && boo && (GameMap.sceneInMain());

		PlayFun.ins().newBossRelive = this.newBossRelive.visible = isVisible;
		this.reliveBossLab.name = isShow ? bossName : "1";
		if (!isVisible) return;
		this.reliveBossLab.textFlow = new egret.HtmlTextParser().parser(`${StringUtils.addColor(`${bossName}`, "#35e62d")}刷新了！`);
	}

	private sortRule(a: RuleIconBase, b: RuleIconBase): number {
		let ac = GlobalConfig.PlayFunConfig[a.id];
		let bc = GlobalConfig.PlayFunConfig[b.id];
		if (ac.sort < bc.sort)
			return -1;
		else
			return 1;
	}

	private sortBtnList(rule: RuleIconBase = null): void {
		let pos = -1;
		if (rule) {
			let config = GlobalConfig.PlayFunConfig[rule.id];
			if (!config) return;
			pos = config.pos;
		}

		let btnDic = {};
		if (pos == -1) {
			btnDic[0] = [];
			btnDic[1] = [[], [], []];//顶层入口有3层
			btnDic[2] = [];
			btnDic[3] = [];
		} else {
			if (pos != 1) btnDic[pos] = [];
			else btnDic[pos] = [[], [], []];
		}

		//将显示的功能入口放在对应数组
		let configs = GlobalConfig.PlayFunConfig;
		let ruleIdList = this.ruleIdList;
		for (let id in configs) {
			let r: RuleIconBase = ruleIdList[id];
			if (r.isShow) {
				let config = configs[id];
				let temp = config.pos;
				if (pos == -1 || pos == temp) {
					if (temp == 1) {
						btnDic[temp][config.layer - 1].push(r);
					} else {
						btnDic[temp].push(r);
					}
				}
			}
		}

		//排序功能入口
		for (let i in btnDic) {
			if (i == '1') {
				for (let j in btnDic[i])
					btnDic[i][j].sort(this.sortRule);
			} else {
				btnDic[i].sort(this.sortRule);
			}
		}

		let starX: number = this.width - 156;
		let starY: number = 0;
		let btn: eui.Group;
		let btnList: any[];

		let showNum: number = 0;
		let index: number = 0;
		let actRow: number = 0;//实际行 若当前行已满，自动移动到下一行

		//顶层功能入口
		if (pos == -1 || pos == 1) {
			btnList = btnDic[1];
			for (let row = 0; row < btnList.length; row++) {
				if (actRow < row) {
					actRow = row;
					showNum = 0;
				}

				for (let i = 0; i < btnList[row].length; i++) {
					btn = btnList[row][i].tar;

					btn.parent.setChildIndex(btn, 0);


					btn.x = starX - showNum * 80;
					btn.y = starY + actRow * 80;
					showNum += 1;

					if (showNum > 5) {
						actRow += 1;
						showNum = 0;
					}

				}
			}
		}

		//左边功能入口
		if (pos == -1 || pos == 2) {
			showNum = 0;
			index = 0;
			btnList = btnDic[2];
			for (let i: number = 0; i < btnList.length; i++) {
				let r: RuleIconBase = btnList[i];
				btn = r.tar as eui.Group;

				btn.parent.setChildIndex(btn, index);
				index += 1;

				if (!r.getConfig().noMove) {
					btn.left = 10;
					btn.top = 502 - showNum * 76;
					showNum++;
				}

			}
		}

		//右边功能入口
		if (pos == -1 || pos == 3) {
			showNum = 0;
			index = 0;
			btnList = btnDic[3];
			for (let i: number = 0; i < btnList.length; i++) {
				let r: RuleIconBase = btnList[i];
				btn = r.tar as eui.Group;

				btn.parent.setChildIndex(btn, index);
				index += 1;

				if (!r.getConfig().noMove) {
					btn.right = 0;
					btn.bottom = 300 + showNum * 65;
					showNum++;
				}
			}
		}

		//下方功能入口
		if (pos == -1 || pos == 0) {
			index = 0;
			btnList = btnDic[0];
			for (let i: number = 0; i < btnList.length; i++) {
				btn = btnList[i].tar;

				btn.parent.setChildIndex(btn, index);
				index += 1;
			}
		}

	}

	private addExpFlyMc(mon: CharMonster) {
		if (GameMap.fbType == UserFb.FB_TYPE_EXP) return;
		if (!UserFb.ins().checkGuanqiaIconShow()) {
			UserFb.ins().postAddEnergy();
			return;
		}
		let movieExp: eui.Image = new eui.Image();
		movieExp.source = "point";
		movieExp.anchorOffsetX = 20;
		movieExp.anchorOffsetY = 20;
		let map: MapView = ViewManager.gamescene.map;
		let point: egret.Point = this.localToGlobal();
		map.globalToLocal(point.x, point.y, point);
		movieExp.x = mon.x - point.x;
		movieExp.y = mon.y - point.y;
		this.addChild(movieExp);

		let tweenX: number = this.groupGuanqia.x + 60;
		let tweenY: number = this.groupGuanqia.y + 60;

		let t: egret.Tween = egret.Tween.get(movieExp);
		t.to({ x: tweenX, y: tweenY, alpha: 0.5 }, 600).call(() => {
			UserFb.ins().postAddEnergy();
			this.removeChild(movieExp);
			egret.Tween.removeTweens(movieExp);
		}, this);

		let tt: egret.Tween = egret.Tween.get(movieExp, { "loop": true });
		tt.to({ "rotation": movieExp.rotation + 360 }, 800);
	}

	public expBallMc: MovieClip;
	public guanqiaEff1: eui.Group;
	public eyesMc: MovieClip;

	private playGuanQiaDoorMc(): void {
		// let guanQiqDoorMc: MovieClip = new MovieClip();
		// guanQiqDoorMc.x = 82;
		// guanQiqDoorMc.y = 83;
		// this.groupGuanqia.addChild(guanQiqDoorMc);
		//  guanQiqDoorMc.playFile(RES_DIR_EFF + "guankamenkuangeff", 1);
		if (!this.eyesMc)
			this.eyesMc = new MovieClip();
		if (!this.eyesMc.parent)
			this.guanqiaEff1.addChild(this.eyesMc);
		this.eyesMc.playFile(RES_DIR_EFF + "guankaeye", 1);
	}

	private warmWord(num: number) {
		if (num) {
			if (GameMap.sceneInMain()) {
				this.bossWarmMc = this.bossWarmMc || new MovieClip();
				this.bossWarmMc.touchEnabled = false;
				this.mcGroup.addChildAt(this.bossWarmMc, 0);
				this.mcGroup.visible = true;
				this.aniShadow();
				this.bossWarmMc.playFile(RES_DIR_EFF + "bosscaution", 2, () => {
					this.removeShadow();
				});

				this.removeGuanQiaEnergy();
			}
		} else {
			this.mcGroup.visible = false;
			egret.Tween.removeTweens(this.alphaGroup);
			if (this.bossWarmMc) {
				DisplayUtils.removeFromParent(this.bossWarmMc);
				this.bossWarmMc = null;
			}
		}
	}

	public aniShadow(): void {
		this.warmImage.visible = true;
		let t = egret.Tween.get(this.warmImage);
		this.warmImage.alpha = 0.23;
		t.to({ alpha: 1 }, 300).wait(2200).to({ alpha: 0 }, 350)
			.call(() => {
				egret.Tween.removeTweens(this.warmImage);
			});


		this.levelNum.text = UserFb.ins().guanqiaID + "";
		this.alphaGroup.alpha = 0.2;
		egret.Tween.removeTweens(this.alphaGroup);
		egret.Tween.get(this.alphaGroup, { loop: true }).to({ alpha: 1 }, 625).to({ alpha: 0.2 }, 625);

		TimerManager.ins().doTimer(3500, 1, this.removeShadow, this);
	}

	public removeShadow(): void {
		this.warmImage.visible = false;
		this.mcGroup.visible = false;
		egret.Tween.removeTweens(this.alphaGroup);
		TimerManager.ins().remove(this.removeShadow, this);
	}

	private upDataVipBtnRedPoint(): void {
		this.redPointVip0.visible = UserVip.ins().getVipState();
	}

	public recharge: eui.Group;
	public vip: eui.Group;
	private cz: eui.Image;
	private v: eui.Image;

	public setDieGuide(dieType: number) {
		switch (dieType) {
			case DieGuide.RECHARGE:
				this.preRecharge = this.recharge.visible = true;
				this.cz.source = "swyd_firstrecharge_png";
				this.cz.touchEnabled = this.recharge.touchEnabled = false;
				break;
			case DieGuide.VIP:
				this.preVip = this.vip.visible = true;
				this.v.source = "swyd_vip_png";
				this.v.touchEnabled = this.vip.touchEnabled = false;
				break;
		}
	}

	//关卡进度条
	private setGuanQiaBar(cur: number, total: number) {
		let curValue: number = cur;
		let maxValue: number = total;
		if (curValue >= maxValue)
			curValue = maxValue;
		this.guanqiaBar.value = curValue;
		this.guanqiaBar.maximum = maxValue;
		this.guanqiaBar.labelFunction = function () {
			return ``;
		}
	}

	// //新手新穿戴装备提示（NewEquip监测调用）
	// private equipTips: NewEquipWin;
	//
	// public updateNewEquip() {
	// 	if (!this.equipTips)
	// 		return;
	// 	this.equipTips.open();
	// 	if (!TimerManager.ins().isExists(this.checkTime, this)) {
	// 		TimerManager.ins().doTimer(500, 0, this.checkTime, this)
	// 	}
	// }
	//
	// /**检测装备提示是否被卡顿*/
	// public checkTime() {
	// 	if (NewEquip.ins().check()) {
	// 		if (this.equipTips.visible && !NewEquip.ins().equipsList.length) {
	// 			//显示并且提示列表又没有数据
	// 			this.equipTips.close();
	// 		}
	// 	} else {
	// 		TimerManager.ins().remove(this.checkTime, this);
	// 		this.equipTips.close();
	// 	}
	// }

	/**关卡按钮的特效逻辑*/
	private arrow: GuideArrow;
	private eff: MovieClip;

	public GuanQiaEffLogic() {
		if (this.guanqiaBtn && UserFb.ins().showAutoPk == 0) {
			UserFb.ins().showAutoPk = 1;
			if (!this.arrow) {
				this.arrow = new GuideArrow;
				this.arrow.touchEnabled = false;
				this.arrow.lab.text = "点击挑战关卡";
				// this.self.addChild(this.arrow);
				// this.arrow.x = this.guanqiaBtn.x;
				// this.arrow.y = this.guanqiaBtn.y+this.guanqiaBtn.height/2;
				this.addChild(this.arrow);
				let point: egret.Point = this.guanqiaBtn.localToGlobal();
				this.globalToLocal(point.x, point.y, point);
				this.arrow.x = point.x;
				this.arrow.y = point.y + this.guanqiaBtn.height / 2;
				if (!this.eff) {
					this.eff = new MovieClip;
					this.eff.playFile(RES_DIR_EFF + "guideff", -1);
					this.groupGuanqia.addChild(this.eff);
					this.eff.x = this.guanqiaBtn.x + this.guanqiaBtn.width / 2;
					this.eff.y = this.guanqiaBtn.y + this.guanqiaBtn.height / 2;
				}
				egret.Tween.get(this.arrow, { loop: true }).to({ x: this.arrow.x + 40 }, 1000).to({ x: this.arrow.x }, 1000);
				egret.Tween.get(this, { loop: false }).wait(5000).call(() => {
					UserFb.ins().showAutoPk = -1;
					DisplayUtils.removeFromParent(this.eff);
					DisplayUtils.removeFromParent(this.arrow);
					if (this.arrow)
						egret.Tween.removeTweens(this.arrow);
					this.arrow = null;
					this.eff = null;
				});
			}
		}
		else if (this.pkBossBtnGroup && UserFb.ins().showAutoPk2 == 0) {
			UserFb.ins().showAutoPk2 = 1;
			if (!this.arrow) {
				this.arrow = new GuideArrow;
				this.arrow.touchEnabled = false;
				this.arrow.lab.text = "点击自动挑战关卡";
				this.addChild(this.arrow);
				let point: egret.Point = this.pkBossBtnGroup.localToGlobal();
				this.globalToLocal(point.x, point.y, point);
				this.arrow.x = point.x;
				this.arrow.y = point.y + this.pkBossBtnGroup.height / 2;
				if (!this.eff) {
					this.eff = new MovieClip;
					this.eff.playFile(RES_DIR_EFF + "guideff", -1);
					this.groupGuanqia.addChild(this.eff);
					this.eff.x = this.pkBossBtnGroup.x + this.pkBossBtnGroup.width / 2;
					this.eff.y = this.pkBossBtnGroup.y + this.pkBossBtnGroup.height / 2;

				}
				egret.Tween.get(this.arrow, { loop: true }).to({ x: this.arrow.x + 40 }, 1000).to({ x: this.arrow.x }, 1000);
				egret.Tween.get(this, { loop: false }).wait(5000).call(() => {
					UserFb.ins().showAutoPk2 = -1;
					DisplayUtils.removeFromParent(this.eff);
					DisplayUtils.removeFromParent(this.arrow);
					if (this.arrow)
						egret.Tween.removeTweens(this.arrow);
					this.arrow = null;
					this.eff = null;
				});
			}
		}
	}

	public GuanQiacleanEff() {
		UserFb.ins().showAutoPk = -1;
		UserFb.ins().showAutoPk2 = -1;
		DisplayUtils.removeFromParent(this.eff);
		DisplayUtils.removeFromParent(this.arrow);
		if (this.arrow)
			egret.Tween.removeTweens(this.arrow);
		this.arrow = null;
		this.eff = null;
	}

	//鲜花记录入口
	private updateFlower(): void {
		if (!this._flowerShowItem) {
			this._flowerShowItem = new FlowerShowItem();
			this.flower.addChild(this._flowerShowItem);
			return;
		}

		if (!this._flowerShowItem.parent)
			this.flower.addChild(this._flowerShowItem);

		this._flowerShowItem.showEffect();
	}

	/** 移除鲜花入口 */
	public removeFlowerItem(): void {
		DisplayUtils.removeFromParent(this._flowerShowItem);
	}

	public playUIEff(...param: any[]): void {
		// if (UserFb.ins().showAni) {
		// 	UIAnimation.setAnimation(this.shenqi, UIAnimation.ANITYPE_FADEIN_LEFT_HOR);
		// 	UIAnimation.setAnimation(this.ladderBtn, UIAnimation.ANITYPE_FADEIN_RIGHT_HOR, { time: 100 });
		// 	UIAnimation.setAnimation(this.fbBtn, UIAnimation.ANITYPE_FADEIN_RIGHT_HOR, { time: 200 });
		// 	UIAnimation.setAnimation(this.publicBossBtn, UIAnimation.ANITYPE_FADEIN_RIGHT_HOR, { time: 300 });
		// 	UIAnimation.setAnimation(this.groupGuanqia, UIAnimation.ANITYPE_FADEIN_RIGHT_HOR, { time: 400 });
		// } else {
		// 	UserFb.ins().showAni = true;
		// }
		// egret.log( "this.ladderBtn = "+egret.getQualifiedClassName(this.ladderBtn) );
		// egret.log( "this.taskTraceBtn = "+egret.getQualifiedClassName(this.taskTraceBtn) );
		// egret.log( "this.autoPkBoss = "+egret.getQualifiedClassName(this.autoPkBoss) );
		// egret.log( "this.face = "+egret.getQualifiedClassName(this.face) );
	}
}

ViewManager.ins().reg(PlayFunView, LayerManager.Main_View);