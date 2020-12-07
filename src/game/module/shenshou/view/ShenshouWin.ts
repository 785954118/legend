/**
 * 神兽守护
 * @author MPeter
 */
class ShenshouWin extends BaseView {
	/**当前神兽选项面板 */
	private shenshouItem: ShenshouInfoPanel;
	/**战力 */
	private powerPanel: PowerPanel;
	/**出战次数 */
	private fightCount: eui.Label;
	/**属性 */
	private attr1: eui.Label;
	private attr2: eui.Label;
	private attr3: eui.Label;
	private attr4: eui.Label;
	/**出战按钮 */
	private activityBtn: eui.Button;

	/**技能 */
	private skill1: BaseComponent;
	private skill2: BaseComponent;
	private skill3: BaseComponent;
	private skill4: BaseComponent;

	/**选项列表 */
	private listScroller: eui.Scroller;
	private listMenu: eui.List;

	/**左右按钮 */
	private rightGroup: eui.Group;
	private rightBtn: eui.Button;
	private rightRed: eui.Image;
	private leftGroup: eui.Group;
	private leftBtn: eui.Button;
	private leftRed: eui.Image;


	//数据====================
	private listMenuDt: eui.ArrayCollection;
	private curId: number = 1;


	private MAX_SKILL: number = 4;
	public constructor() {
		super();
	}
	protected childrenCreated() {
		this.listMenu.itemRenderer = ShenshouTab;
		this.listMenuDt = new eui.ArrayCollection(CommonUtils.objectToArray(GlobalConfig.ShenShouBase));
		this.listMenu.dataProvider = this.listMenuDt;

	}
	public open(...param: any[]): void {
		this.addTouchEvent(this.rightBtn, this.onTouch);
		this.addTouchEvent(this.leftBtn, this.onTouch);
		this.addTouchEvent(this.activityBtn, this.onTouch);
		this.addTouchEvent(this.shenshouItem, this.onTouch);
		this.addEvent(eui.ItemTapEvent.ITEM_TAP, this.listMenu, this.onTouchMenu);
		this.addEvent(eui.UIEvent.CHANGE_END, this.listScroller, this.onChange);

		for (let i: number = 1; i <= this.MAX_SKILL; i++) {
			this.addTouchEvent(this[`skill${i}`], this.onTouch);
		}

		this.observe(ShenshouRedpoint.ins().postRedPoint, this.refRedPoint);
		this.observe(ShenshouSys.ins().postWearEquip, this.refEquipData);
		this.observe(ShenshouSys.ins().postUpEquip, this.refEquipData);
		this.observe(ShenshouSys.ins().postInfo, this.refData);
		this.observe(ShenshouSys.ins().postBattleState, this.refData);


		this.listMenu.selectedIndex = 0;
		this.showUI(this.curId);
		this.onChange();
		this.refRedPoint();
	}
	public close(...param: any[]): void {
		this.shenshouItem.close();
	}
	private onTouchMenu(e: eui.ItemTapEvent) {
		this.curId = e.item.id;
		this.showUI(this.curId);
	}
	private onChange(): void {
		if (this.listMenu.scrollH < 20) {
			this.leftBtn.visible = false;
			this.rightBtn.visible = true;
		} else if (this.listMenu.scrollH > (this.listMenu.dataProvider.length - 5) * 88 + 2) {
			this.leftBtn.visible = true;
			this.rightBtn.visible = false;
		} else {
			this.leftBtn.visible = true;
			this.rightBtn.visible = true;
		}
		if (this.listMenu.dataProvider.length <= 5) {
			this.leftBtn.visible = false;
			this.rightBtn.visible = false;
		}

		this.refArrowRedpoint();
	}

	/**当前展示 */
	private showUI(id: number): void {
		let model = ShenshouModel.ins();
		let sys = ShenshouSys.ins();
		let data = model.getDataById(id);
		let dp = GlobalConfig.ShenShouBase[id];

		//技能
		for (let i: number = 0; i < this.MAX_SKILL; i++) {
			if (dp.skill && dp.skill[i]) {
				this[`skill${i + 1}`].visible = true;
				this[`skill${i + 1}`].touchChildren = false;
				let skillData = GlobalConfig.ShenShouSkill[dp.skill[i]];
				this[`skill${i + 1}`].name = dp.skill[i];
				this[`skill${i + 1}`].skillImg.source = skillData.icon;
				this[`skill${i + 1}`].skillName.text = skillData.name;
				this[`skill${i + 1}`].skillQuality.source = 'quality' + skillData.quality;
			}
			else {
				this[`skill${i + 1}`].visible = false;
			}
		}

		this.shenshouItem.setID(id);
		this.refEquipData();
	}
	/**刷新装备数据 */
	@callLater
	private refEquipData(): void {
		let model = ShenshouModel.ins();

		this.shenshouItem.refEquipData();

		//变换装备属性
		this.attr1.text = "+" + model.getAttrValue(this.curId, AttributeType.atAttack);//攻击
		this.attr2.text = "+" + model.getAttrValue(this.curId, AttributeType.atMaxHp);//生命
		this.attr3.text = "+" + model.getAttrValue(this.curId, AttributeType.atDef);//物防
		this.attr4.text = "+" + model.getAttrValue(this.curId, AttributeType.atRes);//魔防
		//刷新装备战斗力
		this.powerPanel.setPower(ShenshouModel.ins().calcEquipScore(this.curId) * SubRoles.ins().subRolesLen);

		this.refEquipRedpoint();
		this.refData();
	}
	/**刷新数据 */
	private refData(): void {
		let model = ShenshouModel.ins();
		let sys = ShenshouSys.ins();
		this.fightCount.text = `当前出战：${model.getCurBattle()}/${model.getCountBattle()}`;

		let state = model.getCurStatus(this.curId);
		this.shenshouItem.refState(state);
		switch (state) {
			case ShenshouState.State_No://未激活
				this.activityBtn.enabled = false;
				this.activityBtn.label = `出战`;
				break;
			case ShenshouState.State_Can://可出战
				this.activityBtn.enabled = true;
				this.activityBtn.label = `出战`;
				break;
			case ShenshouState.State_Has://已出战
				this.activityBtn.enabled = true;
				this.activityBtn.label = `取消出战`;
				break;
		}
		this.listMenuDt.replaceAll(CommonUtils.objectToArray(GlobalConfig.ShenShouBase));
	}

