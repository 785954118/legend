/**
 *
 * @author hepeiye
 *
 */
class BuyWin extends BaseEuiView {

	private add1Btn: eui.Button;
	private add10Btn: eui.Button;
	private sub1Btn: eui.Button;
	private sub10Btn: eui.Button;
	private buyBtn: eui.Button;
	private closeBtn: eui.Button;
	// private closeBtn0: eui.Button;

	private itemIcon: ItemIcon;
	// private textBG: eui.Image;

	private unitPrice: eui.Label;
	private allPrice: eui.Label;
	private numLabel: eui.Label;
	private itemName: eui.Label;
	private itemName0: eui.Label;
	private used: eui.Label;
	/** 道具id */
	public shopID: number;
	/**商店类型 0 没有(神秘) 1 ，没有(道具) 2 功勋商店 */
	public shopType: number;
	/** 道具的表格索引id 不是道具id */
	private goodId: number;
	public num: number;
	private maxNum: number;//最大可购买个数

	private bgClose: eui.Rect;
	private yuanbao0: eui.Image;
	private yuanbao1: eui.Image;
	private honor0: eui.Image;
	private honor1: eui.Image;

	constructor() {
		super();
	}

	public initUI(): void {
		super.initUI();

		this.skinName = "BuySkin";
		this.num = 1;
		this.itemIcon.imgJob.visible = false;
	}

	public open(...param: any[]): void {
		// this.addTouchEvent(this.closeBtn, this.closeCB);
		// this.addTouchEvent(// this.closeBtn0, this.closeCB);
		this.addTouchEvent(this.add1Btn, this.onTap);
		this.addTouchEvent(this.add10Btn, this.onTap);
		this.addTouchEvent(this.sub1Btn, this.onTap);
		this.addTouchEvent(this.sub10Btn, this.onTap);
		this.addTouchEvent(this.buyBtn, this.buy);
		this.addTouchEvent(this.bgClose, this.onTap);
		this.addChangeEvent(this.numLabel, this.inputOver);

		this.num = 1;
		this.shopID = param[0];
		this.shopType = param[1] ? param[1] : 0;
		this.yuanbao0.visible = this.yuanbao1.visible = true;
		if (this.shopType == 2 || this.shopType == 3) {
			this.yuanbao0.visible = this.yuanbao1.visible = false;
			//筹码商店默认显示数量规则
			this.num = this.getChipNumRule();
			this.honor0.source = this.shopType == 2 ? `ZSchip` : `204076_png`;
			this.honor1.source = this.shopType == 2 ? `ZSchip` : `204076_png`;
		}

		this.honor0.visible = this.honor1.visible = !this.yuanbao0.visible;
		this.updateView();
	}

	public close(...param: any[]): void {
		// this.removeTouchEvent(this.closeBtn, this.closeCB);
		// this.removeTouchEvent(// this.closeBtn0, this.closeCB);
		this.removeTouchEvent(this.add1Btn, this.onTap);
		this.removeTouchEvent(this.add10Btn, this.onTap);
		this.removeTouchEvent(this.sub1Btn, this.onTap);
		this.removeTouchEvent(this.sub10Btn, this.onTap);
		this.removeTouchEvent(this.buyBtn, this.buy);
		this.removeTouchEvent(this.bgClose, this.onTap);
		this.numLabel.removeEventListener(egret.Event.CHANGE, this.inputOver, this);
	}

	private getChipNumRule() {
		let feats: FeatsStore = GlobalConfig.FeatsStore[this.shopID];
		let sum: number = 0;
		if (feats.shopType == FEATS_SHOP_TYPE.Money) {
			if (Actor.chip < feats.costMoney.count) {
				this.maxNum = 1;
				return this.maxNum;
			}
			sum = Math.floor(Actor.chip / feats.costMoney.count);
		}
		else if (feats.shopType == FEATS_SHOP_TYPE.Item) {
			let costItemNum = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, feats.costItem.id);
			if (costItemNum < feats.costItem.count) {
				this.maxNum = 1;
				return this.maxNum;
			}
			sum = Math.floor(costItemNum / feats.costItem.count);
		}


