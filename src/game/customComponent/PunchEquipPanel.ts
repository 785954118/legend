class PunchEquipPanel extends BaseEuiView {
	public item1: PunchEquipItem;
	public item2: PunchEquipItem;
	public item3: PunchEquipItem;
	public item4: PunchEquipItem;
	public item5: PunchEquipItem;
	public item6: PunchEquipItem;
	public item7: PunchEquipItem;
	public item8: PunchEquipItem;
	// public tupoBtn: eui.Button;
	// public resetBtn: eui.Button;
	// public help: eui.Button;
	private attrsText: eui.Label;
	// private powerGroup: eui.Group;
	/** 战斗力 */
		// private power: egret.DisplayObjectContainer;
	private powerPanel: PowerPanel;

	constructor() {
		super();
		this.skinName = "PunchEquip";
		this.isTopLevel = true;
		// this.setSkinPart("powerPanel", new PowerPanel());
	}

	public initUI(): void {
		super.initUI();

		// this.power = BitmapNumber.ins().createNumPic(0, "8", 10);
		// this.power.x = 80;
		// this.power.y = 11;

	}

	public open(...param: any[]): void {
		// this.powerGroup.addChild(this.power);
		// this.resetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.tupoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.help.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// App.MessageCenter.addListener(MessagerEvent.WEAR_SUCCESS_BACK, this.refushOne, this);
		// App.MessageCenter.addListener(MessagerEvent.SAVE_WRESET_ATT, this.refushPanelInfo, this);
		this.observe(UserSkill.ins().postHejiEquipChange, this.refushPanelInfo);
		this.refushPanelInfo();
		this.reufshRolePoint();
	}

	private refushPanelInfo(): void {
		let attData: AttributeData[] = [];
		for (let i: number = 1; i < 9; i++) {
			this["item" + i].data = i - 1;

			let item = UserSkill.ins().equipListData[i - 1];
			if (attData.length == 0) {
				attData = item.att;
			} else {
				attData = AttributeData.AttrAddition(attData, item.att);
			}
		}
		// BitmapNumber.ins().changeNum(this.power, this.countAllAttNum(), "8", 2);
		// BitmapNumber.ins().changeNum(this.power, 998, "8", 2);
		this.powerPanel.setPower(998);
		this.attrsText.text = AttributeData.getAttStr(attData);
	}

	private refushOne(index: number): void {
		this["item" + (index + 1)].data = index;
		if (ViewManager.ins().isShow(PunchEquipChooseWin))
			ViewManager.ins().close(PunchEquipChooseWin);
		// BitmapNumber.ins().changeNum(this.power, this.countAllAttNum(), "8", 2);
		// BitmapNumber.ins().changeNum(this.power, 990, "8", 2);
		this.powerPanel.setPower(998);
	}

	public reufshRolePoint(): void {
		// for (let i: number = 0; i < 3; i++) {
		// 	let flag: boolean = GameGlobal.LunhuiEquipsModel.checkJobIsCanChange(i);;
		// }
	}

	private countAllAttNum(): number {
		// let equipList: ItemData[] = GameGlobal.LunhuiEquipsModel.getRoleLunHuiEquip(this.roleSelect.curRole);
		let num: number = 0;
		// let len: number = equipList.length;
		// if (equipList && equipList.length <= 0)
		// 	return 0;
		// for (let i: number = 0; i < len; i++) {
		// 	let item: ItemData = equipList[i];
		// 	if (item)
		// num += GameGlobal.getAttrPower(item.att);
		// }

		return num;
	}

	private selectIndex: number = 0;

	private onTap(event: egret.TouchEvent): void {
		this.selectIndex = 0;
		switch (event.target) {
			default:

				break;
		}
	}
}

ViewManager.ins().reg(PunchEquipPanel, LayerManager.UI_Main);
