/**
 * @锻造(强化)窗口
 */
class ForgeWin extends BaseEuiView {
	/** 页签对应索引 **/
	public static Page_Select_Boost = 0;//强化页
	public static Page_Select_Gem = 1;//精炼页
	public static Page_Select_ZhuLing = 2; //(铸造)
	public static Page_Select_Weapon = 3;//兵魂
	public static PageSelectSamsara = 4;//装备合成
	/** 关闭按钮 */
	public closeBtn: eui.Button;
	public closeBtn0: eui.Button;
	/** tabPanel */
	public viewStack: eui.ViewStack;
	/** 标签页 */
	public tab: eui.TabBar;
	public roleSelect: RoleSelectPanel;	//上部角色选择部分
	public boostPanel: ForgeBoostPanel;	 //强化页
	private zhulingPanel: ForgeZhulingPanel; //精炼页
	private gemPanel: ForgeGemPanel;		 //宝石页
	public weaponsoul: WeaponWin;		 //兵魂
	//public reinComposePanel: ComposePanel;  //轮回装备合成

	public redPointGroup: eui.Group;
	public redPoint0: eui.Image;
	public redPoint1: eui.Image;
	public redPoint2: eui.Image;
	public redPoint3: eui.Image;
	//public redPoint4: eui.Image;


	private mcList: MovieClip[];//特效组
	private mc: MovieClip;				   //特效
	public isNotMove: boolean;

	constructor() {
		super();
		this.skinName = "forgeskin";
		this.isTopLevel = true;
		// this.setSkinPart("roleSelect", new RoleSelectPanel());
		// this.setSkinPart("boostPanel", new ForgeBoostPanel());
		// this.setSkinPart("zhulingPanel", new ForgeZhulingPanel());
		// this.setSkinPart("gemPanel", new ForgeGemPanel());
		// this.setSkinPart("weaponsoul", new WeaponWin());
	}

	public initUI(): void {
		super.initUI();
		this.viewStack.selectedIndex = ForgeWin.Page_Select_Boost;
		this.tab.dataProvider = this.viewStack;

		this.mc = new MovieClip;
		this.mc.x = 240;
		this.mc.y = 400;

		this.mcList = [];
		for (let i = 0; i < 8; i++) {
			let mcp = new MovieClip;
			mcp.x = 240;
			mcp.y = 400;
			this.mcList.push(mcp);
		}
	}

	public open(...param: any[]): void {
		this.tab.selectedIndex = this.viewStack.selectedIndex = param[0];
		if (param[1] != undefined) { //用于打开界面选择角色计算战斗力，之前没有传这个参数，如计算战斗力功能不需要，可以删掉这三行代码Peach.T
			this.roleSelect.setCurRole(parseInt(param[1] + ""));
		}

		this.setRoleId(this.roleSelect.getCurRole());

		this.addTouchEvent(this.closeBtn, this.onTouch);
		this.addTouchEvent(this.closeBtn0, this.onTouch);
		this.addChangeEvent(this.tab, this.onTabTouch);
		this.addChangingEvent(this.tab, this.onTabTouching);
		this.addChangeEvent(this.roleSelect, this.onChange);

		this.observe(UserForge.ins().postForgeUpdate, this.onEvent);
		// this.observe(UserForge.ins().postForgeTips, this.redPoint);
		// // this.observe(Actor.ins().postSoulChange,this.redPoint); //在UserForge中有监听，会调用postForgeTips，此处无需监听
		// this.observe(Weapons.ins().postWeaponsUpLevel,this.redPoint);

		this.observe(ForgeRedPoint.ins().postForgeBoostRedPoint, this.delayRedPoint);
		this.observe(ForgeRedPoint.ins().postForgeZhulingRedPoint, this.delayRedPoint);
		this.observe(ForgeRedPoint.ins().postForgeGemRedPoint, this.delayRedPoint);
		this.observe(ForgeRedPoint.ins().postForgeWeaponRedPoint, this.delayRedPoint);
		// this.observe(ForgeRedPoint.ins().postForgeMergeRedPoint, this.delayRedPoint);

		// if (MergeCC.ins().isOpen()) {
		// 	this.openMerge();

		// } else {
		//	this.inactiveSamsara();
		//}
	}

	// private openMerge(): void {
	// 	let index = this.viewStack.getChildIndex(this.reinComposePanel);
	// 	if (index < 0) {
	// 		this.viewStack.addChild(this.reinComposePanel);
	// 	}
	// 	this.tab.dataProvider = this.viewStack;
	// 	this.redPointGroup.horizontalCenter = 42;
	// 	this.redPoint4.visible = MergeCC.ins().redPoint();
	// }

