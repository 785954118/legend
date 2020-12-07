class HonorMarketItemRenderer extends BaseItemRender {
	private itemIcon: ItemIcon;
	private textBG: eui.Image;

	private itemName: eui.Label;
	private money: eui.Label;
	private num: eui.Label;
	private moneyIcon: eui.Image;

	private buyBtn: eui.Button;

	public goodsID;
	private myTimes: eui.Label;
	private usage: eui.Label;
	constructor() {
		super();
		this.goodsID = 0;

		this.skinName = "HonorMarketItemSkin";
		this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.itemIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showTip, this);
		this.itemIcon.imgJob.visible = false;
	}
	private isShowTips: boolean;
	public dataChanged(): void {
		let shopItem: FeatsStore = this.data;
		if (!shopItem || !(shopItem instanceof FeatsStore)) return;
		this.goodsID = shopItem.goods[0].id;
		let itemConfig = GlobalConfig.ItemConfig[this.goodsID];
		if (!itemConfig) return;
		this.isShowTips = false;

		if (shopItem.shopType == FEATS_SHOP_TYPE.Money) {
			this.money.text = shopItem.costMoney.count + "";
			this.moneyIcon.source = `ZSchip`;
		}
		else if (shopItem.shopType == FEATS_SHOP_TYPE.Item) {
			this.money.text = shopItem.costItem.count + "";
			this.moneyIcon.source = `204076_png`;
		}

		this.itemName.text = itemConfig.name;
		this.itemName.textColor = ItemConfig.getQualityColor(itemConfig);
		this.num.text = shopItem.goods[0].count + "";


		// this.textBG.source = BlackMarketItemRenderer.qualityToTextBG[itemConfig.quality];
		// this.myTimes.textFlow = TextFlowMaker.generateTextFlow1()

		if (this.itemIcon && this.itemIcon.setData) {
			this.itemIcon.setData(itemConfig);
		}
		if (shopItem.use)
			this.usage.text = `（${shopItem.use}）`;

		if (shopItem.buyType == FEATS_TYPE.forever) {
			this.myTimes.visible = true;
			//永久限购
			let myCount:number = Shop.ins().medalData.exchangeCount[shopItem.index];
			myCount = myCount ? myCount : 0;
			let textcolor = this.myTimes.textColor;
			let colorStr: number;
			let str: string = "";
			if (shopItem.daycount) {
				if (myCount >= shopItem.daycount) {
					colorStr = ColorUtil.RED;
					str = `永久限购:|C:${colorStr}&T:${myCount}/${shopItem.daycount}`;
				}
				else {
					colorStr = ColorUtil.GREEN;
					str = `永久限购:|C:${colorStr}&T:${myCount}|/|C:${textcolor}&T:${shopItem.daycount}`;
				}
			}
			this.myTimes.textFlow = TextFlowMaker.generateTextFlow1(str);
		} else if (shopItem.buyType == FEATS_TYPE.infinite) {
			//不限次数
			this.myTimes.visible = false;

		} else if (shopItem.buyType == FEATS_TYPE.day) {
			this.myTimes.visible = true;
			//每日限购
			let myCount:number = Shop.ins().medalData.exchangeCount[shopItem.index];
			myCount = myCount ? myCount : 0;
			let textcolor = this.myTimes.textColor;
			let colorStr: number;
			let str: string = "";
			if (shopItem.daycount) {
				if (myCount >= shopItem.daycount) {
					colorStr = ColorUtil.RED;
					str = `每日限购:|C:${colorStr}&T:${myCount}/${shopItem.daycount}`;
					this.isShowTips = true;
				}
				else {
					colorStr = ColorUtil.GREEN;
					str = `每日限购:|C:${colorStr}&T:${myCount}|/|C:${textcolor}&T:${shopItem.daycount}`;
				}
			}

			this.myTimes.textFlow = TextFlowMaker.generateTextFlow1(str);

		}

	}
	private onClick() {
		if (this.isShowTips) {
			UserTips.ins().showTips(`|C:${0xff0000}&T:今日已无兑换次数，请明日再来`);
			return;
		}
		if (this.data.shopType == FEATS_SHOP_TYPE.Money) {
			ViewManager.ins().open(BuyWin, this.data.index, 2);//2代表区分筹码商店
		}
		else if (this.data.shopType == FEATS_SHOP_TYPE.Item) {
			ViewManager.ins().open(BuyWin, this.data.index, 3);//3代表区巅峰
		}

	}
	private showTip() {
		let items = GlobalConfig.FeatsStore;
		let configID;
		for (let k in items) {
			if (items[k].goods[0].id == this.goodsID) {
				configID = items[k].goods[0].id;
			}
		}

		if (configID == undefined) {
			new Error("竟然没有找到该商品ID");
		}

		let itemConfig = GlobalConfig.ItemConfig[configID];
		let shopItem: FeatsStore = this.data;
		ViewManager.ins().open(ItemDetailedWin, 0, itemConfig.id, shopItem.goods[0].count);

	}

}