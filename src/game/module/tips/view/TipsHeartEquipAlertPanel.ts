class TipsHeartEquipAlertPanel extends BaseView {
	// public itemName: eui.Label;
	public desc: eui.Label;
	public itemName: eui.Label;
	public item: ItemBase;
	public isUsing: boolean;

	constructor() {
		super();
		// this.skinName = "SkillNoticeSkin";
		this.skinName = "guardGodWeaponNoticeTip";

		this.isUsing = false;
		this.horizontalCenter = 0;
		// this.verticalCenter = 0;
	}

	public set data(itemid: number) {
		let itemConfig:ItemConfig = GlobalConfig.ItemConfig[itemid];
		this.item.setItemImg(itemConfig.icon + "_png");
		this.item.isShowJob(false);
		this.item.setImgBg(ItemConfig.getQuality(itemConfig));
		let color = ItemConfig.getQualityColor(itemConfig);
		this.desc.textFlow = TextFlowMaker.generateTextFlow1(`C:${color}&T:${itemConfig.name}`);
		this.itemName.visible = false;
		// this.itemName.text = itemConfig.name;
		// this.itemName.textColor = ItemBase.QUALITY_COLOR[4];
		this.item.isShowName(false);
		this.item.showNum(false);


	}
}
