/**
 * 神兽守护装备强化
 * @author MPeter
 */
class ShenshouForgeWin extends BaseEuiView {
	//组件部分---------------------------
	public bgClose: eui.Rect;
	public powerPanel: PowerPanel;
	public equipName: eui.Label;
	public itemIcon: ItemBase;
	public exp: eui.ProgressBar;
	public departBtn: eui.Button;
	public lvUpBtn: eui.Button;
	public rightRed: eui.Image;
	public list: eui.List;
	public closeBtn: eui.Button;
	private attrPanel: BaseComponent;
	private iconGroup: eui.Group;
	private maxExpImg: eui.Image;
	private maxExpTxt: eui.Image;

	private forgetMC: MovieClip;
	//数据部分---------------------------
	private listDt: eui.ArrayCollection;
	private shenshouId: number;
	private pos: number;
	private curItemDp: ItemConfig;
	private nowList: number[];
	private filterList: number[];
	private curScore: number;

	public constructor() {
		super();
		this.skinName = `SsEquipForgeSkin`;
	}

	protected childrenCreated() {
		this.list.itemRenderer = ShenshouEquipItem1;
		this.listDt = new eui.ArrayCollection();
		this.list.dataProvider = this.listDt;

		this.nowList = [];

		this.exp.value = 0;
		this.exp.labelFunction = (value: number, max: number) => {
			return `${ShenshouSys.ins().exp}/${max}`;
		};
	}

	public open(...args): void {
		this.shenshouId = args[0];
		this.pos = args[1];
		this.curItemDp = args[2];
		this.filterList = [];

		this.addTouchEvent(this.departBtn, this.onTouch);
		this.addTouchEvent(this.lvUpBtn, this.onTouch);
		this.addTouchEvent(this.closeBtn, this.onTouch);
		this.addTouchEvent(this.bgClose, this.onTouch);
		this.addTouchEvent(this.list, this.onList);


		this.observe(ShenshouSys.ins().postUpEquip, this.onUpEquip);
		this.observe(ShenshouSys.ins().postUpdateExp, this.refUIData);
		this.observe(ShenshouSys.ins().postDepartEquip, this.onDecompose);
		this.observe(ShenshouRedpoint.ins().postRedPoint2, this.refRedpoint);


		this.refRedpoint();
		this.refUIData();
		this.refList();
	}

	public close(...args): void {
		DisplayUtils.removeFromParent(this.forgetMC);
	}

	@callLater
	private onUpExp(): void {
		this.exp.value = ShenshouSys.ins().exp;
		this.exp.maximum = GlobalConfig.ShenShouEquip[this.curItemDp.id].exp;
		this.exp.value = ShenshouSys.ins().exp;
		//这里需要特殊显示，由于组建自身不能满足，所以需要特殊处理
		this.exp.labelDisplay.text = `${ShenshouSys.ins().exp}/${this.exp.maximum}`;

	}

	/**更新装备 */
	private onUpEquip(equipId: number): void {
		this.curItemDp = GlobalConfig.ItemConfig[equipId];
		this.refUIData();

		if (!this.forgetMC) {
			this.forgetMC = new MovieClip();
			this.forgetMC.x = 62;
			this.forgetMC.y = 62;
		}
		this.forgetMC.playFile(RES_DIR_EFF + "forgeSuccess", 1);
		this.iconGroup.addChild(this.forgetMC);

	}

