/**
 * 时装Tips
 */
class DressTipsWin extends BaseEuiView {
	public bgClose: eui.Rect;
	public anigroup: eui.Group;
	public background: eui.Image;
	public content: eui.Group;
	public itemname: eui.Label;
	public style: eui.Label;
	public quali: eui.Image;
	public bottomD: eui.Group;
	public dress: eui.Group;
	public dressName: eui.Image;
	public takeBtn: eui.Button;
	public powerPanel: PowerPanel;
	public module: eui.Image;

	private itemConfig: ItemConfig;
	private itemId: number;
	private itemData: ZhuangBanId;

	public constructor() {
		super();
		this.skinName = "DressTipsSkin";
	}

	public open(...param: any[]): void {
		this.itemConfig = param[0];
		this.itemId = this.itemConfig.id;

		this.addTouchEvent(this.takeBtn, this.onTap);
		this.addTouchEndEvent(this, this.otherClose);

		this.setTipsData();
	}

	public close(): void {
		this.itemData = null;
	}

	/**
	 * 设置Tips显示内容
	 */
	private setTipsData(): void {
		let data = this.getIdByItemId(this.itemId);
		this.itemData = data;
		if (!data) return;
		let attr: AttributeData[] = data.attr;
		let power: number = UserBag.getAttrPower(AttributeData.transformAttr(attr));
		this.powerPanel.setPower(power);
		this.itemname.text = data.name;
		let res = data.show_img;//data.res + "_0_c_png";
		// if(data.pos == DressType.WING)
		// 	res = data.res + "_png";
		this.module.source = res;
		this.quali.source = "quali" + ItemConfig.getQuality(this.itemConfig);
		this.style.text = DressTypeName[data.pos];
		this.dressName.source = data.dress_name + "_png";

		let equip: EquipTipsItemBase = new EquipTipsItemBase();
		equip.data = {title: "普通属性", attributeData: attr, colorName: 0, colorValue: 0, others: null};
		this.content.addChild(equip);
		if (data.special_attr_desc) {
			let special: DressSpecialTipsBase = new DressSpecialTipsBase();
			special.setData({title: `特殊属性`, attrDesc: data.special_attr_desc});
			this.content.addChild(special);
		}
	}

	private onTap(): void {
		ViewManager.ins().open(DressWin, 0, this.itemData.pos - 1, this.itemData.id);
	}

	private otherClose(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	private getIdByItemId(itemId: number): ZhuangBanId {
		let allData = GlobalConfig.ZhuangBanId;
		for (let key in allData) {
			let element = allData[key];
			if (element.cost.itemId == itemId) {
				return element;
			}
		}
		return null;
	}
}

ViewManager.ins().reg(DressTipsWin, LayerManager.UI_Popup);