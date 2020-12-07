/**
 * 龙魂/护盾/血玉
 */
class LongHunWin extends BaseView {
	public colorCanvas0: eui.Image;
	public face: eui.Image;

	public curAtt: eui.Label;
	public nextAtt: eui.Label;
	public nextAttBG: eui.Image;
	public cursor: eui.Image;

	public upgradeBtn: eui.Button;
	public closeBtn: eui.Button;
	public closeBtn0: eui.Button;
	// public roleSelect: RoleSelectPanel;
	/** 当前选择的角色 */
	public curRole: number;

	public maxGroup: eui.Group;

	public progressTitle: eui.Label;
	// public barBg: eui.Image;
	// public expBar: eui.ProgressBar;
	public material: eui.Label;

	public vipLabel: eui.Label;
	public icon: eui.Image;

	public maxLevel: eui.Group;
	private mc: MovieClip;
	private _config: LoongSoulConfig | ShieldConfig;
	private _stageConfig: LoongSoulStageConfig | ShieldStageConfig | XueyuStageConfig;
	private starList: StarList = null;
	public index: number;
	private _missingNum: number;

	private iconY: number;
	private iconMoveY: number;

	private starGroup: eui.Group;
	private powerPanel: PowerPanel;
	private stairImg: LevelImage;
	private activeBtn: eui.Button;
	private activeGroup: eui.Group;
	private eff: MovieClip;
	private activeBtnMc:eui.Group;
	private barbc = new ProgressBarEff();
	private expGroup: eui.Group;
	private maxShowGroup: eui.Group;
	private maxCurAtt: eui.Label;
	private sysDescText: eui.Label;
	private redPoint:eui.Image;
	public constructor() {
		super();
		// this.skinName = "ShenluSkin";
		// this.setSkinPart("roleSelect", new RoleSelectPanel());
		// this.setSkinPart("powerPanel", new PowerPanel());
		// this.isTopLevel = true;

	}

	protected childrenCreated() {

		this.barbc.setWidth(525);
		this.barbc.x = -15;
		this.barbc.y = -12;
		this.expGroup.addChild(this.barbc);

		this.mc = new MovieClip;
		this.mc.x = 240;
		this.mc.y = 400;

		this.starList = new StarList(10);
		this.starList.x = 15;
		this.starList.y = 0;
		this.starGroup.addChild(this.starList);

		this.iconY = this.icon.y;
		this.iconMoveY = this.iconY - 10;


		this.eff = new MovieClip;
		this.eff.x = this.activeBtnMc.width/2;
		this.eff.y = this.activeBtnMc.height/2;
		this.eff.scaleX = 1.17;
		this.eff.touchEnabled = false;
		this.activeBtnMc.touchEnabled = false;
	}

	public open(...param: any[]): void {
		let selectedIndex = (param && param[0]) ? param[0] : 0;
		// this.roleSelect.setCurRole(selectedIndex);
		this.curRole = selectedIndex;
		this.index = LongHun.TYPE_LONG_HUN;
		// this.roleSelect.setCurRole(0);

		// this.addTouchEvent(this.closeBtn, this.onTap);
		// this.addTouchEvent(this.closeBtn0, this.onTap);
		// this.addTouchEvent(this.colorCanvas0, this.onTap);
		this.addTouchEvent(this.upgradeBtn, this.onTap);
		// this.addChangeEvent(this.roleSelect, this.roleSelectChange);
		this.addTouchEvent(this.activeBtn, this.onTap);

		this.observe(UserBag.ins().postItemAdd, this.roleChange);//道具添加
		this.observe(LongHun.ins().postDateUpdate, this.roleChange);
		this.observe(LongHun.ins().postStageUpgrade, this.roleChange);
		this.observe(LongHun.ins().postStageActive, this.roleChange);

		this.barbc.reset();
		this.maxShowGroup.visible = false;
		this.roleChange();
		this.onTabChange();

		// this.playFlameMC();
		this.playIconTween();
	}

