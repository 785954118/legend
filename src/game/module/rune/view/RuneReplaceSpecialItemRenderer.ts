/**
 * 战纹替换特殊道具渲染器
 */
class RuneReplaceSpecialItemRenderer extends eui.ItemRenderer {
	public itemIcon: ItemIcon;
	public nameLab: eui.Label;
	public specialEffLab: eui.Label;
	public power: eui.Label;
	public numLab: eui.Label;

	public constructor() {
		super();
	}

	public dataChanged(): void {
		let itemData: ItemData = this.data as ItemData;
		if (itemData && itemData instanceof ItemData) {
			let rbc: RuneBaseConfig = RuneConfigMgr.ins().getBaseCfg(itemData);
			//图标
			this.itemIcon.setData(itemData.itemConfig);
			//名字
			this.nameLab.textFlow = new egret.HtmlTextParser().parser("<font color = '" + ItemConfig.getQualityColor(itemData.itemConfig) + "'>" + itemData.itemConfig.name + "</font>");
			//战力
			if(rbc.attr){
				this.power.text = "评分：" + UserBag.getAttrPower(rbc.attr);
			} else {
				this.power.text = "评分：" + rbc.power;
			}
			//数量
			this.numLab.text = itemData.count.toString();
			//描述
			this.specialEffLab.text = rbc.specialDesc;
		}
		else {
			this.resetView();
		}
	}

	private resetView(): void {
		this.itemIcon.setData(null);
		this.nameLab.text = "";
		this.specialEffLab.text = "";
		this.power.text = "";
		this.numLab.text = "";
	}
}