	/**刷新箭头红点 */
	private refArrowRedpoint(): void {
		this.rightRed.visible = false;
		this.leftRed.visible = false;
		if (this.leftBtn.visible) {
			let redList: boolean[] = ShenshouRedpoint.ins().redpoints.slice(0, 4);
			this.leftRed.visible = redList.indexOf(true) > -1;
		}

		if (this.rightBtn.visible) {
			let redList: boolean[] = ShenshouRedpoint.ins().redpoints.slice(5, 9);
			this.rightRed.visible = redList.indexOf(true) > -1;
		}
	}
	/**刷新红点 */
	private refRedPoint(): void {
		this.refArrowRedpoint();
		//刷新按钮红点
		this.listMenuDt.replaceAll(CommonUtils.objectToArray(GlobalConfig.ShenShouBase));


		this.refEquipRedpoint();
	}
	/**刷新装备红点 */
	private refEquipRedpoint(): void {
		for (let i: number = 0; i < GlobalConfig.ShenShouConfig.posCount; i++) {
			if (ShenshouRedpoint.ins().redpointEquips1[this.curId] && ShenshouRedpoint.ins().redpointEquips1[this.curId][i + 1]
				|| ShenshouRedpoint.ins().redpointEquips2[this.curId] && ShenshouRedpoint.ins().redpointEquips2[this.curId][i + 1]) {
				this.shenshouItem[`item${i}`].redPoint.visible = true;
			}
			else {
				this.shenshouItem[`item${i}`].redPoint.visible = false;
			}
		}
	}

	/**触摸 */
	private onTouch(e: egret.TouchEvent): void {
		let num: number = 92 * 5;
		let scrollH: number = 0;
		switch (e.target) {
			case this.rightBtn:
				scrollH = this.listMenu.scrollH + num;
				scrollH = Math.round(scrollH / 92) * 92;
				if (scrollH > this.listMenu.contentWidth - this.listScroller.width) {
					scrollH = this.listMenu.contentWidth - this.listScroller.width;
				}
				this.listMenu.scrollH = scrollH;
				this.onChange();
				break;
			case this.leftBtn:
				scrollH = this.listMenu.scrollH - num;
				scrollH = Math.round(scrollH / 92) * 92;
				if (scrollH < 0) {
					scrollH = 0;
				}
				this.listMenu.scrollH = scrollH;
				this.onChange();
				break;
			case this.activityBtn:
				//只有已出状态才判断
				if (ShenshouModel.ins().getCurStatus(this.curId) == ShenshouState.State_Can) {
					let curNum = ShenshouModel.ins().getCurBattle();
					//当前出战不是最大次数，且背包里有道具，则提示使用
					if (curNum < GlobalConfig.ShenShouConfig.maxCount &&
						UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, GlobalConfig.ShenShouConfig.battleCountItem) &&
						curNum >= ShenshouModel.ins().getCountBattle()) {
						ViewManager.ins().open(ShenshouDanUseWin, GlobalConfig.ItemConfig[GlobalConfig.ShenShouConfig.battleCountItem]);
						return;
					}
					if (curNum >= ShenshouModel.ins().getCountBattle()) {
						UserTips.ins().showCenterTips(`兽神的出战总量已经达到上限`);
						return;
					}
				}

				ShenshouSys.ins().sendBattle(this.curId);
				break;
			default:
				if (e.target.skinName == `shenshouEquipItem`) {
					// UserTips.ins().showCenterTips(`点击装备${e.target}`)
					let pos: number = parseInt(e.target.name);
					if (e.target.data) {
						ViewManager.ins().open(ShenshouEquipTip, this.curId, pos, e.target.data);
					}
					else {
						ViewManager.ins().open(ShenshouWearEquipWin, this.curId, pos);
					}
				}
				else if (e.target.parent.skinName == `shenshouSkillItem` || e.target.skinName == `shenshouSkillItem`) {
					ViewManager.ins().open(ShenshouSkillTip, GlobalConfig.ShenShouSkill[e.target.name]);
				}
		}
	}
}