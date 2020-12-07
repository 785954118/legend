/**
 * 转生界面
 */
class SkillWin extends BaseEuiView {
	public static Panel_JINENG = 0;//技能
	public static Panel_NEIGONG = 1;//内功
	public static Panel_JINGMAI = 2;//经脉
	public static Panel_MIJI = 3;//秘籍
	public static Panel_ZHANLING = 4;//战灵
	public viewStack: eui.ViewStack;
	public skillPanel: SkillPanel;
	public jingMai: JingMaiPanel;
	public mijiPanel: MijiPanel;
	public zhanlingPanel: ZhanLingPanel;
	public neiGongPanel: NeiGongWin;
	public tab: eui.TabBar;
	public closeBtn: eui.Button;
	public closeBtn0: eui.Button;

	public redPoint0: eui.Image;
	public redPoint1: eui.Image;
	public redPoint2: eui.Image;
	public redPoint3: eui.Image;
	public redPoint4: eui.Image;
	public roleSelect: RoleSelectPanel;

	private skillTitle: eui.Image;
	private redPointGroup: eui.Group;
	private help: eui.Button;

	constructor() {
		super();
		this.skinName = "ZsSkin";
		this.isTopLevel = true;
		// this.setSkinPart("roleSelect", new RoleSelectPanel());
		// this.setSkinPart("skillPanel", new SkillPanel());
		// this.setSkinPart("jingMai", new JingMaiPanel());
		// this.setSkinPart("mijiPanel", new MijiPanel());
		// this.setSkinPart("neiGongPanel", new NeiGongWin());
	}

	public initUI(): void {
		super.initUI();

	}

	public open(...param: any[]): void {

		// this.tab.selectedIndex = param ? param[0] : 0;
		// this.viewStack.selectedIndex = param ? param[0] : 0;

		this.addTouchEvent(this.closeBtn, this.onTap);
		this.addTouchEvent(this.closeBtn0, this.onTap);
		this.addTouchEvent(this.help, this.onTap);
		this.addChangingEvent(this.tab, this.onTabTouching);
		this.addChangeEvent(this.tab, this.onTabTouch);
		this.addChangeEvent(this.roleSelect, this.onChange);

		this.observe(UserBag.ins().postItemAdd, this.updateRedPoint);//道具添加
		this.observe(UserBag.ins().postItemDel, this.updateRedPoint);
		this.observe(UserBag.ins().postItemChange, this.updateRedPoint);

		this.observe(NeiGong.ins().postNeiGongDataChange, this.updateRedPoint);
		this.observe(UserJingMai.ins().postUpdate, this.updateRedPoint);

		this.observe(Actor.ins().postGoldChange, this.updateRedPoint);
		this.observe(Actor.ins().postLevelChange, this.updateRedPoint);
		this.observe(UserSkill.ins().postSkillUpgradeAll, this.updateRedPoint);
		this.observe(UserMiji.ins().postBagUseMiji, this.onBagUseMiji);
		this.observe(ZhanLing.ins().postZhanLingComposeItem, this.updateRedPoint);
		this.observe(ZhanLing.ins().postZhanLingInfo, this.updateRedPoint);
		this.observe(ZhanLing.ins().postZhanLingUpExp, this.updateRedPoint);
		this.observe(ZhanLing.ins().postZhanLingDrug, this.updateRedPoint);
		this.observe(ZhanLing.ins().postZhanLingWear, this.updateRedPoint);

		// this.lastIndex = param[0] == undefined ? this.lastIndex : param[0];
		// this.viewStack.selectedIndex = this.lastIndex;

		this.checkPage();
		let selectIndex = param[0] != undefined ? param[0] : SkillWin.Panel_JINENG;
		let roleIndex = param[1] ? param[1] : 0;

		this.viewStack.selectedIndex = this.tab.selectedIndex = selectIndex;

		this.roleSelect.setCurRole(roleIndex);
		this.setOpenIndex(selectIndex);
	}

	private checkPage() {
		if (!ZhanLingModel.ins().ZhanLingOpen()) {
			if (this.zhanlingPanel.parent)
				this.viewStack.removeChild(this.zhanlingPanel);
			if (this[`redPoint${SkillWin.Panel_ZHANLING}`].parent)
				DisplayUtils.removeFromParent(this[`redPoint${SkillWin.Panel_ZHANLING}`]);
		} else {
			if (!this.zhanlingPanel.parent)
				this.viewStack.addChild(this.zhanlingPanel);
			if (!this[`redPoint${SkillWin.Panel_ZHANLING}`].parent)
				this.redPointGroup.addChild(this[`redPoint${SkillWin.Panel_ZHANLING}`]);
		}
	}

