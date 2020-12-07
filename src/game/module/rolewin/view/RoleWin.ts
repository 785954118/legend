/**
 * RoleWin
 */
class RoleWin extends BaseEuiView {
	/** 关闭按钮 */
	public closeBtn: eui.Button;
	public closeBtn0: eui.Button;
	/** tabPanel */
	public viewStack: eui.ViewStack;
	/** 标签页 */
	public tab: eui.TabBar;

	public roleSelect: RoleSelectPanel;

	public roleInfoPanel: RoleInfoPanel;
	public hejiPanel: HejiPanel;
	public zsPanel: ZsPanel;
	public wingPanel: WingPanel;
	public reincarnationPanel: SamsaraPanel;

	public redPointGroup: eui.Group;
	private redPoint0: eui.Image;
	private redPoint1: eui.Image;
	private redPoint2: eui.Image;
	private redPoint3: eui.Image;
	public redPoint4: eui.Image;

	public help: eui.Button;

	/** 可更换的装备 */
	public canChangeEquips: boolean[][];

	public biaoti: eui.Image;
	private roleIndex: number = 0;

	constructor() {
		super();
		this.skinName = "RoleWinSkin";
		this.isTopLevel = true;
		this.addExclusionWin(egret.getQualifiedClassName(SmeltEquipTotalWin));
	}

	public initUI(): void {
		super.initUI()
	}

	public open(...param: any[]): void {
		this.oldIndex = this.tab.selectedIndex = this.viewStack.selectedIndex = param[0] ? param[0] : 0;
		this.addTouchEvent(this, this.onClick);
		this.addTouchEvent(this.closeBtn, this.onClick);
		this.addChangeEvent(this.tab, this.onTabTouch);
		this.addChangingEvent(this.tab, this.onTabTouching);
		this.addChangeEvent(this.roleSelect, this.onChange);
		this.observe(UserRole.ins().postRoleHint, this.delayRedPoint);
		this.observe(UserZs.ins().postZsData, this.delayRedPoint);
		this.observe(Actor.ins().postLevelChange, this.delayRedPoint);
		this.observe(Actor.ins().postUpdateTogeatter, this.delayRedPoint);
		this.observe(UserFb.ins().postGuanKaIdChange, this.delayRedPoint);
		this.observe(UserSkill.ins().postUpgradeForge, this.delayRedPoint);
		this.observe(UserBag.ins().postItemAdd, this.delayRedPoint);
		this.observe(UserBag.ins().postItemChange, this.delayRedPoint);
		this.observe(UserBag.ins().postItemDel, this.delayRedPoint);
		this.observe(JadeNew.ins().postJadeData, this.delayRedPoint); //玉佩信息
		this.observe(LyMark.ins().postMarkData, this.delayRedPoint);
		this.observe(Wing.ins().postUseDanSuccess, this.delayRedPoint);
		this.observe(Wing.ins().postWingUpgrade, this.delayRedPoint);
		this.observe(SamsaraCC.ins().postSamsaraInfo, this.delayRedPoint);
		this.addTouchEvent(this.help, this.onClick)
		this.roleIndex = param[1] ? param[1] : 0;
		let index = this.viewStack.selectedIndex
		this.roleSelect.setCurRole(this.roleIndex);
		if (index == 4) this.roleSelect.hideRole();
		this.setOpenIndex(index);
		this.redPoint();
	}

	private openSamsara(): void {
		let index = this.viewStack.getChildIndex(this.reincarnationPanel);
		if (index < 0) {
			this.viewStack.addChild(this.reincarnationPanel);
		}
		this.tab.dataProvider = this.viewStack;
		this.redPointGroup.horizontalCenter = 42;
		this.redPoint4.visible = SamsaraModel.ins().isCanUpgrade() || SamsaraModel.ins().isCanExchange() || (!SamsaraModel.ins().isMaxSamsara(Actor.samsaraLv) && SamsaraModel.ins().isCanUpgradeSoul());
	}

	private inactiveSamsara(): void {
		let index = this.viewStack.getChildIndex(this.reincarnationPanel);
		if (index >= 0) {
			this.viewStack.removeChildAt(index);
		}
		this.tab.dataProvider = this.viewStack;
		this.redPointGroup.horizontalCenter = 42 + 62;
		this.redPoint4.visible = false;
	}

