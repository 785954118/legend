/**神兽装备提示 */
class ShenshouEquipTip extends BaseEuiView {
	//组件部分---------------------------------
	private bgClose: eui.Rect;
	public anigroup: eui.Group;
	public background: eui.Image;
	/**品质 */
	public quali: eui.Image;
	/**装备图标 */
	public equipIcon: ItemBase;
	/**名字 */
	public nameTxt: eui.Label;
	/**部分类型 */
	public type: eui.Label;
	/**基础属性组 */
	public baseAttr: eui.Group;
	public attr1: eui.Label;
	public forgeAttr1: eui.Label;
	public attr2: eui.Label;
	public forgeAttr2: eui.Label;
	public attr3: eui.Label;
	public forgeAttr3: eui.Label;
	/** 星级属性组*/
	public starAttr: eui.Group;
	public starAttr1: eui.Label;
	public starAttr2: eui.Label;
	public starAttr3: eui.Label;
	/**当前装备等级 */
	public lv: eui.Label;
	/**战力面板 */
	public powerPanel: PowerPanel;
	public levelKey: eui.Label;
	/**类型 */
	public career: eui.Label;
	/**更换装备 */
	public changeBtn: eui.Button;
	/**强化装备 */
	public forgeBtn: eui.Button;
	/**卸装备 */
	public takeoffBtn: eui.Button;
	/**更换红点 */
	public changeRedPoint: eui.Image;
	/**强化红点 */
	public forgeRedPoint: eui.Image;

	//数据部分---------------------------------
	private shenshouId: number;
	private pos: number;
	private itemDp: ItemConfig;
	private posType: string[] = [`血瞳`, `魔躯`, `妖尾`, `圣角`, `鬼爪`];
	public constructor() {
		super();
		this.skinName = `shenshouEquipTips`;
	}
	public open(...args): void {
		this.addTouchEvent(this.bgClose, this.onTouch);
		this.addTouchEvent(this.changeBtn, this.onTouch);
		this.addTouchEvent(this.takeoffBtn, this.onTouch);
		this.addTouchEvent(this.forgeBtn, this.onTouch);

		this.shenshouId = args[0];
		this.pos = args[1];
		if (!this.shenshouId) {//背包提示中，不显示操作按钮
			this.changeBtn.visible = false;
			this.forgeBtn.visible = false;
			this.takeoffBtn.visible = false;
			this.changeRedPoint.visible = false;
			this.forgeRedPoint.visible = false;
			this.anigroup.height = 505;
		}
		else {
			this.refRedpoint();

			let data = ShenshouModel.ins().getDataById(this.shenshouId);
			if (data.state == ShenshouState.State_No) {
				this.forgeBtn.visible = false;
			}
		}


		this.itemDp = GlobalConfig.ItemConfig[args[2]];
		this.initUi();
	}
	public close(...args): void {

	}
	private initUi(): void {
		let quality: number = ItemConfig.getQuality(this.itemDp);
		this.quali.source = quality ? `quali${quality}` : ``;
		this.equipIcon.data = this.itemDp.id;
		this.equipIcon.hideName();

		//基本属性
		this.nameTxt.text = this.itemDp.name;
		this.nameTxt.textColor = ItemConfig.getQualityColor(this.itemDp);
		this.type.text = this.posType[ItemConfig.getSubType(this.itemDp)];
		this.lv.text = ShenshouModel.ins().getEquipLv(this.itemDp.id) + "级";
		this.career.text = `兽神`;


		let equipDp = GlobalConfig.ShenShouEquip[this.itemDp.id];
		let score: number = UserBag.getAttrPower(equipDp.attrs);
		if (equipDp.expower) score += equipDp.expower;
		this.powerPanel.setPower(score * SubRoles.ins().subRolesLen);
         
		//获取基础装备配置
		let baseEquip = GlobalConfig.ShenShouEquip[ShenshouModel.ins().getEquipBaseId(this.itemDp.id)];
		//当前的基础属性
		let nowAttr = ShenshouModel.ins().getNowAttr(baseEquip);
		//属性
		for (let i: number = 0; i < 3; i++) {
			if (nowAttr[i]) {
				this[`attr${i + 1}`].visible = true;
				//1级基础属性
				this[`attr${i + 1}`].text = AttributeData.getAttStrByType(nowAttr[i], 0, `:`);

				let addValue: number = equipDp.attrs[i].value - baseEquip.attrs[i].value;
				this[`forgeAttr${i + 1}`].visible = baseEquip && baseEquip.id != equipDp.id && addValue > 0;
				//当前属性减去星级属性 再减1级属性（逻辑有点绕）
				if (baseEquip && baseEquip.id != equipDp.id && addValue > 0)
					this[`forgeAttr${i + 1}`].text = `+${addValue}`;
			}
			else {
				this[`attr${i + 1}`].visible = false;
				this[`forgeAttr${i + 1}`].visible = false;
			}

		}

		//星级属性
		for (let i: number = 0; i < 3; i++) {
			if (equipDp.starattrs[i]) {
				this[`starAttr${i + 1}`].visible = true;
				this[`starAttr${i + 1}`].text = AttributeData.getAttStrByType(equipDp.starattrs[i], 0, `:`);
			}
			else {
				this[`starAttr${i + 1}`].visible = false;
			}

		}

	}
	private onTouch(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.bgClose:

				break;
			case this.changeBtn:
				ViewManager.ins().open(ShenshouWearEquipWin, this.shenshouId, this.pos, this.itemDp.id);
				break;
			case this.takeoffBtn:
				if (ShenshouModel.ins().getDataById(this.shenshouId).state == ShenshouState.State_Has) {
					UserTips.ins().showCenterTips(`请先取消出战`);
					return;
				}
				ShenshouSys.ins().sendWearEquip(this.shenshouId, this.pos, 0);
				break;
			case this.forgeBtn:
				ViewManager.ins().open(ShenshouForgeWin, this.shenshouId, this.pos, this.itemDp);
				break;
		}
		ViewManager.ins().close(this);
	}
	/**刷新红点 */
	private refRedpoint(): void {

		this.changeRedPoint.visible = ShenshouRedpoint.ins().redpointEquips1[this.shenshouId] && ShenshouRedpoint.ins().redpointEquips1[this.shenshouId][this.pos];
		this.forgeRedPoint.visible = ShenshouRedpoint.ins().redpointEquips2[this.shenshouId] && ShenshouRedpoint.ins().redpointEquips2[this.shenshouId][this.pos];
	}
}
ViewManager.ins().reg(ShenshouEquipTip, LayerManager.UI_Popup);