/**
 * 神兽守护-穿戴装备
 * @author MPeter
 */
class ShenshouWearEquipItem extends BaseItemRender {
	public attr0: eui.Label;
	public betterArrow0: eui.Image;
	public forgeAttr0: eui.Label;
	public attr1: eui.Label;
	public betterArrow1: eui.Image;
	public forgeAttr1: eui.Label;
	public attr2: eui.Label;
	public betterArrow2: eui.Image;
	public forgeAttr2: eui.Label;
	public quality: eui.Label;
	public power: eui.Label;
	/**更换按钮 */
	public changeBtn: eui.Button;
	/**图标 */
	public itemIcon: ItemBase;
	/**最合适 */
	public best: eui.Image;
	/**当前使用 */
	public now: eui.Group;

	public constructor() {
		super();
	}
	public childrenCreated(): void {

	}
	protected dataChanged(): void {
		if (this.data instanceof ShenshouEquipData) {
			this.itemIcon.data = this.data.id;
			let itemConfig = GlobalConfig.ItemConfig[this.data.id];
			this.quality.text = ShenshouModel.EQUIPE_QUALITY_CN[ItemConfig.getQuality(itemConfig)];
			this.quality.textColor = ItemConfig.getQualityColor(itemConfig);

			this.now.visible = false;
			this.best.visible = false;
			this.changeBtn.visible = true;
			//自己的
			if (this.data.sortIndex == Number.MAX_VALUE) {
				this.now.visible = true;
				this.changeBtn.visible = false;
			}
			//最适合的
			if (this.data.best) {
				this.best.visible = true;
			}

			let baseEquip = GlobalConfig.ShenShouEquip[ShenshouModel.ins().getEquipBaseId(this.data.id)];
			let equipDp = GlobalConfig.ShenShouEquip[this.data.id];
			//获取我当前装备位的装备
			let myDt = ShenshouModel.ins().getDataById(this.data.shenshuId);
			let myBaseEquip = myDt ? GlobalConfig.ShenShouEquip[ShenshouModel.ins().getEquipBaseId(myDt.equipIDs[this.data.pos])] : null;
			//最大只显示3个属性
			for (let i: number = 0; i < 3; i++) {
				if (equipDp.attrs[i]) {
					this[`attr${i}`].visible = true;
					this[`attr${i}`].text = AttributeData.getAttStrByType(baseEquip.attrs[i], 0, `:`);

					//比当前强
					this[`betterArrow${i}`].visible = !myBaseEquip || myBaseEquip && baseEquip.attrs[i].value > myBaseEquip.attrs[i].value;
					if (equipDp.attrs[i].value > baseEquip.attrs[i].value) {
						this[`forgeAttr${i}`].visible = true;
						this[`forgeAttr${i}`].text = `+${equipDp.attrs[i].value - baseEquip.attrs[i].value}`;
					}
					else {
						this[`forgeAttr${i}`].visible = false;
					}

				}
				else {
					this[`attr${i}`].visible = false;
					this[`betterArrow${i}`].visible = false;
					this[`forgeAttr${i}`].visible = false;
				}
			}

			let score: number = UserBag.getAttrPower(equipDp.attrs);
			if (equipDp.expower) score += equipDp.expower;
			//三个角色
			this.power.text = `评分：${score * 3}`;
		}
	}

}