	// private inactiveSamsara(): void {
	// 	let index = this.viewStack.getChildIndex(this.reinComposePanel);
	// 	if (index >= 0) {
	// 		this.viewStack.removeChildAt(index);
	// 	}
	// 	this.tab.dataProvider = this.viewStack;
	// 	this.redPointGroup.horizontalCenter = 42 + 62;
	// 	this.redPoint4.visible = false;
	// }

	public close(...param: any[]): void {
		let num = this.viewStack.numChildren;
		for (let i = 0; i < num; i++) {
			(this.viewStack.getChildAt(i) as any).close();
		}

		let uiview2: UIView2 = ViewManager.ins().getView(UIView2) as UIView2;
		if (uiview2)
			uiview2.closeNav(UIView2.NAV_SMITH);

		DisplayUtils.removeFromParent(this.mc);
		for (let i = 0; i < 8; i++) {
			DisplayUtils.removeFromParent(this.mcList[i]);
		}

	}


	private onTouch(e: egret.TouchEvent): void {
		ViewManager.ins().close(ForgeWin);
	}

	/**
	 * 点击标签页按钮
	 */
	private onTabTouch(e: egret.TouchEvent): void {
		this.setOpenIndex(e.currentTarget.selectedIndex);
		this.redPointEx();
	}

	private onTabTouching(e: egret.TouchEvent) {
		if (!this.checkIsOpen(e.currentTarget.selectedIndex)) {
			e.preventDefault();
			return;
		}
	}

	private setOpenIndex(selectedIndex: number, roleChange?: boolean): void {
		let index: number = 0;
		let role: Role = SubRoles.ins().getSubRoleByIndex(this.roleSelect.getCurRole());
		let change = true;
		this.roleSelect.openRole();
		switch (selectedIndex) {
			case ForgeWin.Page_Select_Boost:
				index = role.getMinEquipIndexByType(0);
				this.boostPanel.open(index, role.getEquipByIndex(index).strengthen);
				break;
			case ForgeWin.Page_Select_Gem:
				index = role.getMinEquipIndexByType(ForgeWin.Page_Select_Gem);//默认武器
				if (Actor.level >= GlobalConfig.StoneOpenConfig[0].openLv) {//铸造开启条件
					this.gemPanel.open(index, role.getEquipByIndex(index).gem);
				} else {
					change = false;
					UserTips.ins().showTips("精炼" + GlobalConfig.StoneOpenConfig[0].openLv + "级开启");
				}
				break;
			case ForgeWin.Page_Select_ZhuLing:
				index = role.getMinEquipIndexByType(ForgeWin.Page_Select_ZhuLing);
				this.zhulingPanel.open(index, role.getEquipByIndex(index).zhuling);
				break;
			case ForgeWin.Page_Select_Weapon:
				change = OpenSystem.ins().checkSysOpen(SystemType.WEAPONS);
				if (change) {
					//是否切换角色
					if (roleChange) {
						if (this.weaponsoul.isShowSoul()) {
							//兵魂之灵内人物切换
							this.weaponsoul.open(this.roleSelect.getCurRole(), false);
						} else {
							this.weaponsoul.open(this.roleSelect.getCurRole(), true);
						}
					} else {
						//切换页签
						this.weaponsoul.open(this.roleSelect.getCurRole(), true);
					}

				} else {
					UserTips.ins().showTips(OpenSystem.ins().getNoOpenTips(SystemType.WEAPONS));
				}
				break;
			case ForgeWin.PageSelectSamsara:
				//this.reinComposePanel.open();
				this.roleSelect.hideRole();
				break;
		}
		if (!change)//未开启防止切换
			this.tab.selectedIndex = this.viewStack.selectedIndex;

		/**检查是否成功切换 成功切换停止相关功能*/
		if (this.tab.selectedIndex != this.viewStack.selectedIndex) {
			this.checkAutoBtn();
		}
	}

	private checkIsOpen(index: number) {
		switch (index) {
			case ForgeWin.Page_Select_Boost:
				break;
			case ForgeWin.Page_Select_Gem:
				if (Actor.level < GlobalConfig.StoneOpenConfig[0].openLv) {//铸造开启条件
					UserTips.ins().showTips("精炼" + GlobalConfig.StoneOpenConfig[0].openLv + "级开启");
					return false;
				}
				break;
			case ForgeWin.Page_Select_ZhuLing:
				break;
			case ForgeWin.Page_Select_Weapon:
				if (!OpenSystem.ins().checkSysOpen(SystemType.WEAPONS)) {
					UserTips.ins().showTips(OpenSystem.ins().getNoOpenTips(SystemType.WEAPONS));
					return false;
				}
				break;
		}
		return true;
	}