	public close(...param: any[]): void {
		let uiview2: UIView2 = (ViewManager.ins().getView(UIView2) as UIView2);
		if (uiview2)
			uiview2.closeNav(UIView2.NAV_ROLE);

		let num = this.viewStack.numChildren;
		for (let i = 0; i < num; i++) {
			(this.viewStack.getChildAt(i) as any).close();
		}
	}

	private checkIsOpen(index: number): boolean {
		//合击
		let config: TogetherHitConfig = GlobalConfig.TogetherHitConfig[1];
		if (index == 1) {
			if (UserSkill.ins().checkHejiOpen()) {
			}
			else {
				UserTips.ins().showTips(`激活神器 火龙之心 后开启`);
				this.roleSelect.visible = this.roleSelectVis;
				return false;
			}
		}
		else if (index == 2) {
			if (Actor.level < GlobalConfig.ZhuanShengConfig.level) {
				UserTips.ins().showTips(`${GlobalConfig.ZhuanShengConfig.level}级开启转生`);
				return false;
			}
		}
		else if (index == 3) {
			if (Actor.level < GlobalConfig.WingCommonConfig.openLevel) {
				UserTips.ins().showTips("羽翼" + GlobalConfig.WingCommonConfig.openLevel + "级开启");
				return false;
			}
		}
		return true;
	}

	/**
	 * 点击标签页按钮
	 */
	private onTabTouch(e: egret.TouchEvent): void {
		let index = this.tab.selectedIndex;
		if (index == 4) this.roleSelect.hideRole();
		this.setOpenIndex(index);
	}

	private onTabTouching(e: egret.TouchEvent) {
		if (!this.checkIsOpen(this.tab.selectedIndex)) {
			e.preventDefault();
		}
	}

	private onChange(e: egret.Event): void {
		this.setRoleId(this.roleSelect.getCurRole());
	}

	private setRoleId(roleId: number): void {
		this.roleInfoPanel.curRole = this.wingPanel.curRole = roleId;
		this.setOpenIndex(this.viewStack.selectedIndex);
	}

	public setTabSelectedIndex(index: number): void {
		this.tab.selectedIndex = index;
		this.oldIndex = index;
		this.setOpenIndex(index);
	}

	private oldIndex: number = 0;
	private roleSelectVis: boolean = true;

	private setOpenIndex(selectedIndex: number): void {
		this.roleSelectVis = this.roleSelect.visible;
		if (this.oldIndex && this.oldIndex == 3 && this.oldIndex != selectedIndex) {
			if (this.getWingPanelInfo()) {
				this.doOpenHintWin(1, this.tab.selectedIndex);
				this.tab.selectedIndex = this.oldIndex;
				return;
			}
		}
		if (selectedIndex != 1)
			this.hejiPanel.close();
		this.help.visible = false;
		switch (selectedIndex) {
			case 0:
				this.biaoti.source = "biaoti_juese";
				this.roleSelect.openRole();
				this.roleInfoPanel.open();
				break;
			case 1:
				this.biaoti.source = "biaoti_heji";
				this.roleSelect.hideRole();
				this.hejiPanel.open();
				break;
			case 2:
				if (Actor.level >= GlobalConfig.ZhuanShengConfig.level) {
					this.biaoti.source = "biaoti_zhuansheng";
					this.roleSelect.hideRole();
					this.zsPanel.open();
					this.zsPanel.setData();
				} else {
					UserTips.ins().showTips(`${GlobalConfig.ZhuanShengConfig.level}级开启转生`);
					this.tab.selectedIndex = this.viewStack.selectedIndex;
				}
				break;
			case 3:
				if (Actor.level >= GlobalConfig.WingCommonConfig.openLevel) {
					this.biaoti.source = "biaoti_yuyi";
					this.roleSelect.openRole();
					this.wingPanel.open();
				} else {
					UserTips.ins().showTips("羽翼" + GlobalConfig.WingCommonConfig.openLevel + "级开启");
					this.tab.selectedIndex = this.viewStack.selectedIndex;
				}
				break;
			case 4:
				this.reincarnationPanel.open();
				this.tab.selectedIndex = this.viewStack.selectedIndex = 4;
				this.help.visible = true;
				break;
		}
		if (this.oldIndex != selectedIndex) {
			if (this.tab.selectedIndex != this.viewStack.selectedIndex) {
				this.viewStack.getElementAt(this.oldIndex)['close']();
				this.oldIndex = selectedIndex;
			}
		} else {
			this.tab.selectedIndex = this.viewStack.selectedIndex = selectedIndex;
		}

		this.redPoint();
	}

