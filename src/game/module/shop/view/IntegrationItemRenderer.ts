class IntegrationItemRenderer extends BaseItemRender {

	public item: ItemBase;
	public buyBtn: eui.Button;
	public textBG: eui.Image;
	public itemName: eui.Label;
	public money: eui.Label;
	public used: eui.Label;
	public integration: eui.Label;

	public goodsID;

	public constructor() {
		super();
		this.skinName = "ShopPointItem";
		this.item = new ItemBase();
		this.item.x = 21;
		this.item.y = 8;
		this.item.isShowName(false);
		this.addChild(this.item);
	}

	public dataChanged(): void {
		let shopItem: IntegralStore = this.data;
		let itemConfig = GlobalConfig.ItemConfig[shopItem.itemId];
		if (itemConfig == undefined) return;
		this.goodsID = shopItem.index;
		this.money.text = CommonUtils.overLength(shopItem.price);
		this.integration.text = CommonUtils.overLength(shopItem.integral);
		this.itemName.text = itemConfig.name;
		this.itemName.textColor = ItemConfig.getQualityColor(itemConfig);
		// this.textBG.source = BlackMarketItemRenderer.qualityToTextBG[itemConfig.quality];
		this.used.text = "";//"（" + shopItem.type + "）";
		this.used.x = this.itemName.x + this.itemName.width;
		let red: RewardData = new RewardData();
		red.id = itemConfig.id;
		red.count = shopItem.count;
		red.type = shopItem.type;
		this.item.data = red;
		// this.item.num = shopItem.count;
	}
}