	/**
	 * 锻造功能任何一键按钮开启期间 切换页面都停止
	 */
	private checkAutoBtn() {
		//强化
		if (this.boostPanel.isAutoUp) {
			this.boostPanel.stopAutoUp();
		}
		//精炼
		if (this.zhulingPanel.isAutoUp) {
			this.zhulingPanel.stopAutoUp();
		}
		//铸造
		// if ( this.gemPanel.isAutoUp ){
		// 	this.gemPanel.stopAutoUp();
		// }
	}


	/**
	 * 提升后的回调
	 */
	private forgeSuccessEff: MovieClip;

	private onEvent(para: number[]): void {
		let packageID: number = para[0];
		let index: number = para[1];
		let lastIndex: number = 0;
		let role: Role = SubRoles.ins().getSubRoleByIndex(this.roleSelect.getCurRole());
		switch (packageID) {
			case PackageID.strongthen:
				if (ForgeWin.Page_Select_Boost == this.viewStack.selectedIndex) {
					if (!this.boostPanel.isAutoUp) {
						this.mcList[index].x = index % 2 * 434 + 40;
						this.mcList[index].y = Math.floor(index / 2) * 120 + 35;
						this.mcList[index].playFile(RES_DIR_EFF + "forgeSuccess", 1);
						this.boostPanel.itemGroup.addChild(this.mcList[index]);
					}
					index = role.getMinEquipIndexByType(0);
					this.boostPanel.changeData(index, role.getEquipByIndex(index).strengthen);
					this.boostPanel.autoUpBack(index);
				}
				break;
			case PackageID.Gem:
				break;
			case PackageID.Zhuling:
				if (ForgeWin.Page_Select_ZhuLing == this.viewStack.selectedIndex) {
					if (!this.zhulingPanel.isAutoUp) {
						this.mcList[index].x = this.zhulingPanel["kuang" + index].x + this.zhulingPanel["kuang" + index].width / 2;
						this.mcList[index].y = this.zhulingPanel["kuang" + index].y + this.zhulingPanel["kuang" + index].height / 2;
						this.mcList[index].playFile(RES_DIR_EFF + "forgeSuccess", 1);
						this.zhulingPanel.itemGroup.addChild(this.mcList[index]);
					}
					index = role.getMinEquipIndexByType(ForgeWin.Page_Select_ZhuLing);
					this.zhulingPanel.changeData(index, role.getEquipByIndex(index).zhuling);
					this.zhulingPanel.autoUpBack(index);
				}
				break;
		}
		TimerManager.ins().doTimer(200, 1,
			() => {
				switch (packageID) {
					case PackageID.strongthen:
						// this.boostPanel.changeData(index, role.getEquipByIndex(index).strengthen);
						break;
					case PackageID.Gem:
						//修复精炼报错
						if (ForgeWin.Page_Select_Gem == this.viewStack.selectedIndex) {
							this.gemPanel.changeData(index, role.getEquipByIndex(index).gem);
						}
						break;
					case PackageID.Zhuling:
						//this.zhulingPanel.changeData(index, role.getEquipByIndex(index).zhuling);
						break;
				}
			}, this);

		this.redPointEx();
	}

	private delayRedPoint() {
		if (!TimerManager.ins().isExists(this.redPointEx, this)) TimerManager.ins().doTimer(60, 1, this.redPointEx, this);
	}

	public redPointEx() {
		let roleRedPoint: boolean[] = [false, false, false];
		for (let i = 0; i < roleRedPoint.length; i++) {
			this.roleSelect.showRedPoint(i, roleRedPoint[i]);
		}
		for (let i = 0; i < 4; i++) {
			if (ForgeRedPoint.ins().roleTabs[i] && this.tab.selectedIndex == i) {
				for (let j = 0; j < SubRoles.ins().subRolesLen; j++) {
					this.roleSelect.showRedPoint(j, ForgeRedPoint.ins().roleTabs[i][j]);
					if (i == ForgeWin.Page_Select_Weapon) {
						//是否打开了兵魂之灵 角色红点单独判定
						if (this.weaponsoul.isShowSoul()) {
							//兵魂之灵界面的人物红点
							this.roleSelect.showRedPoint(j, ForgeRedPoint.ins().getFlexibleRoleRedPoint(j));
						}
					}
				}
			}
			this["redPoint" + i].visible = false;
			this[`redPoint${i}`].visible = ForgeRedPoint.ins().getRedPoint(i);
		}
		//this.redPoint4.visible = ForgeRedPoint.ins().getRedPoint(4);
	}

