class NobleShopItemRender extends BaseItemRender {
	private itemIcon: ItemIcon;
	private textBG: eui.Image;
	private used: eui.Label;
	private itemName: eui.Label;
	private money: eui.Label;
	private money0: eui.Label;
	private buyBtn: eui.Button;

	public goodsID;
	public shopType: number = 2;

	public constructor() {

		super();
		this.goodsID = 0;

		this.skinName = "NobleshoSkinItemShopItem";
		this.itemIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showTip, this);
		this.itemIcon.imgJob.visible = false;
	}

	public dataChanged(): void {
		let shopItem: IntegralStore = this.data;
		if (!shopItem) return;
		let itemConfig = GlobalConfig.ItemConfig[shopItem.itemId];
		this.goodsID = shopItem.index;

		let costStr = "";
		if (shopItem.price > 100000) {
			costStr = Math.floor(shopItem.price / 10000) + "万";
		} else {
			costStr = shopItem.price + "";
		}

		this.money0.text = costStr;

		if (shopItem.showYuanBao > 100000) {
			costStr = Math.floor(shopItem.showYuanBao / 10000) + "万";
		} else {
			costStr = shopItem.showYuanBao + "";
		}

		this.money.text = costStr;
		this.itemName.text = itemConfig.name;
		this.itemName.textColor = ItemConfig.getQualityColor(itemConfig);
		this.used.text = "（" + shopItem.use + "）";
		this.used.x = this.itemName.x + this.itemName.width;
		// this.textBG.source = BlackMarketItemRenderer.qualityToTextBG[itemConfig.quality];

		if (this.itemIcon && this.itemIcon.setData) {
			this.itemIcon.setData(itemConfig);
		}
	}

	private showTip() {
		let items = GlobalConfig.IntegralStore;
		let configID;
		if (items[this.goodsID]) {
			configID = items[this.goodsID].itemId;
		}
		// for (let k in items) {
		// 	if (items[k].itemId == this.goodsID) {
		// 		configID = items[k].itemId;
		// 	}
		// }

		if (configID == undefined) {
			new Error("竟然没有找到该商品ID");
		}

		let itemConfig = GlobalConfig.ItemConfig[configID];

		ViewManager.ins().open(ItemDetailedWin, 0, itemConfig.id, 1);

	}
}