	private onClick(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.closeBtn:
			case this.closeBtn0:
				ViewManager.ins().close(this);
				let uiview2: UIView2 = (ViewManager.ins().getView(UIView2) as UIView2);
				if (uiview2)
					uiview2.closeNav(UIView2.NAV_ROLE);
				break;
			case this.help:
				ViewManager.ins().open(ZsBossRuleSpeak, 22);
				break;
		}
	}

	private delayRedPoint() {
		if (!TimerManager.ins().isExists(this.redPoint, this)) TimerManager.ins().doTimer(60, 1, this.redPoint, this);
	}

	private redPoint() {
		let zsIsOpens = [UserZs.ins().canOpenZSWin() && !UserZs.ins().isMaxLv() && (UserZs.ins().canGet() > 0 || UserZs.ins().canUpgrade())];
		let wingOpens = this.canWingEquip();
		let hejiOpens = UserSkill.ins().canHejiEquip() || UserSkill.ins().canExchange() || UserSkill.ins().canSolve() || UserSkill.ins().canAcitve();
		let equipIsOpens = this.canEquip();//是否能穿戴 或者 附灵
		let samsaraOpen = SamsaraModel.ins().isOpen();
		let ringRed = OpenSystem.ins().checkSysOpen(SystemType.RING) && (SpecialRing.ins().checkHaveUpRing() || SpecialRing.ins().isCanStudySkill() || SpecialRing.ins().isCanUpgradeSkill() || SpecialRing.ins().fireRingRedPoint() || LyMark.ins().checkRed());
		let isOpens = [equipIsOpens, hejiOpens, zsIsOpens, wingOpens];

		this.redPoint0.visible = this.and(equipIsOpens) || ringRed || SubRoles.ins().isLockRole() || (SamsaraModel.ins().isOpen() && SamsaraModel.ins().isCanAddSpirit()) || JadeNew.ins().checkRed() || ShenshouRedpoint.ins().redpoint;
		this.redPoint1.visible = hejiOpens || UserSkill.ins().getPunchForge().getRedPoint();
		this.redPoint2.visible = this.and(zsIsOpens);
		this.redPoint3.visible = this.and(wingOpens) || this.and(Wing.ins().canGradeupWing())
			|| this.and(Wing.ins().canItemGradeupWing())
			|| Wing.ins().isHaveActivationWing()
			|| GodWingRedPoint.ins().getGodWingRedPoint();

		this.redPoint3.visible = Actor.level >= GlobalConfig.WingCommonConfig.openLevel ? this.redPoint3.visible : false;

		let len: number = SubRoles.ins().subRolesLen;
		for (let i: number = 0; i < len; i++) {
			let isOpen = false;
			if (this.tab.selectedIndex < 4) {
				if (isOpens[this.tab.selectedIndex][i]) {
					isOpen = true;
				}
				this.roleSelect.showRedPoint(i, isOpen);
			}
		}

		if (SamsaraModel.ins().isOpen()) {
			this.openSamsara();
			this.setSamsaraEquipVisible(true);

		} else {
			this.inactiveSamsara();
			this.setSamsaraEquipVisible(false);
		}
	}

	private setSamsaraEquipVisible(visible: boolean): void {
		if (this.roleInfoPanel && this.viewStack.selectedIndex == 4 && this.roleInfoPanel.skinName) {
			this.roleInfoPanel["item9"].visible = visible;
			this.roleInfoPanel["item10"].visible = visible;
			this.roleInfoPanel["item11"].visible = visible;
			this.roleInfoPanel["item12"].visible = visible;
		}
	}

	private and(list): boolean {
		for (let k in list) {
			if (list[k] == true)
				return true;
		}

		return false;
	}

	private canWingEquip(): boolean[] {
		let isOpens: boolean[] = [false, false, false];
		let isLevel: boolean[] = Wing.ins().canGradeupWing();
		let isLevelByItem: boolean[] = Wing.ins().canItemGradeupWing();
		let isRoleOpenWing: boolean[] = Wing.ins().canRoleOpenWing();
		let len: number = SubRoles.ins().subRolesLen;

		for (let i: number = 0; i < len; i++) {
			if (GlobalConfig.WingCommonConfig.openLevel > Actor.level) {
				isOpens[i] = false;
				continue;
			}
			//判断角色是否可以激活翅膀
			if (isRoleOpenWing[i]) {
				isOpens[i] = true;
				continue;
			}
			if (isLevel[i] || isLevelByItem[i]) {
				isOpens[i] = true;
			}

			if (Wing.ins().canUseAptitudeByRoleID(i))
				isOpens[i] = true;

			if (Wing.ins().canUseFlyUpByRoleID(i))
				isOpens[i] = true;
		}

		return isOpens;
	}

	private canEquip(): boolean[] {
		let isOpens: boolean[] = [false, false, false];
		if( !this.canChangeEquips || !this.canChangeEquips[0].length){
			this.canChangeEquips = UserRole.ins().canChangeEquips;
		}
		if (this.canChangeEquips) {
			let len: number = SubRoles.ins().subRolesLen;
			for (let i: number = 0; i < len; i++) {
				let data = this.canChangeEquips[i];
				for (let k in data) {
					if (data[k]) {
						isOpens[i] = true;
						break;
					}
				}
				if (isOpens[i] == false) {
					for (let a: number = 0; a < 5; a++) {
						let opens: boolean[] = [];
						if (a > 1)
							opens = LongHun.ins().canGradeupLoongSoul(a);
						else
							opens = SpecialRing.ins().canGradeupRing(a);
						if (opens[i]) {
							isOpens[i] = opens[i];
							break;
						}
					}
				}
				// if (isOpens[i] == false) {
				// 	if (!UserEquip.ins().checkRedPointEx(4, i)) {
				// 		isOpens[i] = UserEquip.ins().checkRedPoint(5, i);
				// 	}else{
				//      isOpens[i]
				// }
				//神装
				let model: Role = SubRoles.ins().getSubRoleByIndex(i);
				let bool: boolean = false;
				for (let j = 0; j < 8; j++) {
					bool = UserEquip.ins().setOrangeEquipItemState(j, model);
					if (!bool && j < 2)
						bool = UserEquip.ins().setLegendEquipItemState(j > 0 ? 2 : 0, model);
					if (bool) {
						let b = UserBag.ins().checkEqRedPoint(i, model);
						bool = b != null ? b : bool;
					}
					if (bool)
						break;
				}
				if (!bool)
					bool = UserEquip.ins().checkRedPointEx(4, i);
				if (!bool)
					bool = UserEquip.ins().checkRedPointEx(5, i);
				if (!bool)
					bool = Boolean(UserBag.ins().getHuntGoods(0).length);
				if (bool)
					isOpens[i] = bool;
				if (!isOpens[i]) {
					isOpens[i] = SamsaraModel.ins().checkRoleCanAddSpirit(i);
				}
			}
		}
		return isOpens;
	}

	private wingData: WingsData;

	/*
	 * 是否显示翅膀经验清0 的提示
	 * */
	public getWingPanelInfo(): boolean {
		if (!this.isShow())
			return false;
		if (this.oldIndex != 3)
			return false;
		let chooseData: WingsData;
		let len: number = SubRoles.ins().roles.length;
		for (let i: number = 0; i < len; i++) {
			let data: WingsData = SubRoles.ins().getSubRoleByIndex(i).wingsData;
			if (!chooseData || chooseData.clearTime == 0) {
				chooseData = data;
			} else if (chooseData.clearTime > data.clearTime && data.clearTime > 0) {
				chooseData = data;
			}
		}
		this.wingData = chooseData;
		return chooseData.clearTime > 0 && Wing.hint;
	}

	//type  1--切页   2--关闭   index --切页的下标
	public doOpenHintWin(type: number, index: number = 0): void {
		ViewManager.ins().open(WingHintWin, type, index, this.wingData);
	}

	public getEquipGrid(pos: EquipPos): RoleItem {
		this.validateNow();
		return this.roleInfoPanel.getEquipItem(pos);
	}

	public playUIEff(...param: any[]): void {
	}
}

ViewManager.ins().reg(RoleWin, LayerManager.UI_Main);