	public close(...param: any[]): void {
		// this.stopFlameMC();
		this.stopIconTween();

		this.removeTouchEvent(this.closeBtn, this.onTap);
		this.removeTouchEvent(this.closeBtn0, this.onTap);
		this.removeTouchEvent(this.colorCanvas0, this.onTap);
		this.removeTouchEvent(this.upgradeBtn, this.onTap);
		// this.roleSelect.removeEventListener(egret.Event.CHANGE, this.roleSelectChange, this);
		// this.tab.removeEventListener(egret.TouchEvent.CHANGE, this.onTabChange, this);
		// if (this.vipLabel.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
		// 	this.removeTouchEvent(this.vipLabel, this.onTaps);
		// }
		DisplayUtils.removeFromParent(this.eff);
		this.removeObserve();
	}

	private roleSelectChange(e: egret.Event): void {
		this.roleChange();
	}

	/**
	 * 播放icon缓动
	 */
	private playIconTween() {
		this.icon.y = this.iconY;
		egret.Tween.removeTweens(this.icon);
		egret.Tween.get(this.icon, { loop: true }).to({ y: this.iconMoveY }, 1000).to({ y: this.iconY }, 1000);
	}

	/**
	 * 停止icon缓动
	 */
	private stopIconTween() {
		egret.Tween.removeTweens(this.icon);
	}



