/**
 * 天梯（王者争霸）- 窗口
 */
class LadderWin extends BaseEuiView {

	public tab: eui.TabBar;
	public viewStack: eui.ViewStack;

	public redPoint1: eui.Image;
	public redPoint2: eui.Image;
	public redPoint3: eui.Image;
	public redPoint4: eui.Image;
	public redPoint5: eui.Image;
	public zaoyu: EncounterInfoWin;
	public ladder: LadderInfoPanel;
	public wakuang: MinePanel;
	public redGroup:eui.Group;

	//public kf: KFBattlListPanel;
	/** 组队副本 */
	public teamfb: TeamFbNewPanel;
	public title: eui.Image;
	/** 挑战魂兽 */
	public challengeHunshou: HunShouFBWin;

	private help: eui.Button;
	private closeBtn: eui.Button;

	constructor() {
		super();
		this.skinName = "ladderwinskin";
		this.isTopLevel = true;
		// this.setSkinPart("zaoyu", new EncounterInfoWin());
		// this.setSkinPart("ladder", new LadderInfoPanel());
		// this.setSkinPart("wakuang", new MinePanel());
		// this.setSkinPart("roleSelect", new RoleSelectPanel());
	}

	public open(...param: any[]): void {
		this.addTouchEvent(this.help, this.onTap);
		this.addChangingEvent(this.tab, this.onTabTouching);
		this.addChangeEvent(this.tab, this.selectIndexChange);
		this.addChangingEvent(this.tab, this.checkIsBack);
		this.addTouchEvent(this.closeBtn, this.onTap);

		this.observe(Mine.ins().postRedPoint, this.updateMineRedPoint);
		this.observe(UserFb.ins().postShowRedChange, this.refushredPoint);
		this.observe(Hungu.ins().postHunShouFBInfo, this.refushredPoint);
		this.observe(Hungu.ins().postSweepHunShouFB, this.refushredPoint);

		let index: number = param[0] ? param[0] : 0;
		this.tab.selectedIndex = index;
		this.viewStack.selectedIndex = index;
		this.selectIndexChange();
		this.refushredPoint();

		//魂兽也签显示特殊处理
		if (Hungu.ins().showHunShouFB())
		{
			if (this.viewStack.numElements < 5)
			{				
				this.viewStack.addChild(this.challengeHunshou);
				this.redGroup.addChild(this.redPoint5);
				this.redPoint5.visible = Hungu.ins().showHunShouRed();
			}
		}
		else
		{
			if (this.viewStack.numElements >= 5)
			{
				this.viewStack.removeChild(this.challengeHunshou);
				DisplayUtils.removeFromParent(this.redPoint5);
			}
		}
	}

	public close(...param: any[]): void {
		this.removeEventListener(egret.Event.CHANGING, this.onTabTouching, this.tab);
	}

	/**tab选中改变 */
	private selectIndexChange(e: egret.Event = null): void {
		switch (this.tab.selectedIndex) {
			case 0:
				this.zaoyu.open();
				break;
			case 1:
				this.ladder.open();
				break;
			case 2:
				this.wakuang.open();
				break;
			case 3:
				//this.kf.open();
				this.teamfb.open();
				break;
			case 4:
				this.challengeHunshou.open();
				break;
		}

		this.title.source = `biaoti_jingji${this.tab.selectedIndex}`;
	}

	private onTabTouching(e: egret.TouchEvent) {
		if (!this.checkIsOpen(this.tab.selectedIndex)) {
			e.preventDefault();
		}
	}

	/**页签开启判定*/
	private checkIsOpen(index: number): boolean {
		if (index == 3 && !UserFb.ins().isTeamFBOpen()) {
			UserTips.ins().showTips(`组队副本达到${GlobalConfig.TeamFuBenBaseConfig.needZsLv}转且开服第${GlobalConfig.TeamFuBenBaseConfig.openDay}天开启`);
			return false;
		}

		if (index == 4 && !Hungu.ins().isHunShouFBOpen()) {
			UserTips.ins().showTips(`达到${GlobalConfig.HunGuConf.needZsLv}转且开服第${GlobalConfig.HunGuConf.fbOpenDay}天开启`);
			return false;
		}

		return true;
	}

	/**更新红点提示 */
	private refushredPoint(): void {
		this.redPoint1.visible = !!Encounter.ins().isHasRed();
		this.redPoint2.visible = Ladder.ins().isCanReward || Ladder.ins().isOpen ? Ladder.ins().challgeNum > 0 : false;
		this.redPoint3.visible = Mine.redpointCheck();
		//this.redPoint4.visible = KFBattleRedPoint.ins().postRedPoint();
		this.redPoint4.visible = UserFb.ins().checkTFRed();
		this.redPoint5.visible = Hungu.ins().showHunShouRed();
	}

	private updateMineRedPoint(num) {
		this.redPoint3.visible = !!num;
	}

	/**触摸事件 */
	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.help:
				//帮助按钮（？）
				if (this.tab.selectedIndex == 0) {
					ViewManager.ins().open(ZsBossRuleSpeak, 10);
				} else if (this.tab.selectedIndex == 1) {
					ViewManager.ins().open(ZsBossRuleSpeak, 4);
				} else if (this.tab.selectedIndex == 2) {
					ViewManager.ins().open(ZsBossRuleSpeak, 14);
				} else if (this.tab.selectedIndex == 4) {
					ViewManager.ins().open(ZsBossRuleSpeak, 37);
				}
				break;
			case this.closeBtn:
				ViewManager.ins().close(this);
				break;
		}
	}

	private checkIsBack(e: egret.Event): void {
		let tab = e.target;
		if (!LadderWin.openCheck([tab.selectedIndex])) {
			e.$cancelable = true;
			e.preventDefault();
		} else {
			ViewManager.ins().close(LimitTaskView);
		}
	}

	public static openCheck(...param: any[]): boolean {
		let index: number = param[0] ? param[0] : 0;
		if (index == 0) {
			let v = GlobalConfig.SkirmishBaseConfig.openLevel;
			let b = UserFb.ins().guanqiaID >= v;
			if (!b) UserTips.ins().showTips(`通关到第${v}关开启遭遇战`);
			return b;
		}
		if (index == 1) {
			let v = GlobalConfig.TianTiConstConfig.openLevel;
			let b = Actor.level >= v;
			if (!b) UserTips.ins().showTips(`${v}级开启`);
			return b;
		} else if (index == 2) {
			let b = Mine.openCheck(true);
			return b;
		} else if (index == 3) {
			let b = true;
			return b;
		} else if (index == 4) {
			let b = true;
			return b;
		}
	}
}

ViewManager.ins().reg(LadderWin, LayerManager.UI_Main);