	private redPoint() {
		let len: number = SubRoles.ins().subRolesLen;
		// let role: RoleModel[] = GameLogic.ins().rolesModel;
		let roleRedPoint: boolean[] = [false, false, false];
		for (let i = 0; i < roleRedPoint.length; i++) {
			this.roleSelect.showRedPoint(i, roleRedPoint[i]);
			this["redPoint" + i].visible = false;
		}
		this.redPoint3.visible = false;

		for (let roleIndex: number = 0; roleIndex < len; roleIndex++) {
			//这里最大只能是3 因为枚举3是兵魂是单独处理 和原有系统突破的3不同 突破的3其实已经废弃没用了
			for (let i: number = 0; i < 3; i++) {
				let role: Role = SubRoles.ins().getSubRoleByIndex(roleIndex);
				let index: number = role.getMinEquipIndexByType(i);
				let lv: number = this.getForgeLv(i, role, index);
				let costNum: number = this.getForgeIdOrCount(i, lv, 0);
				if (costNum) {
					let goodId: number = this.getForgeIdOrCount(i, lv, 1);
					let goodsNum: number;
					if (i == ForgeWin.Page_Select_Gem) {
						goodsNum = Actor.soul;
					} else {
						goodsNum = UserBag.ins().getBagGoodsCountById(0, goodId);
					}
					if (goodsNum >= costNum) {
						if (this.tab.selectedIndex == i)
							this.roleSelect.showRedPoint(roleIndex, true);
						/**
						 * 额外红点条件
						 * 1.铸造25级以上
						 * */
						if (i != ForgeWin.Page_Select_Gem)//非原铸造 现精炼
							this["redPoint" + i].visible = true;
						else {//原铸造 现精炼
							if (Actor.level >= GlobalConfig.StoneOpenConfig[0].openLv)
								this["redPoint" + i].visible = true;
						}

						if (this["redPoint" + i].visible) {
							let r: Role = SubRoles.ins().getSubRoleByIndex(this.roleSelect.getCurRole());
							this["redPoint" + i].visible = UserForge.ins().isMaxForge(r, i);
						}
					}
				}
			}
			//兵魂分页红点
			let weapRedPoint: boolean = Weapons.ins().checkRedPoint(roleIndex);
			if (!this.redPoint3.visible) {
				this.redPoint3.visible = weapRedPoint;
			}
			if (this.tab.selectedIndex == ForgeWin.Page_Select_Weapon)
				this.roleSelect.showRedPoint(roleIndex, weapRedPoint);
		}
	}

	private getForgeLv(type: number, role: Role, index: number): number {
		switch (type) {
			case ForgeWin.Page_Select_Boost:
				return role.getEquipByIndex(index).strengthen;
			case ForgeWin.Page_Select_ZhuLing:
				return role.getEquipByIndex(index).zhuling;
			case ForgeWin.Page_Select_Gem:
				return role.getEquipByIndex(index).gem;
			case 3://兵魂的3是单独处理 这里的3是旧系统的3 不需要处理
				return role.getEquipByIndex(index).tupo;
		}
	}


	private getForgeIdOrCount(type: number, lv: number, idOCount: number): number {
		switch (type) {
			case ForgeWin.Page_Select_Boost:
				let boostConfig: EnhanceCostConfig = UserForge.ins().getEnhanceCostConfigByLv(lv + 1);
				if (boostConfig) {
					if (idOCount)
						return boostConfig.stoneId;
					else
						return boostConfig.stoneNum;
				}
				break;
			case ForgeWin.Page_Select_ZhuLing:
				let zhulingConfig: ZhulingCostConfig = UserForge.ins().getZhulingCostConfigByLv(lv + 1);
				if (zhulingConfig) {
					if (idOCount)
						return zhulingConfig.itemId;
					else
						return zhulingConfig.count;
				}
				break;
			case ForgeWin.Page_Select_Gem:
				let gemConfig: StoneLevelCostConfig = UserForge.ins().getStoneLevelCostConfigByLv(lv + 1);
				if (gemConfig) {
					if (idOCount)
						return gemConfig.stoneId;
					else
						return gemConfig.soulNum;
				}
				break;
			case 3://兵魂的3是单独处理  这里的3是旧系统的3突破 不处理
				let tupoConfig: TupoCostConfig = UserForge.ins().getTupoCostConfigByLv(lv + 1);
				if (tupoConfig) {
					if (idOCount)
						return tupoConfig.itemId;
					else
						return tupoConfig.count;
				}
				break;
		}
		return 0
	}

	private onChange(e: egret.Event): void {
		this.setRoleId(this.roleSelect.getCurRole(), true);
	}


	private setRoleId(roleId: number, roleChange?: boolean): void {
		this.boostPanel.curRole = this.gemPanel.curRole = this.zhulingPanel.curRole = roleId;
		this.setOpenIndex(this.viewStack.selectedIndex, roleChange);
		this.redPointEx();
	}
}

ViewManager.ins().reg(ForgeWin, LayerManager.UI_Main);