	private onTabChange(e: egret.TouchEvent = null) {
		this.roleChange();
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.colorCanvas0:
			case this.closeBtn0:
			case this.closeBtn:
				ViewManager.ins().close(this);
				break;
			case this.upgradeBtn:
				if (this.upgradeBtn.label == "提升") {
					this.sendUpgrade();
				}
				else if (this.upgradeBtn.label == "升阶") {
					this.sendStageUpgrade();
				} else {
					this.openBuyGoods();
				}
				break;
			case this.activeBtn:
				let level: number = GlobalConfig.LoongSoulBaseConfig.openlv;
				if (Actor.level >= level) {
					this.sendStageActive();
				} else {
					UserTips.ins().showTips(`等级达到${level}级可激活`);
				}
				break;
		}
	}

	private onTaps(e: egret.TouchEvent): void {
		if (this._config == null)
			return;
		let num: number = GlobalConfig.VipConfig[this.index > 2 ? 13 : 14].attrAddition["percent"];
		num = this.index == LongHun.TYPE_XUE_YU ? 0 : num;
		let attr: number[] = [];
		this._config.attr.forEach(element => {
			attr.push((element.value * num / 100) >> 0);
		});
		ViewManager.ins().open(ForgeTipsWin, attr, AttributeData.getAttStr(this._config.attr, 1, 1, ""));
	}


	/**
	 * 满级操作
	 * @param  {boolean} flag
	 * @returns void
	 */
	protected maxControll(flag: boolean): void {
		this.maxGroup.visible = flag;
		this.material.visible = flag;
		this.barbc.visible = flag;
		// this.expLabel.visible = flag;
		// this.progressTitle.visible = flag;
		this.powerPanel.visible = true;
		this.maxLevel.visible = !flag;
		this.activeGroup.visible = false;
		this.stairImg.visible = true;
		this.maxShowGroup.visible = !flag;
		if (flag) {
			this.curAtt.x = 62;
			this.curAtt.y = 408;
		}
		else {
			this.curAtt.x = 170;
			this.curAtt.y = 408;

		}
		// this.curAttBG.x = this.curAtt.x;
		// this.curAttBG.y = this.curAtt.y;
	}

	/**
	 * 发送升级
	 */
	protected sendUpgrade(): void {
		LongHun.ins().sendUpGrade(this.curRole, this.index - 1);
	}

	/**
	 * 发送阶段升级
	 */
	protected sendStageUpgrade(): void {
		LongHun.ins().sendStageUpgrade(this.curRole, this.index - 1);
	}

	/**
	 * 打开购买物品框
	 */
	protected openBuyGoods(): void {
		UserWarn.ins().setBuyGoodsWarn(this._config.itemId, this._missingNum);
	}


	/**
	 * 发送激活
	 */
	protected sendStageActive(): void {
		LongHun.ins().sendStageActive(this.curRole, this.index - 1);
	}

	/**
	 * 更新阶段信息
	 * @returns void
	 */
	private updateStageInfo() {
		let currentRole = SubRoles.ins().getSubRoleByIndex(this.curRole);
		switch (this.index) {
			case LongHun.TYPE_LONG_HUN:
				// this.stages.text = currentRole.loongSoulData.stage.toString();
				this._stageConfig = GlobalConfig.LoongSoulStageConfig[currentRole.loongSoulData.stage];
				break;
			case LongHun.TYPE_HU_DUN:
				// this.stages.text = currentRole.shieldData.stage.toString();
				this._stageConfig = GlobalConfig.ShieldStageConfig[currentRole.shieldData.stage];
				break;
			case LongHun.TYPE_XUE_YU:
				// this.stages.text = currentRole.xueyuData.stage.toString();
				this._stageConfig = GlobalConfig['XueyuStageConfig'][currentRole.xueyuData.stage];
				break;
		}
		this.icon.source = this._stageConfig.icon;
	}

	protected roleChange(isUpgrade: number = 0): void {
		this.updateStageInfo();
		let lv: number = 0;
		let exp: number = 0;
		let nextConfig: LoongSoulConfig | ShieldConfig;
		let fase: string;
		let role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		let finallyAttr: AttributeData[] = null;
		if (this.index == LongHun.TYPE_HU_DUN) {
			//护盾
			lv = role.shieldData.level;
			exp = role.shieldData.exp;
			this._config = GlobalConfig.ShieldConfig[lv];
			nextConfig = GlobalConfig.ShieldConfig[lv + 1];
			if (UserVip.ins().lv >= 13) {
				// this.vipLabel.textFlow = new egret.HtmlTextParser().parser("<u>VIP13加成</u>");
				// this.vipLabel.visible = true;
				this.addTouchEvent(this.vipLabel, this.onTaps);
				let attr: AttributeData[] = AttributeData.getAttrStrAdd(this._config.attr, 13);
				this.curAtt.text = AttributeData.getAttStr(attr, 0, 1, "：");
			} else {
				// this.vipLabel.visible = false;
				finallyAttr = AttributeData.AttrAddition(this._config.attr, this._stageConfig.attr);
				this.curAtt.text = AttributeData.getAttStr(finallyAttr, 0, 1, "：");
			}

		} else if (this.index == LongHun.TYPE_LONG_HUN) {
			//龙魂
			lv = role.loongSoulData.level;
			exp = role.loongSoulData.exp;
			let stair = 0;
			this._config = GlobalConfig.LoongSoulConfig[lv];
			nextConfig = GlobalConfig.LoongSoulConfig[lv + 1];
			this.stairImg.setValue(role.loongSoulData.stage + 1);
			if (UserVip.ins().lv >= 14) {
				// this.vipLabel.textFlow = new egret.HtmlTextParser().parser("<u>VIP14加成</u>");
				// this.vipLabel.visible = true;
				// this.addTouchEvent(this.vipLabel, this.onTaps);
				let attr: AttributeData[] = AttributeData.getAttrStrAdd(this._config.attr, 14);
				this.curAtt.text = AttributeData.getAttStr(attr, 0, 1, "：");
			} else {
				// this.vipLabel.visible = false;
				finallyAttr = AttributeData.AttrAddition(this._config.attr, this._stageConfig.attr);
				this.curAtt.text = AttributeData.getAttStr(finallyAttr, 0, 1, "：");
			}
			this.maxCurAtt.text = this.curAtt.text;
		}

		if (lv > 0) {
			this.starList.setStarNum(lv % 10 == 0 ? 10 : lv % 10, isUpgrade);
		} else {
			this.starList.setStarNum(0);
		}
		let level: number = GlobalConfig.LoongSoulBaseConfig.openlv;
		this.sysDescText.text = `开启龙魂获得大量攻击防御\n\n${level}级可开启`

		this.barbc.setData(exp, this._config.exp);
		//红点计算
		// this.showTabRedPoint();
		// this.showRoleRedPoint();
		let power: number = UserBag.getAttrPower(this._config.attr);
		this.powerPanel.setPower(power);
		let longHunMax:number = CommonUtils.getObjectLength(GlobalConfig.LoongSoulConfig)-1;
		if (role.loongSoulData.state) {
			if (lv != longHunMax) {
				this.maxControll(true);
			} else {
				this.maxControll(false);
				return;
			}
		} else {
			this.maxGroup.visible = false;
			this.material.visible = false;
			this.barbc.visible = false;
			this.maxLevel.visible = false;
			this.stairImg.visible = false;
			this.activeGroup.visible = true;
			this.powerPanel.visible = false;
			this.redPoint.visible = false;
			if (Actor.level >= level) {
				this.activeBtn.enabled = true;
				this.eff.playFile(RES_DIR_EFF + "chargeff1", -1);
				if (!this.eff.parent) {
					// this.activeBtn.parent.addChildAt(this.eff, this.getChildIndex(this.activeBtn));
					// this.activeBtn.parent.swapChildren(this.eff,this.redPoint);
					this.activeBtnMc.addChild(this.eff);
				}
				// this.eff.play(-1);
				this.redPoint.visible = true;
			} else {
				this.activeBtn.enabled = false;
				DisplayUtils.removeFromParent(this.eff);
			}
		}


		// if (this.barbc.getMaxValue() != this._config.exp) {

		// }
		// else {
		// 	this.barbc.setValue(exp);
		// }

		let itemCount = UserBag.ins().getBagGoodsCountById(0, this._config.itemId);
		let itemName = GlobalConfig.ItemConfig[this._config.itemId].name;
		this.upgradeBtn.label = itemCount < 1 ? "获得材料" : "提升";

		if (itemCount < this._stageConfig.normalCost) {
			this._missingNum = this._stageConfig.normalCost - itemCount;
		}
		else {
			this._missingNum = 0;
		}
		let colorStr: string = "";
		if (itemCount >= this._stageConfig.normalCost)
			colorStr = ColorUtil.GREEN_COLOR;
		else
			colorStr = ColorUtil.RED_COLOR;

		this.material.textFlow = TextFlowMaker.generateTextFlow(`拥有碎片:<font color=${colorStr}>${itemCount}</font><font color=${ColorUtil.WHITE_COLOR}>/${this._stageConfig.normalCost}</font> `);


		this.material.visible = true;

		this.showStageUpgradeBtn(lv);

		let attrs: AttributeData[];
		let nextStageCofig: LoongSoulStageConfig | ShieldStageConfig | XueyuStageConfig;
		let stageLevel: number = 0;
		let isStageUpgrade: boolean = this.upgradeBtn.label == "升阶";
		let tempConfig: LoongSoulConfig | ShieldConfig = isStageUpgrade ? this._config : nextConfig;
		if (this.index == LongHun.TYPE_LONG_HUN) {
			attrs = AttributeData.getAttrStrAdd(tempConfig.attr, 13);
			stageLevel = isStageUpgrade ? role.loongSoulData.stage + 1 : role.loongSoulData.stage;
			nextStageCofig = GlobalConfig.LoongSoulStageConfig[stageLevel];
		}
		else if (this.index == LongHun.TYPE_HU_DUN) {
			attrs = AttributeData.getAttrStrAdd(tempConfig.attr, 14);
			stageLevel = isStageUpgrade ? role.shieldData.stage + 1 : role.shieldData.stage;
			nextStageCofig = GlobalConfig.ShieldStageConfig[stageLevel];
		}
		else if (this.index == LongHun.TYPE_XUE_YU) {
			attrs = AttributeData.getAttrStrAdd(tempConfig.attr, 15);
			stageLevel = isStageUpgrade ? role.xueyuData.stage + 1 : role.xueyuData.stage;
			nextStageCofig = GlobalConfig['XueyuStageConfig'][stageLevel];
		}

		attrs = AttributeData.AttrAddition(attrs, nextStageCofig.attr);
		this.nextAtt.text = AttributeData.getAttStr(attrs, 0, 1, "：");
	}

	private showStageUpgradeBtn(lv: number) {
		let stageLevel: number = 0;
		let role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		switch (this.index) {
			case LongHun.TYPE_LONG_HUN:
				stageLevel = role.loongSoulData.stage;
				break;
			case LongHun.TYPE_HU_DUN:
				stageLevel = role.shieldData.stage;
				break;
			case LongHun.TYPE_XUE_YU:
				stageLevel = role.xueyuData.stage;
				break;
		}

		if (lv > 0 && lv % 10 == 0) {
			if (stageLevel <= lv / 10 - 1) {
				this.upgradeBtn.label = "升阶";
				this.material.visible = false;
				this.starList.setStarNum(10);
				this.barbc.visible = false;
			}
			else {
				this.starList.setStarNum(0);
				this.barbc.visible = true;
			}
		}
	}
}