		let count: number = 0;
		if (!Shop.ins().medalData) return 0;
		let exchangeCount = Shop.ins().medalData.exchangeCount[this.shopID];
		exchangeCount = exchangeCount ? exchangeCount : 0;
		switch (feats.buyType) {
			case FEATS_TYPE.day:
				count = feats.daycount - exchangeCount;
				count = count > 0 ? count : 1;//剩余可购买份数
				count = count > sum ? sum : count;//可允许购买最多份数
				break;
			case FEATS_TYPE.infinite:
				count = sum;
				break;
			case FEATS_TYPE.forever:
				count = feats.daycount - exchangeCount;
				count = count > 0 ? count : 1;//剩余可购买份数
				count = count > sum ? sum : count;//可允许购买最多份数
				break;
		}
		this.maxNum = count;
		return this.maxNum;
	}

	private updateView(): void {
		let shopConfig;
		let itemConfig;
		if (this.shopType != 2 && this.shopType != 3) {
			// shopConfig = GlobalConfig.IntegralStore[this.shopID];
			// this.goodId = shopConfig.index;
			shopConfig = GlobalConfig.ItemStoreConfig[this.shopID];

			itemConfig = GlobalConfig.ItemConfig[shopConfig.itemId];
			this.itemIcon.setData(itemConfig);
			if (shopConfig.vipLimit) {
				this.maxNum = shopConfig.vipLimit[UserVip.ins().lv] - Shop.ins().shopData.getHadBuyCount(shopConfig.itemId);
				this.itemName0.text = `还可购买${this.maxNum}次`;
				this.itemName0.visible = true;
			} else {
				this.maxNum = Number.MAX_VALUE;
				this.itemName0.visible = false;
			}

			if (this.num > this.maxNum) {
				this.num = this.maxNum;
			}

			this.unitPrice.text = shopConfig.price + "";
			this.allPrice.text = (this.num * shopConfig.price) + "";
			this.numLabel.text = this.num + "";
			this.itemName.text = itemConfig.name;
			this.itemName.textColor = ItemBase.QUALITY_COLOR[ItemConfig.getQuality(itemConfig)];
			this.used.text = "（" + shopConfig.use + "）";
			this.used.x = this.itemName.x + this.itemName.width;

			// this.textBG.source = BlackMarketItemRenderer.qualityToTextBG[itemConfig.quality];
			return;
		}
		//功勋商店购买
		this.itemName0.visible = false;
		shopConfig = GlobalConfig.FeatsStore[this.shopID];
		itemConfig = GlobalConfig.ItemConfig[shopConfig.goods[0].id];
		this.itemIcon.setData(itemConfig);
		this.goodId = shopConfig.index;
		if (this.shopType == 2) this.unitPrice.text = shopConfig.costMoney.count + "";
		else if (this.shopType == 3) this.unitPrice.text = shopConfig.costItem.count + "";

		this.allPrice.text = (this.num * parseInt(this.unitPrice.text)) + "";
		this.numLabel.text = this.num + "";
		this.itemName.text = itemConfig.name;
		this.itemName.textColor = ItemBase.QUALITY_COLOR[ItemConfig.getQuality(itemConfig)];
		this.used.text = "（" + shopConfig.use + "）";
		// this.used.x = this.itemName.x + this.itemName.width;
	}

	private onTap(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.sub10Btn:
				this.num -= 10;
				break;
			case this.sub1Btn:
				this.num -= 1;
				break;
			case this.add10Btn:
				this.num += 10;
				break;
			case this.add1Btn:
				this.num += 1;
				break;
			case this.bgClose:
				ViewManager.ins().close(this);
				break;
		}

		if (this.num < 1)
			this.num = 1;
		if (this.num > this.maxNum) {
			this.num = this.maxNum;
		}

		this.numLabel.text = this.num + "";
		this.inputOver();
	}

	private closeCB(e: egret.TouchEvent) {
		ViewManager.ins().close(BuyWin);
	}

	private buy(e: egret.TouchEvent) {
		if (this.shopType == 2) {
			if (Actor.chip >= parseInt(this.allPrice.text)) {
				Shop.ins().sendBuyMedal(this.goodId, this.num);
				ViewManager.ins().close(this);
			} else {
				UserTips.ins().showTips("|C:0xf3311e&T:筹码不足|");
			}

		} else if (this.shopType == 3) {
			let feats: FeatsStore = GlobalConfig.FeatsStore[this.shopID];
			if (UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, feats.costItem.id) >= parseInt(this.allPrice.text)) {
				Shop.ins().sendBuyMedal(this.goodId, this.num);
				ViewManager.ins().close(this);
			}
			else
				UserTips.ins().showTips("|C:0xf3311e&T:巅峰令不足|");
		}
		else {
			if (Actor.yb >= parseInt(this.allPrice.text)) {
				let arr = [this.shopID, this.num];  //0:id, 1:num
				Shop.ins().sendBuy(1, [arr]);
				ViewManager.ins().close(this);
			} else {
				UserTips.ins().showTips("|C:0xf3311e&T:元宝不足|");
			}
		}


	}

	private inputOver(e?: egret.Event) {
		this.num = parseInt(this.numLabel.text);
		if (isNaN(this.num) || this.num < 1)
			this.num = 1;
		if (this.num > 9999)
			this.num = 9999;
		if (this.num > this.maxNum) {
			this.num = this.maxNum;
		}
		this.numLabel.text = this.num + "";
		this.allPrice.text = (this.num * parseInt(this.unitPrice.text)) + "";
	}

}

ViewManager.ins().reg(BuyWin, LayerManager.UI_Popup);