	public close(...param: any[]): void {
		TimerManager.ins().removeAll(this);

		let uiview2: UIView2 = (ViewManager.ins().getView(UIView2) as UIView2);
		if (uiview2)
			uiview2.closeNav(UIView2.NAV_SKILL);

		let num = this.viewStack.numChildren;
		for (let i = 0; i < num; i++) {
			(this.viewStack.getChildAt(i) as any).close();
		}
	}

	private lastIndex: number = 0;

	/**
	 * 点击标签页按钮
	 */
	private onTabTouch(e: egret.TouchEvent): void {
		this.setOpenIndex(e.currentTarget.selectedIndex);
	}

	private onTabTouching(e: egret.TouchEvent) {
		if (!SkillWin.checkIsOpen(e.currentTarget.selectedIndex)) {
			e.preventDefault();
			return;
		}
	}

	private setOpenIndex(selectedIndex: number): void {
		let openLevel: number;
		let openGuanqia: number;
		this.roleSelect.openRole();
		this.help.visible = false;
		switch (selectedIndex) {
			case SkillWin.Panel_JINENG:
				this.skillPanel.open();
				this.skillTitle.source = "biaoti_jineng";
				break;
			case SkillWin.Panel_NEIGONG:
				openLevel = GlobalConfig.NeiGongBaseConfig.openLevel;
				openGuanqia = GlobalConfig.NeiGongBaseConfig.openGuanqia;
				if (UserFb.ins().guanqiaID <= openGuanqia) {
					UserTips.ins().showTips(`通关${openGuanqia}关开启`);
					selectedIndex = this.tab.selectedIndex = this.viewStack.selectedIndex = this.lastIndex;
				} else {
					this.neiGongPanel.open(this.roleSelect.getCurRole());
					this.skillTitle.source = "biaoti_neigong";
				}
				break;
			case SkillWin.Panel_JINGMAI:
				openLevel = GlobalConfig.JingMaiCommonConfig.openLevel;
				if (Actor.level < openLevel) {
					UserTips.ins().showTips(`${openLevel}级开启`);
					selectedIndex = this.tab.selectedIndex = this.viewStack.selectedIndex = this.lastIndex;
				} else {
					this.jingMai.open();
					this.skillTitle.source = "biaoti_jingmai";
				}
				break;
			case SkillWin.Panel_MIJI:
				let zsLv: number = UserMiji.ZsLv;
				if (UserZs.ins().lv < zsLv) {
					UserTips.ins().showTips(`${zsLv}转开启`);
					selectedIndex = this.tab.selectedIndex = this.viewStack.selectedIndex = this.lastIndex;
				} else {
					this.mijiPanel.open();
					this.skillTitle.source = "biaoti_miji";
				}
				break;
			case SkillWin.Panel_ZHANLING:
				if (!ZhanLingModel.ins().ZhanLingOpen()) {
					UserTips.ins().showTips(`开服第${GlobalConfig.ZhanLingConfig.openserverday}天并达到${GlobalConfig.ZhanLingConfig.openzhuanshenglv}转开启`);
				} else {
					this.help.visible = true;
					this.roleSelect.hideRole();
					this.zhanlingPanel.open();
					this.skillTitle.source = "biaoti_zhanling";
				}
				break;
		}
		if (this.lastIndex != selectedIndex) {
			this.viewStack.getElementAt(this.lastIndex)['close']();
			this.lastIndex = selectedIndex;

		} else {
			this.tab.selectedIndex = this.viewStack.selectedIndex = selectedIndex;
		}
		this.updateRedPoint();
	}