	/**刷新UI数据 */
	private refUIData(): void {
		let shenshouEquip = GlobalConfig.ShenShouEquip[this.curItemDp.id];
		this.curScore = UserBag.getAttrPower(shenshouEquip.attrs);
		if (shenshouEquip.expower) this.curScore += shenshouEquip.expower;
		this.powerPanel.setPower(this.curScore * SubRoles.ins().subRolesLen);

		this.equipName.text = this.curItemDp.name;
		this.equipName.textColor = ItemConfig.getQualityColor(this.curItemDp);
		this.itemIcon.data = this.curItemDp.id;
		this.itemIcon.hideName();

		let lv = ShenshouModel.ins().getEquipLv(this.curItemDp.id);
		this.attrPanel[`lvNow`].text = `Lv.${lv}`;
		this.attrPanel[`lvNext`].text = `Lv.${lv + 1}`;
		this.maxExpImg.visible = false;
		this.maxExpTxt.visible = false;

		let nextEquip = GlobalConfig.ShenShouEquip[this.curItemDp.id + 1];
		if (!nextEquip) {
			this.lvUpBtn.enabled = false;
			this.attrPanel.currentState = `max`;
			this.exp.visible = false;
			this.maxExpImg.visible = true;
			this.maxExpTxt.visible = true;
		}
		for (let i: number = 0; i < 3; i++) {
			if (shenshouEquip.attrs[i]) {
				this.attrPanel[`attr${i + 1}Now`].visible = true;
				this.attrPanel[`attr${i + 1}Next`].visible = nextEquip && nextEquip.attrs[i];
				this.attrPanel[`attr${i + 1}Now`].text = AttributeData.getAttStrByType(shenshouEquip.attrs[i], 0, `:`);
				if (nextEquip && nextEquip.attrs[i]) {
					this.attrPanel[`attr${i + 1}Next`].text = AttributeData.getAttStrByType(nextEquip.attrs[i], 0, `:`);
				}
			}
			else {
				this.attrPanel[`attr${i + 1}Next`].visible = false;
				this.attrPanel[`attr${i + 1}Now`].visible = false;
			}
		}


		this.onUpExp();
	}

	/**分解返回 */
	private onDecompose(): void {
		let num: number = this.list.numChildren;
		for (let i: number = 0; i < num; i++) {
			let item: ShenshouEquipItem1 = this.list.getChildAt(i) as ShenshouEquipItem1;
			if (item) {
				item.playDepartMc();
			}
		}

		TimerManager.ins().doTimer(500, 1, this.refList, this);
	}

	/**刷新列表 */
	private refList(): void {
		let items = UserBag.ins().getBagGoodsByType(ItemType.TYPE_23);
		this.nowList = [];
		let max: number = 13;


		while (--max >= 0) {
			if (items[max]) {
				if (items[max].count > 1) {
					for (let i: number = 0; i < items[max].count; i++) {
						if (this.filterList.indexOf(items[max].configID) > -1 || !this.checkCurEquip(items[max].configID)) continue;
						this.nowList.push(items[max].configID);
					}
				}
				else {
					if (this.filterList.indexOf(items[max].configID) > -1 || !this.checkCurEquip(items[max].configID)) continue;
					this.nowList.push(items[max].configID);
				}
			}
		}

		this.listDt.replaceAll(this.nowList);
	}

	/**检测当前装备战力是否比传入装备战力大 */
	private checkCurEquip(id: number): boolean {
		let equipData = GlobalConfig.ShenShouEquip[id];
		let score = equipData ? UserBag.getAttrPower(equipData.attrs) : 0;
		return this.curScore >= score;
	}

	/**点击移除不想分解的装备*/
	private onList(e: egret.TouchEvent): void {
		if (e.target instanceof ShenshouEquipItem1 && this.filterList.indexOf(e.target.data) == -1) {
			this.filterList.push(e.target.data);
		}
		this.refList();
	}

	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.closeBtn:
			case this.bgClose:
				ViewManager.ins().close(this);
				break;
			case this.lvUpBtn:
				if (ShenshouSys.ins().exp < this.exp.maximum) {
					UserTips.ins().showCenterTips(`当前兽神精魄不足，无法升级！`);
					return;
				}
				ShenshouSys.ins().sendUpEquip(this.shenshouId, this.pos);
				break;
			case this.departBtn:
				if (!this.nowList.length) {
					UserTips.ins().showCenterTips(`当前没有可分解的装备`);
					return;
				}

				let cutNowList = []
				for (let i = 0; i < this.nowList.length; i++) {
					cutNowList.push(this.nowList[i])
					if(cutNowList.length >=30){
						ShenshouSys.ins().sendDepartEquip(cutNowList);
						cutNowList = []
					}
				}
				if(cutNowList.length > 0){
					ShenshouSys.ins().sendDepartEquip(this.nowList);
				}
				break;
		}
	}

	@callLater
	private refRedpoint(): void {
		this.rightRed.visible = ShenshouRedpoint.ins().redpointEquips2[this.shenshouId][this.pos];
	}

}

ViewManager.ins().reg(ShenshouForgeWin, LayerManager.UI_Popup);