	private static checkIsOpen(index: number): boolean {
		let openLevel: number;
		let openGuanqia: number;
		switch (index) {
			case SkillWin.Panel_JINENG:
				break;
			case SkillWin.Panel_NEIGONG:
				openLevel = GlobalConfig.NeiGongBaseConfig.openLevel;
				openGuanqia = GlobalConfig.NeiGongBaseConfig.openGuanqia;
				if (UserFb.ins().guanqiaID <= openGuanqia) {
					UserTips.ins().showTips(`通关${openGuanqia}关开启`);
					return false;
				}
				break;
			case SkillWin.Panel_JINGMAI:
				openLevel = GlobalConfig.JingMaiCommonConfig.openLevel;
				if (Actor.level < openLevel) {
					UserTips.ins().showTips(`${openLevel}级开启`);
					return false;
				}
				break;
			case SkillWin.Panel_MIJI:
				let zsLv: number = UserMiji.ZsLv;
				if (UserZs.ins().lv < zsLv) {
					UserTips.ins().showTips(`${zsLv}转开启`);
					return false;
				}
				break;
			case SkillWin.Panel_ZHANLING:
				if (!ZhanLingModel.ins().ZhanLingOpen()) {
					UserTips.ins().showTips(`开服第${GlobalConfig.ZhanLingConfig.openserverday}天并达到${GlobalConfig.ZhanLingConfig.openzhuanshenglv}转开启`);
					return false;
				}
				break;
		}
		return true;
	}

	private updateRedPoint(): void {
		if (!TimerManager.ins().isExists(this.updateRed, this)) TimerManager.ins().doTimer(100, 1, this.updateRed, this);
	}

	private onBagUseMiji(itemId: number) {
		let len = SubRoles.ins().subRolesLen;
		for (let i = 0; i < len; i++) {
			if (!UserMiji.ins().hasEquipMiji(itemId, i)) {
				this.roleSelect.setCurRole(i);
				this.setRoleId(i);
				break;
			}
		}
		this.mijiPanel.onBagUseMiji(itemId);
	}

	private updateRed(): void {
		this.redPoint0.visible = this.and(UserSkill.ins().canGrewupSkill());
		this.redPoint1.visible = NeiGongModel.ins().canUp();
		this.redPoint2.visible = this.jingMaiCanUp();
		this.redPoint3.visible = UserMiji.ins().isMjiSum();
		this.redPoint4.visible = ZhanLing.ins().checkRedPoint();
		let len: number = SubRoles.ins().subRolesLen;
		this.roleSelect.clearRedPoint();
		for (let i: number = 0; i < len; i++) {
			let isCanUpLevel: boolean;
			if (this.tab.selectedIndex == SkillWin.Panel_JINENG) {
				isCanUpLevel = UserSkill.ins().canGrewupAllSkills(i);
			}
			else if (this.tab.selectedIndex == SkillWin.Panel_NEIGONG) {
				isCanUpLevel = NeiGongModel.ins().canUpById(i);
			} else if (this.tab.selectedIndex == SkillWin.Panel_JINGMAI) {
				let data: JingMaiData = SubRoles.ins().roles[i].jingMaiData;
				isCanUpLevel = data.jingMaiCanUp();
			} else if (this.tab.selectedIndex == SkillWin.Panel_MIJI) {
				isCanUpLevel = UserMiji.ins().isMjiSum();
			}
			this.roleSelect.showRedPoint(i, isCanUpLevel);
		}
	}

	private onChange(e: egret.Event): void {
		this.setRoleId(this.roleSelect.getCurRole());
	}

	private setRoleId(roleId: number): void {
		if (roleId != this.skillPanel.curRole) {
			this.neiGongPanel.curRole = this.mijiPanel.curRole = this.skillPanel.curRole = this.jingMai.curRole = roleId;
			this.setOpenIndex(this.viewStack.selectedIndex);
		}
	}

	private and(list): boolean {
		for (let k of list) {
			if (k == true)
				return true;
		}
		return false;
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.closeBtn:
			case this.closeBtn0:
				ViewManager.ins().close(this);
				break;
			case this.help:
				if (this.viewStack.selectedIndex == SkillWin.Panel_ZHANLING) {
					ViewManager.ins().open(CommonHelpWin, GlobalConfig.HelpInfoConfig[35].text);
				}
				break;
		}

	}

	public static openCheck(...param): boolean {
		let index = param[0] || SkillWin.Panel_JINENG;
		return SkillWin.checkIsOpen(index);
	}

	private jingMaiCanUp(): boolean {
		let data: JingMaiData;
		for (let i in SubRoles.ins().roles) {
			data = SubRoles.ins().roles[i].jingMaiData;
			if (data.jingMaiCanUp()) {
				let openLevel = GlobalConfig.JingMaiCommonConfig.openLevel;
				if (Actor.level >= openLevel)
					return true;
			}
		}
		return false;
	}
}

ViewManager.ins().reg(SkillWin, LayerManager.UI_Main);